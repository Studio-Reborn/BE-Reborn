/**
File Name : product.service
Description : 상품 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    상품 등록 기능 추가
2024.11.08  이유민      Modified    상품 RUD 추가
2024.11.21  이유민      Modified    사용자별 판매 제품 조회 추가
*/
import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/modules/product/product.repository';
import { Product } from 'src/modules/product/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(productData: Partial<Product>): Promise<Product> {
    return this.productRepository.createProduct(productData);
  }

  async findProductAll(theme: string, sort: string): Promise<Product[]> {
    return this.productRepository.findProductAll(theme, sort);
  }

  async findProductOneById(id: number): Promise<Product> {
    return this.productRepository.findProductById(id);
  }

  async findProductByUserId(
    user_id: number,
    theme: string,
  ): Promise<Product[]> {
    return this.productRepository.findProductByUserId(user_id, theme);
  }

  async updateProductById(
    id: number,
    updateData: Partial<Product>,
  ): Promise<object> {
    return this.productRepository.updateProductById(id, updateData);
  }

  async deleteProductById(id: number): Promise<object> {
    return this.productRepository.deleteProductById(id);
  }
}
