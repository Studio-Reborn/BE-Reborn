/**
File Name : like.service
Description : 좋아요 Service
Author : 이유민

History
Date        Author      Status      Description
2024.12.16  이유민      Created     
2024.12.16  이유민      Modified    상품 좋아요 추가
2024.12.17  이유민      Modified    product_id 타입 수정
2024.12.17  이유민      Modified    마켓 좋아요 추가
*/
import { Injectable } from '@nestjs/common';
import { ProductLike } from 'src/modules/like/entity/product_like.entity';
import { MarketLike } from 'src/modules/like/entity/market_like.entity';
import { ProductLikeRepository } from 'src/modules/like/repository/product_like.repository';
import { MarketLikeRepository } from 'src/modules/like/repository/market_like.repository';

@Injectable()
export class LikeService {
  constructor(
    private readonly productLikeRepository: ProductLikeRepository,
    private readonly marketLikeRepository: MarketLikeRepository,
  ) {}

  // 상품 좋아요 생성
  async createProductLike(likeData: Partial<ProductLike>): Promise<object> {
    return this.productLikeRepository.createProductLike(likeData);
  }

  // 상품의 총 좋아요 조회
  async findProductLikeByProductId(product_id: string): Promise<ProductLike[]> {
    return this.productLikeRepository.findProductLikeByProductId(product_id);
  }

  // 사용자가 해당 상품 좋아요 눌렀는지 조회
  async findProductLikeByProductIdAndUserId(
    user_id: number,
    product_id: string,
  ): Promise<ProductLike> {
    return this.productLikeRepository.findProductLikeByProductIdAndUserId(
      user_id,
      product_id,
    );
  }

  // 마켓 좋아요 생성
  async createMarketLike(likeData: Partial<MarketLike>): Promise<object> {
    return this.marketLikeRepository.createMarketLike(likeData);
  }

  // 상품의 총 좋아요 조회
  async findMarketLikeByMarketId(market_id: number): Promise<MarketLike[]> {
    return this.marketLikeRepository.findMarketLikeByMarketId(market_id);
  }

  // 사용자가 해당 마켓 좋아요 눌렀는지 조회
  async findMarketLikeByMarketIdAndUserId(
    user_id: number,
    market_id: number,
  ): Promise<MarketLike> {
    return this.marketLikeRepository.findMarketLikeByMarketIdAndUserId(
      user_id,
      market_id,
    );
  }
}
