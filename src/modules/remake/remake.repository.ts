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
*/
import { Injectable } from '@nestjs/common';
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
      .where('rproduct.deleted_at IS NULL')
      .getMany();
  }

  // 리메이크 제품 개별 조회
  async findRemakeProductById(id: number): Promise<RemakeProduct> {
    return await this.remakeProductRepository
      .createQueryBuilder('rproduct')
      .where('rproduct.id = :id AND rproduct.deleted_at IS NULL', { id })
      .getOne();
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
