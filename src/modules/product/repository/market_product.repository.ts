/**
File Name : market_product.repository
Description : 에코마켓 상품 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.26  이유민      Created     
2024.11.26  이유민      Modified    상품 테이블 분리
2024.11.28  이유민      Modified    마켓 제품 개별 조회 수정
2024.12.04  이유민      Modified    코드 리팩토링
2024.12.17  이유민      Modified    product_id 타입 수정
*/
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MarketProduct } from 'src/modules/product/entity/market_product.entity';

@Injectable()
export class MarketProductRepository {
  constructor(
    @InjectRepository(MarketProduct)
    private readonly marketProductRepository: Repository<MarketProduct>,
  ) {}

  // 마켓 제품 생성
  async createProduct(
    ProductData: Partial<MarketProduct>,
  ): Promise<MarketProduct> {
    const product = this.marketProductRepository.create(ProductData);
    return await this.marketProductRepository.save(product);
  }

  // market_id로 마켓 제품 전체 조회
  async findProductByMarketId(market_id: number): Promise<MarketProduct[]> {
    return await this.marketProductRepository
      .createQueryBuilder('product')
      .where('product.market_id = :market_id AND product.deleted_at IS NULL', {
        market_id,
      })
      .getMany();
  }

  // id로 마켓 제품 개별 조회
  async findProductById(id: string): Promise<MarketProduct> {
    const product = await this.marketProductRepository
      .createQueryBuilder('product')
      .leftJoin('market', 'market', 'product.market_id = market.id')
      .leftJoin(
        'product_image',
        'product_image',
        'product.product_image_id = product_image.id',
      )
      .leftJoin(
        'profile_image',
        'profile',
        'market.profile_image_id = profile.id',
      )
      .select([
        'product.name AS name',
        'product.id AS id',
        'product.price AS price',
        'product.detail AS detail',
        'product.quantity AS quantity',
        'product.status AS status',
        'product.product_image_id AS product_image_id',
        'product_image.url AS product_image_url',
        'market.market_name AS market_name',
        'market.id AS market_id',
        'market.user_id AS market_user_id',
        'profile.url AS market_profile_url',
      ])
      .where('product.id = :id AND product.deleted_at IS NULL', { id })
      .getRawOne();

    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다.');

    return product;
  }

  // id로 마켓 제품 수정
  async updateProductById(
    id: string,
    updateData: Partial<MarketProduct>,
  ): Promise<object> {
    const product = await this.findProductById(id);

    Object.assign(product, updateData);
    await this.marketProductRepository.save(product);

    return { message: '성공적으로 변경되었습니다.' };
  }

  // id로 마켓 제품 삭제
  async deleteProductById(id: string): Promise<object> {
    const product = await this.findProductById(id);

    product.deleted_at = new Date();
    await this.marketProductRepository.save(product);

    return { message: '성공적으로 삭제되었습니다.' };
  }
}
