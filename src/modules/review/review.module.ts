/**
File Name : review.module
Description : 리뷰 Module
Author : 이유민

History
Date        Author      Status      Description
2024.12.19  이유민      Created     
2024.12.19  이유민      Modified    리뷰 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/modules/review/review.entity';
import { ReviewService } from 'src/modules/review/review.service';
import { ReviewRepository } from 'src/modules/review/review.repository';
import { ReviewController } from 'src/modules/review/review.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReviewService, ReviewRepository],
  controllers: [ReviewController],
})
export class ReviewModule {}
