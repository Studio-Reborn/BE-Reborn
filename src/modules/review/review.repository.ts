/**
File Name : review.repository
Description : 리뷰 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.12.19  이유민      Created     
2024.12.19  이유민      Modified    리뷰 추가
2024.12.28  이유민      Modified    오류 수정
2025.01.07  이유민      Modified    에코마켓별 리뷰 조회 추가
2025.01.10  이유민      Modified    코드 리팩토링
*/
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/modules/review/review.entity';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  // 리뷰 생성
  async createReview(reviewData: Partial<Review>): Promise<Review> {
    const review = this.reviewRepository.create(reviewData);
    return await this.reviewRepository.save(review);
  }

  // 제품별 리뷰 조회
  async findReviewByProductId(product_id: string): Promise<Review[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoin('users', 'users', 'review.user_id = users.id')
      .leftJoin(
        'profile_image',
        'profile',
        'users.profile_image_id = profile.id',
      )
      .where('review.product_id = :product_id AND review.deleted_at IS NULL', {
        product_id,
      })
      .select([
        'review.created_at AS review_created_at',
        'review.updated_at AS review_updated_at',
        'review.content AS review_content',
        'review.id AS review_id',
        'review.user_id AS user_id',
        'users.nickname AS user_nickname',
        'profile.url AS user_profile_url',
      ])
      .orderBy('review.created_at', 'DESC')
      .getRawMany();
  }

  // 마켓별 리뷰 조회
  async findReviewByMarketId(market_id: number): Promise<Review[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoin('market_product', 'product', 'review.product_id = product.id')
      .leftJoin('market', 'market', 'product.market_id = market.id')
      .leftJoin('users', 'users', 'review.user_id = users.id')
      .leftJoin(
        'profile_image',
        'profile',
        'users.profile_image_id = profile.id',
      )
      .leftJoin(
        'product_image',
        'product_image',
        'product.product_image_id = product_image.id',
      )
      .select([
        'product.id AS product_id',
        'product.name AS product_name',
        'product_image.url AS product_image_url',
        'users.id AS user_id',
        'users.nickname AS user_nickname',
        'profile.url AS user_profile_image_url',
        'review.id AS review_id',
        'review.content AS review_content',
        'review.created_at AS review_created_at',
        'review.updated_at AS review_updated_at',
      ])
      .where('review.deleted_at IS NULL')
      .andWhere('market.id = :market_id', { market_id })
      .orderBy('review.created_at', 'DESC')
      .getRawMany();
  }

  // 리뷰 상세 조회
  async findReviewById(id: number): Promise<Review> {
    const review = await this.reviewRepository
      .createQueryBuilder('review')
      .where('review.id = :id AND review.deleted_at IS NULL', { id })
      .getOne();

    if (!review) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    return review;
  }

  // 사용자별 작성 리뷰 조회
  async findReviewByUserId(user_id: number): Promise<Review[]> {
    const marketReview = await this.reviewRepository
      .createQueryBuilder('review')
      .innerJoin(
        // 에코마켓 리뷰
        'market_product',
        'market_product',
        'review.product_id = market_product.id',
      )
      .leftJoin(
        'product_image',
        'product_image',
        'market_product.product_image_id = product_image.id',
      )
      .leftJoin('market', 'market', 'market_product.market_id = market.id')
      .addSelect([
        'market_product.name AS product_name',
        'market_product.price AS product_price',
        'market.id AS market_id',
        'market.market_name AS market_name',
        'product_image.url AS product_image_url',
      ])
      .where('review.user_id = :user_id AND review.deleted_at IS NULL', {
        user_id,
      })
      .orderBy('review.created_at', 'DESC')
      .getRawMany();

    const remakeReview = await this.reviewRepository
      .createQueryBuilder('review')
      .innerJoin(
        // 에코마켓 리뷰
        'remake_product',
        'remake_product',
        'review.product_id = remake_product.id',
      )
      .leftJoin(
        'product_image',
        'product_image',
        'remake_product.product_image_id = product_image.id',
      )
      .addSelect([
        'remake_product.name AS product_name',
        'remake_product.price AS product_price',
        '"Reborn" AS market_name',
        'product_image.url AS product_image_url',
      ])
      .where('review.user_id = :user_id AND review.deleted_at IS NULL', {
        user_id,
      })
      .orderBy('review.created_at', 'DESC')
      .getRawMany();

    const combinedReviews = [...marketReview, ...remakeReview];

    combinedReviews.sort(
      (a, b) =>
        new Date(b.review_created_at).getTime() -
        new Date(a.review_created_at).getTime(),
    );

    return combinedReviews;
  }

  // 리뷰 수정
  async updateReviewById(
    id: number,
    user_id: number,
    content: string,
  ): Promise<object> {
    const review = await this.findReviewById(id);

    if (review.user_id !== user_id)
      throw new UnauthorizedException('접근할 수 없습니다.');

    Object.assign(review, content);
    await this.reviewRepository.save(review);

    return { message: '리뷰가 성공적으로 변경되었습니다.' };
  }

  // 리뷰 삭제
  async deleteReviewById(id: number, user_id: number): Promise<object> {
    const review = await this.findReviewById(id);

    if (review.user_id !== user_id)
      throw new UnauthorizedException('접근할 수 없습니다.');

    review.deleted_at = new Date();
    await this.reviewRepository.save(review);

    return { message: '리뷰가 성공적으로 삭제되었습니다.' };
  }
}
