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
2024.12.18  이유민      Modified    id 타입 수정
2025.01.22  이유민      Modified    페이지네이션 추가
2025.01.25  이유민      Modified    이미지 url 관련 오류 수정
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
  async findRemakeProductAll(page?: number): Promise<{
    products: RemakeProduct[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    // 페이지네이션 관련
    const limit = 9;
    const skip = (page - 1) * limit;

    const products = await this.remakeProductRepository.query(`
      SELECT rproduct.created_at AS created_at,
            rproduct.id AS id,
            rproduct.matter AS matter,
            rproduct.name AS name,
            rproduct.price AS price,
            rproduct.product_image_id AS product_image_id,
            image.url AS product_image_url
      FROM remake_product rproduct
      LEFT JOIN product_image image ON rproduct.product_image_id = image.id
      WHERE rproduct.deleted_at IS NULL
      ORDER BY rproduct.created_at ASC
      LIMIT ${limit} OFFSET ${skip};
    `);

    products.forEach((product) => {
      if (product.product_image_url) {
        product.product_image_url = JSON.parse(product.product_image_url);
      }
    });

    const total = await this.remakeProductRepository
      .createQueryBuilder('rproduct')
      .where('rproduct.deleted_at IS NULL')
      .getCount();

    return {
      products, // 현재 페이지의 데이터
      total, // 전체 데이터 개수
      currentPage: page, // 현재 페이지 번호
      totalPages: Math.ceil(total / limit), // 전체 페이지 수
    };
  }

  // 리메이크 제품 개별 조회
  async findRemakeProductById(id: string): Promise<RemakeProduct> {
    const product = await this.remakeProductRepository
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
        'product_image.url AS product_image_url',
      ])
      .where('rproduct.id = :id AND rproduct.deleted_at IS NULL', { id })
      .getRawOne();

    product.product_image_url = JSON.parse(product.product_image_url);

    return product;
  }

  // 리메이크 제품 수정
  async updateRemakeProductById(
    id: string,
    updateData: Partial<RemakeProduct>,
  ): Promise<object> {
    const product = await this.findRemakeProductById(id);

    Object.assign(product, updateData);
    await this.remakeProductRepository.save(product);

    return { message: '리메이크 제품이 성공적으로 변경되었습니다.' };
  }

  // 리메이크 제품 삭제
  async deleteRemakeProductById(id: string): Promise<object> {
    const product = await this.findRemakeProductById(id);

    product.deleted_at = new Date();
    await this.remakeProductRepository.save(product);

    return { message: '리메이크 제품이 성공적으로 삭제되었습니다.' };
  }
}
