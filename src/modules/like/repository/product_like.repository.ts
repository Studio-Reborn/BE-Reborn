/**
File Name : product_like.repository
Description : 상품 좋아요 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.12.16  이유민      Created     
2024.12.16  이유민      Modified    상품 좋아요 추가
2024.12.17  이유민      Modified    product_id 타입 수정
2024.12.18  이유민      Modified    마이페이지 관련 기능 추가
2025.01.31  이유민      Modified    이미지 url 관련 오류 수정
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
  async findProductLikeByProductId(product_id: string): Promise<ProductLike[]> {
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
    product_id: string,
  ): Promise<ProductLike> {
    return await this.productLikeRepository
      .createQueryBuilder('like')
      .where('like.user_id = :user_id AND like.product_id = :product_id', {
        user_id,
        product_id,
      })
      .getOne();
  }

  // 사용자별 좋아요 누른 상품
  async findProductLikeByUserId(user_id: number): Promise<object> {
    const preLoved = await this.productLikeRepository
      .createQueryBuilder('like')
      .leftJoin(
        'user_product',
        'user_product',
        'like.product_id = user_product.id',
      )
      .leftJoin(
        'product_image',
        'product_image',
        'user_product.product_image_id = product_image.id',
      )
      .leftJoin('users', 'users', 'user_product.user_id = users.id')
      .leftJoin(
        'profile_image',
        'profile',
        'users.profile_image_id = profile.id',
      )
      .select([
        'user_product.id AS product_id',
        'user_product.name AS product_name',
        'user_product.price AS product_price',
        'user_product.detail AS product_detail',
        'user_product.status AS product_status',
        'product_image.url AS product_image_url',
        'users.nickname AS user_nickname',
        'profile.url AS user_profile_url',
        'like.created_at AS like_created_at',
        '"pre-loved" AS product_type',
      ])
      .where(
        'like.user_id = :user_id AND like.deleted_at IS NULL AND like.product_id = user_product.id',
        { user_id },
      )
      .orderBy('like.created_at', 'DESC')
      .getRawMany();

    const ecoMarket = await this.productLikeRepository
      .createQueryBuilder('like')
      .leftJoin(
        'market_product',
        'market_product',
        'like.product_id = market_product.id',
      )
      .leftJoin(
        'product_image',
        'product_image',
        'market_product.product_image_id = product_image.id',
      )
      .leftJoin('market', 'market', 'market_product.market_id = market.id')
      .leftJoin(
        'profile_image',
        'profile',
        'market.profile_image_id = profile.id',
      )
      .select([
        'market_product.id AS product_id',
        'market_product.name AS product_name',
        'market_product.price AS product_price',
        'market_product.detail AS product_detail',
        'market_product.status AS product_status',
        'product_image.url AS product_image_url',
        'market.market_name AS market_name',
        'market.id AS market_id',
        'profile.url AS market_profile_url',
        'like.created_at AS like_created_at',
        '"eco-market" AS product_type',
      ])
      .where(
        'like.user_id = :user_id AND like.deleted_at IS NULL AND like.product_id = market_product.id',
        { user_id },
      )
      .orderBy('like.created_at', 'DESC')
      .getRawMany();

    const rebornRemake = await this.productLikeRepository
      .createQueryBuilder('like')
      .innerJoin('remake_product', 'remake', 'like.product_id = remake.id')
      .leftJoin(
        'product_image',
        'product_image',
        'remake.product_image_id = product_image.id',
      )
      .select([
        'remake.id AS product_id',
        'remake.name AS product_name',
        'remake.price AS product_price',
        'remake.detail AS product_detail',
        'product_image.url AS product_image_url',
        '"Reborn" AS market_name',
        'like.created_at AS like_created_at',
        '"reborn-remake" AS product_type',
      ])
      .where('like.user_id = :user_id AND like.deleted_at IS NULL', { user_id })
      .orderBy('like.created_at', 'DESC')
      .getRawMany();

    preLoved.forEach((preLoved) => {
      if (preLoved.product_image_url) {
        preLoved.product_image_url = JSON.parse(preLoved.product_image_url);
      }
    });

    ecoMarket.forEach((ecoMarket) => {
      if (ecoMarket.product_image_url) {
        ecoMarket.product_image_url = JSON.parse(ecoMarket.product_image_url);
      }
    });

    rebornRemake.forEach((rebornRemake) => {
      if (rebornRemake.product_image_url) {
        rebornRemake.product_image_url = JSON.parse(
          rebornRemake.product_image_url,
        );
      }
    });

    return {
      preLoved: preLoved,
      ecoMarket: ecoMarket,
      rebornRemake: rebornRemake,
    };
  }
}
