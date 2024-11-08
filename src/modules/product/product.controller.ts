/**
File Name : product.controller
Description : 상품 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    상품 등록 기능 추가
2024.11.08  이유민      Modified    상품 RUD 추가
*/
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  BadRequestException,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductDTO } from 'src/modules/product/product.dto';
import { ProductService } from 'src/modules/product/product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  async createProduct(@Body() productDTO: ProductDTO) {
    const { theme, name, detail, price } = productDTO;

    if (!theme || !name || !detail || !price)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    if (!['user', 'market', 'reborn'].includes(theme))
      throw new BadRequestException('theme에 잘못된 값이 입력되었습니다.');

    await this.productService.createProduct({
      user_id: 1,
      product_image_id: 1,
      theme,
      name,
      detail,
      price,
    });

    return { message: '제품 등록에 성공했습니다.' };
  }

  @Get()
  async findProductAll(
    @Query('theme') theme: string,
    @Query('sort') sort?: string,
  ) {
    if (!sort) sort = 'id'; // 기본 정렬은 최신순

    return await this.productService.findProductAll(theme, sort);
  }

  @Get(':id')
  async findProductOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findProductOneById(id);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productDTO: ProductDTO,
  ) {
    return await this.productService.updateProductById(id, productDTO);
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.deleteProductById(id);
  }
}
