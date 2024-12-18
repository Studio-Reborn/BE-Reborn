/**
File Name : market_like.repository
Description : 마켓 좋아요 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.12.17  이유민      Created     
2024.12.17  이유민      Modified    마켓 좋아요 추가
2024.12.18  이유민      Modified    마이페이지 관련 기능 추가
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MarketLike } from 'src/modules/like/entity/market_like.entity';

@Injectable()
export class MarketLikeRepository {
  constructor(
    @InjectRepository(MarketLike)
    private readonly marketLikeRepository: Repository<MarketLike>,
  ) {}

  // 상품 좋아요 생성
  async createMarketLike(likeData: Partial<MarketLike>): Promise<object> {
    const { user_id, market_id } = likeData;
    const likes = await this.findMarketLikeByMarketIdAndUserId(
      user_id,
      market_id,
    );

    if (!likes) {
      const like = this.marketLikeRepository.create(likeData);
      await this.marketLikeRepository.save(like);

      return { message: '좋아요가 성공적으로 등록되었습니다.' };
    }
    if (likes.deleted_at === null) {
      likes.deleted_at = new Date();
      await this.marketLikeRepository.save(likes);

      return { message: '좋아요가 성공적으로 취소되었습니다.' };
    }
  }

  // 상품의 총 좋아요 조회
  async findMarketLikeByMarketId(market_id: number): Promise<MarketLike[]> {
    return await this.marketLikeRepository
      .createQueryBuilder('like')
      .where('like.market_id = :market_id AND like.deleted_at IS NULL', {
        market_id,
      })
      .getMany();
  }

  // 사용자가 해당 마켓 좋아요 눌렀는지 조회
  async findMarketLikeByMarketIdAndUserId(
    user_id: number,
    market_id: number,
  ): Promise<MarketLike> {
    return await this.marketLikeRepository
      .createQueryBuilder('like')
      .where('like.user_id = :user_id AND like.market_id = :market_id', {
        user_id,
        market_id,
      })
      .getOne();
  }

  // 사용자별 좋아요 누른 마켓
  async findMarketLikeByUserId(user_id: number): Promise<MarketLike[]> {
    return await this.marketLikeRepository
      .createQueryBuilder('like')
      .leftJoin('market', 'market', 'like.market_id = market.id')
      .leftJoin(
        'profile_image',
        'profile',
        'market.profile_image_id = profile.id',
      )
      .select([
        'market.id AS market_id',
        'market.market_name AS market_name',
        'profile.url AS market_profile_url',
      ])
      .where(
        'like.user_id = :user_id AND like.deleted_at IS NULL AND like.market_id = market.id',
        { user_id },
      )
      .orderBy('like.created_at', 'DESC')
      .getRawMany();
  }
}
