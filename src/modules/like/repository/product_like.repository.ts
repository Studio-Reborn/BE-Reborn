/**
File Name : product_like.repository
Description : 상품 좋아요 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.12.16  이유민      Created     
2024.12.16  이유민      Modified    상품 좋아요 추가
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductLike } from 'src/modules/like/entity/product_like.entity';

@Injectable()
export class ProductLikeRepository {
  constructor(
    @InjectRepository(ProductLike)
    private readonly productLikeRepository: Repository<ProductLike>,
  ) {}

  // 상품 좋아요 생성
  async createProductLike(likeData: Partial<ProductLike>): Promise<object> {
    const { user_id, product_id } = likeData;
    const likes = await this.findProductLikeByProductIdAndUserId(
      user_id,
      product_id,
    );

    if (!likes) {
      const like = this.productLikeRepository.create(likeData);
      await this.productLikeRepository.save(like);

      return { message: '좋아요가 성공적으로 등록되었습니다.' };
    }

    if (likes.deleted_at === null) {
      likes.deleted_at = new Date();
      await this.productLikeRepository.save(likes);

      return { message: '좋아요가 성공적으로 취소되었습니다.' };
    }
  }

  // 상품의 총 좋아요 조회
  async findProductLikeByProductId(product_id: number): Promise<ProductLike[]> {
    return await this.productLikeRepository
      .createQueryBuilder('like')
      .where('like.product_id = :product_id AND like.deleted_at IS NULL', {
        product_id,
      })
      .getMany();
  }

  // 사용자가 해당 상품 좋아요 눌렀는지 조회
  async findProductLikeByProductIdAndUserId(
    user_id: number,
    product_id: number,
  ): Promise<ProductLike> {
    return await this.productLikeRepository
      .createQueryBuilder('like')
      .where('like.user_id = :user_id AND like.product_id = :product_id', {
        user_id,
        product_id,
      })
      .getOne();
  }
}
