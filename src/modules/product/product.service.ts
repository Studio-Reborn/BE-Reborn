/**
File Name : product.service
Description : 상품 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    상품 등록 기능 추가
2024.11.08  이유민      Modified    상품 RUD 추가
2024.11.21  이유민      Modified    사용자별 판매 제품 조회 추가
2024.11.26  이유민      Modified    상품 테이블 분리
2024.12.17  이유민      Modified    product_id 타입 수정
2024.12.30  이유민      Modified    중고거래 판매 완료 추가
2024.12.30  이유민      Modified    중고거래 구매내역 조회 추가
*/
import { Injectable } from '@nestjs/common';
import { UserProduct } from 'src/modules/product/entity/user_product.entity';
import { MarketProduct } from 'src/modules/product/entity/market_product.entity';
import { UserProductRepository } from 'src/modules/product/repository/user_product.repository';
import { MarketProductRepository } from 'src/modules/product/repository/market_product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly userProductRepository: UserProductRepository,
    private readonly marketProductRepository: MarketProductRepository,
  ) {}

  // 중고거래 관련
  // 중고거래 제품 생성
  async createUserProduct(
    productData: Partial<UserProduct>,
  ): Promise<UserProduct> {
    return this.userProductRepository.createProduct(productData);
  }

  // 중고거래 제품 전체 조회
  async findUserProductAll(sort: string): Promise<UserProduct[]> {
    return this.userProductRepository.findProductAll(sort);
  }

  // id로 중고거래 제품 개별 조회
  async findUserProductOneById(id: string): Promise<UserProduct> {
    return this.userProductRepository.findProductById(id);
  }

  // user_id로 중고거래 제품 조회
  async findUserProductByUserId(user_id: number): Promise<UserProduct[]> {
    return this.userProductRepository.findProductByUserId(user_id);
  }

  // 중고물품 구매 내역 조회
  async findProductByBuyerUserId(user_id: number): Promise<UserProduct[]> {
    return this.userProductRepository.findProductByBuyerUserId(user_id);
  }

  // 중고거래 거래 완료
  async soldOutUserProduct(
    user_id: number,
    id: string,
    buyer_user_id: number,
  ): Promise<object> {
    return this.userProductRepository.soldOutUserProduct(
      user_id,
      id,
      buyer_user_id,
    );
  }

  // id로 중고거래 제품 수정
  async updateUserProductById(
    id: string,
    updateData: Partial<UserProduct>,
  ): Promise<object> {
    return this.userProductRepository.updateProductById(id, updateData);
  }

  // id로 중고거래 제품 삭제
  async deleteUserProductById(id: string): Promise<object> {
    return this.userProductRepository.deleteProductById(id);
  }

  // 에코마켓 관련
  // 에코마켓 제품 생성
  async createMarketProduct(
    productData: Partial<MarketProduct>,
  ): Promise<MarketProduct> {
    return this.marketProductRepository.createProduct(productData);
  }

  // market_id로 에코마켓 제품 조회
  async findMarketProductByMarektId(
    market_id: number,
  ): Promise<MarketProduct[]> {
    return this.marketProductRepository.findProductByMarketId(market_id);
  }

  // id로 에코마켓 제품 개별 조회
  async findMarketProductOneById(id: string): Promise<MarketProduct> {
    return this.marketProductRepository.findProductById(id);
  }

  // id로 에코마켓 제품 수정
  async updateMarketProductById(
    id: string,
    updateData: Partial<MarketProduct>,
  ): Promise<object> {
    return this.marketProductRepository.updateProductById(id, updateData);
  }

  // id로 에코마켓 제품 삭제
  async deleteMarketProductById(id: string): Promise<object> {
    return this.marketProductRepository.deleteProductById(id);
  }
}
