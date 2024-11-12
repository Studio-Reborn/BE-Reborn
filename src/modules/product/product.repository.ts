/**
File Name : product.repository
Description : 상품 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    상품 등록 기능 추가
2024.11.08  이유민      Modified    상품 RUD 추가
*/
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/modules/product/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(ProductData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(ProductData);
    return await this.productRepository.save(product);
  }

  async findProductAll(theme: string, sort: string): Promise<Product[]> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.theme = :theme AND product.deleted_at IS NULL', { theme })
      .orderBy(`product.${sort}`)
      .getMany();

    return product;
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id AND product.deleted_at IS NULL', { id })
      .getOne();

    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다.');

    return product;
  }

  async updateProductById(
    id: number,
    updateData: Partial<Product>,
  ): Promise<object> {
    const product = await this.findProductById(id);

    Object.assign(product, updateData);
    await this.productRepository.save(product);

    return { message: '성공적으로 변경되었습니다.' };
  }

  async deleteProductById(id: number): Promise<object> {
    const product = await this.findProductById(id);

    product.deleted_at = new Date();
    await this.productRepository.save(product);

    return { message: '성공적으로 삭제되었습니다.' };
  }
}
