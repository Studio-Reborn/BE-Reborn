/**
File Name : user_product.repository
Description : 중고거래 상품 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.26  이유민      Created     
2024.11.26  이유민      Modified    상품 테이블 분리
2024.12.04  이유민      Modified    코드 리팩토링
2024.12.17  이유민      Modified    product_id 타입 수정
*/
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProduct } from 'src/modules/product/entity/user_product.entity';

@Injectable()
export class UserProductRepository {
  constructor(
    @InjectRepository(UserProduct)
    private readonly userProductRepository: Repository<UserProduct>,
  ) {}

  // 중고거래 제품 생성
  async createProduct(ProductData: Partial<UserProduct>): Promise<UserProduct> {
    const product = this.userProductRepository.create(ProductData);
    return await this.userProductRepository.save(product);
  }

  // 중고거래 제품 전체 조회
  async findProductAll(sort: string): Promise<UserProduct[]> {
    const product = await this.userProductRepository
      .createQueryBuilder('product')
      .where('product.deleted_at IS NULL')
      .orderBy(`product.${sort}`)
      .getMany();

    return product;
  }

  // id로 중고거래 제품 개별 조회
  async findProductById(id: string): Promise<UserProduct> {
    const product = await this.userProductRepository
      .createQueryBuilder('product')
      .where('product.id = :id AND product.deleted_at IS NULL', { id })
      .getOne();

    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다.');

    return product;
  }

  // user_id로 중고거래 제품 조회
  async findProductByUserId(user_id: number): Promise<UserProduct[]> {
    return await this.userProductRepository
      .createQueryBuilder('product')
      .leftJoin('product_image', 'image', 'product.product_image_id = image.id')
      .select([
        'product.id AS product_id',
        'product.created_at AS product_created_at',
        'product.name AS product_name',
        'product.detail AS product_detail',
        'product.price AS product_price',
        'product.status AS product_status',
        'image.url AS product_image',
      ])
      .where('product.user_id = :user_id AND product.deleted_at IS NULL', {
        user_id,
      })
      .orderBy('product.created_at', 'DESC')
      .getRawMany();
  }

  // id로 중고거래 제품 수정
  async updateProductById(
    id: string,
    updateData: Partial<UserProduct>,
  ): Promise<object> {
    const product = await this.findProductById(id);

    Object.assign(product, updateData);
    await this.userProductRepository.save(product);

    return { message: '성공적으로 변경되었습니다.' };
  }

  // id로 중고거래 제품 삭제
  async deleteProductById(id: string): Promise<object> {
    const product = await this.findProductById(id);

    product.deleted_at = new Date();
    await this.userProductRepository.save(product);

    return { message: '성공적으로 삭제되었습니다.' };
  }
}
