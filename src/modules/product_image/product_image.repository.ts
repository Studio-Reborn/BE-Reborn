/**
File Name : product_image.repository
Description : 상품 이미지 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.20  이유민      Created     
2024.11.20  이유민      Modified    상품 이미지 추가
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/modules/product_image/product_image.entity';

@Injectable()
export class ProductImageRepository {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  // 상품 이미지 생성
  async createProductImage(
    productImageData: Partial<ProductImage>,
  ): Promise<ProductImage> {
    const productImage = this.productImageRepository.create(productImageData);
    return await this.productImageRepository.save(productImage);
  }

  async findProductImageById(id: number): Promise<ProductImage> {
    return this.productImageRepository
      .createQueryBuilder('pi')
      .where('pi.id = :id AND pi.deleted_at IS NULL', { id })
      .getOne();
  }
}
