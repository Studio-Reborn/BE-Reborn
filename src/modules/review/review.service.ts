/**
File Name : review.service
Description : 리뷰 Service
Author : 이유민

History
Date        Author      Status      Description
2024.12.19  이유민      Created     
2024.12.19  이유민      Modified    리뷰 추가
2024.12.28  이유민      Modified    리뷰 상세 조회 추가
2025.01.07  이유민      Modified    에코마켓별 리뷰 조회 추가
*/
import { Injectable } from '@nestjs/common';
import { Review } from 'src/modules/review/review.entity';
import { ReviewRepository } from 'src/modules/review/review.repository';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  // 리뷰 생성
  async createReview(reviewData: Partial<Review>): Promise<Review> {
    return this.reviewRepository.createReview(reviewData);
  }

  // 제품별 리뷰 조회
  async findReviewByProductId(product_id: string): Promise<Review[]> {
    return this.reviewRepository.findReviewByProductId(product_id);
  }

  // 사용자별 작성 리뷰 조회
  async findReviewByUserId(user_id: number): Promise<Review[]> {
    return this.reviewRepository.findReviewByUserId(user_id);
  }

  // 마켓별 리뷰 조회
  async findReviewByMarketId(market_id: number): Promise<Review[]> {
    return this.reviewRepository.findReviewByMarketId(market_id);
  }

  // 리뷰 상세 조회
  async findReviewById(id: number): Promise<Review> {
    return this.reviewRepository.findReviewById(id);
  }

  // 리뷰 수정
  async updateReviewById(
    id: number,
    user_id: number,
    content: string,
  ): Promise<object> {
    return this.reviewRepository.updateReviewById(id, user_id, content);
  }

  // 리뷰 삭제
  async deleteReviewById(id: number, user_id: number): Promise<object> {
    return this.reviewRepository.deleteReviewById(id, user_id);
  }
}
