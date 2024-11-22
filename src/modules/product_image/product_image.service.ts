/**
File Name : product_image.service
Description : 상품 이미지 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.20  이유민      Created     
2024.11.20  이유민      Modified    상품 이미지 추가
*/
import { Injectable } from '@nestjs/common';
import { ProductImage } from 'src/modules/product_image/product_image.entity';
import { ProductImageRepository } from 'src/modules/product_image/product_image.repository';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly productImageRepository: ProductImageRepository,
  ) {}

  async createProductImage(
    productImageData: Partial<ProductImage>,
  ): Promise<ProductImage> {
    return this.productImageRepository.createProductImage(productImageData);
  }

  async findProductImageById(id: number): Promise<ProductImage> {
    return this.productImageRepository.findProductImageById(id);
  }
}
