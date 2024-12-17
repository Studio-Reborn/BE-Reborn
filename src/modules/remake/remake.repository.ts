/**
File Name : remake.repository
Description : 리본 리메이크 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 요청 기능 추가
2024.11.08  이유민      Modified    리본 리메이크 제품 조회 추가
2024.11.18  이유민      Modified    리본 리메이크 제품 CRUD 추가
2024.11.28  이유민      Modified    리본 리메이크 제품 개별 조회 수정
2024.12.04  이유민      Modified    요청 조회 기능 추가
2024.12.04  이유민      Modified    요청 삭제 기능 추가
2024.12.17  이유민      Modified    코드 리팩토링
*/
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Remake, RemakeProduct } from 'src/modules/remake/remake.entity';

@Injectable()
export class RemakeRepository {
  constructor(
    @InjectRepository(Remake)
    private readonly remakeRepository: Repository<Remake>,
    @InjectRepository(RemakeProduct)
    private readonly remakeProductRepository: Repository<RemakeProduct>,
  ) {}

  // 리메이크 요청 생성
  async createRemake(remakeData: Partial<Remake>): Promise<Remake> {
    const remake = this.remakeRepository.create(remakeData);
    return await this.remakeRepository.save(remake);
  }

  // 리메이크 요청 제품 전체 조회
  async findRequestProductAll(): Promise<Remake[]> {
    return await this.remakeRepository
      .createQueryBuilder('request')
      .leftJoin('users', 'users', 'request.user_id = users.id')
      .addSelect([
        'users.nickname AS user_nickname',
        'users.phone AS user_phone',
      ])
      .where('request.deleted_at IS NULL')
      .getRawMany();
  }

  // 리메이크 요청 제품 삭제
  async deleteRequestById(id: number): Promise<object> {
    const request = await this.remakeRepository
      .createQueryBuilder('request')
      .where('request.id = :id AND request.deleted_at IS NULL', { id })
      .getOne();

    if (!request) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    request.deleted_at = new Date();
    await this.remakeRepository.save(request);

    return { message: '리메이크 요청이 성공적으로 삭제되었습니다.' };
  }

  // 리메이크 제품 생성
  async createRemakeProduct(
    productData: Partial<RemakeProduct>,
  ): Promise<object> {
    const product = this.remakeProductRepository.create(productData);
    await this.remakeProductRepository.save(product);

    return { message: '리메이크 제품이 성공적으로 생성되었습니다.' };
  }

  // 리메이크 제품 전체 조회
  async findRemakeProductAll(): Promise<RemakeProduct[]> {
    return await this.remakeProductRepository
      .createQueryBuilder('rproduct')
      .leftJoin(
        'product_image',
        'image',
        'rproduct.product_image_id = image.id',
      )
      .select([
        'rproduct.created_at AS created_at',
        'rproduct.deleted_at AS deleted_at',
        'rproduct.updated_at AS updated_at',
        'rproduct.detail AS detail',
        'rproduct.id AS id',
        'rproduct.matter AS matter',
        'rproduct.name AS name',
        'rproduct.price AS price',
        'rproduct.product_image_id AS product_image_id',
        'image.url AS product_image_url',
      ])
      .where('rproduct.deleted_at IS NULL')
      .getRawMany();
  }

  // 리메이크 제품 개별 조회
  async findRemakeProductById(id: number): Promise<RemakeProduct> {
    return await this.remakeProductRepository
      .createQueryBuilder('rproduct')
      .leftJoin(
        'product_image',
        'product_image',
        'rproduct.product_image_id = product_image.id',
      )
      .select([
        'rproduct.name AS name',
        'rproduct.id AS id',
        'rproduct.price AS price',
        'rproduct.detail AS detail',
        'rproduct.product_image_id AS product_image_id',
        'rproduct.matter AS matter',
        '"리본(Reborn)" AS market_name',
        'product_image.url',
      ])
      .where('rproduct.id = :id AND rproduct.deleted_at IS NULL', { id })
      .getRawOne();
  }

  // 리메이크 제품 수정
  async updateRemakeProductById(
    id: number,
    updateData: Partial<RemakeProduct>,
  ): Promise<object> {
    const product = await this.findRemakeProductById(id);

    Object.assign(product, updateData);
    await this.remakeProductRepository.save(product);

    return { message: '리메이크 제품이 성공적으로 변경되었습니다.' };
  }

  // 리메이크 제품 삭제
  async deleteRemakeProductById(id: number): Promise<object> {
    const product = await this.findRemakeProductById(id);

    product.deleted_at = new Date();
    await this.remakeProductRepository.save(product);

    return { message: '리메이크 제품이 성공적으로 삭제되었습니다.' };
  }
}
