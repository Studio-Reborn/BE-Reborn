/**
File Name : product_image.module
Description : 상품 이미지 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.20  이유민      Created     
2024.11.20  이유민      Modified    상품 이미지 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from 'src/modules/product_image/product_image.entity';
import { ProductImageRepository } from 'src/modules/product_image/product_image.repository';
import { ProductImageService } from 'src/modules/product_image/product_image.service';
import { ProductImageController } from 'src/modules/product_image/product_image.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage])],
  providers: [ProductImageRepository, ProductImageService],
  controllers: [ProductImageController],
})
export class ProductImageModule {}
