/**
File Name : product.module
Description : 상품 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    상품 등록 기능 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/modules/product/product.entity';
import { ProductRepository } from 'src/modules/product/product.repository';
import { ProductService } from 'src/modules/product/product.service';
import { ProductController } from 'src/modules/product/product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
