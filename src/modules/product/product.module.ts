/**
File Name : product.module
Description : 상품 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    상품 등록 기능 추가
2024.11.26  이유민      Modified    상품 테이블 분리
2024.12.30  이유민      Modified    홈 화면 정보 조회 추가
2025.01.19  이유민      Modified    모듈 코드 리팩토링
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketProduct } from 'src/modules/product/entity/market_product.entity';
import { UserProduct } from 'src/modules/product/entity/user_product.entity';
import { MarketProductRepository } from 'src/modules/product/repository/market_product.repository';
import { UserProductRepository } from 'src/modules/product/repository/user_product.repository';
import { ProductService } from 'src/modules/product/product.service';
import { ProductController } from 'src/modules/product/product.controller';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketProduct, UserProduct]),
    BillingModule,
  ],
  providers: [ProductService, MarketProductRepository, UserProductRepository],
  controllers: [ProductController],
  exports: [UserProductRepository],
})
export class ProductModule {}
