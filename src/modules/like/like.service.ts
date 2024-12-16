/**
File Name : like.service
Description : 좋아요 Service
Author : 이유민

History
Date        Author      Status      Description
2024.12.16  이유민      Created     
2024.12.16  이유민      Modified    상품 좋아요 추가
*/
import { Injectable } from '@nestjs/common';
import { ProductLike } from 'src/modules/like/entity/product_like.entity';
import { ProductLikeRepository } from 'src/modules/like/repository/product_like.repository';

@Injectable()
export class LikeService {
  constructor(private readonly productLikeRepository: ProductLikeRepository) {}

  // 상품 좋아요 생성
  async createProductLike(likeData: Partial<ProductLike>): Promise<object> {
    return this.productLikeRepository.createProductLike(likeData);
  }

  // 상품의 총 좋아요 조회
  async findProductLikeByProductId(product_id: number): Promise<ProductLike[]> {
    return this.productLikeRepository.findProductLikeByProductId(product_id);
  }

  // 사용자가 해당 상품 좋아요 눌렀는지 조회
  async findProductLikeByProductIdAndUserId(
    user_id: number,
    product_id: number,
  ): Promise<ProductLike> {
    return this.productLikeRepository.findProductLikeByProductIdAndUserId(
      user_id,
      product_id,
    );
  }
}
