/**
File Name : like.module
Description : 좋아요 Module
Author : 이유민

History
Date        Author      Status      Description
2024.12.16  이유민      Created     
2024.12.16  이유민      Modified    상품 좋아요 추가
2024.12.17  이유민      Modified    마켓 좋아요 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductLike } from 'src/modules/like/entity/product_like.entity';
import { ProductLikeRepository } from 'src/modules/like/repository/product_like.repository';
import { MarketLike } from 'src/modules/like/entity/market_like.entity';
import { MarketLikeRepository } from 'src/modules/like/repository/market_like.repository';
import { LikeService } from 'src/modules/like/like.service';
import { LikeController } from 'src/modules/like/like.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductLike, MarketLike])],
  providers: [ProductLikeRepository, MarketLikeRepository, LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
