/**
File Name : product_image.controller
Description : 상품 이미지 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.20  이유민      Created     
2024.11.20  이유민      Modified    상품 이미지 추가
*/
import { Controller, Get, ParseIntPipe, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductImageService } from 'src/modules/product_image/product_image.service';

@Controller('product-image')
@ApiTags('상품 이미지 API')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  // 상품 이미지 조회
  @Get(':id')
  @ApiOperation({
    summary: '상품 이미지 조회 API',
    description: '상품 이미지를 조회한다.',
  })
  async findProductImageById(@Param('id', ParseIntPipe) id: number) {
    return await this.productImageService.findProductImageById(id);
  }
}
