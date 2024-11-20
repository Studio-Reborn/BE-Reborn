/**
File Name : product.controller
Description : 상품 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    상품 등록 기능 추가
2024.11.08  이유민      Modified    상품 RUD 추가
2024.11.08  이유민      Modified    리본 리메이크 제품 분리
2024.11.12  이유민      Modified    UseGuards 추가
2024.11.13  이유민      Modified    jwt 관련 파일 경로 수정
2024.11.18  이유민      Modified    swagger 추가
2024.11.20  이유민      Modified    상품 이미지 추가
*/
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  BadRequestException,
  UnauthorizedException,
  Param,
  Query,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductDTO } from 'src/modules/product/product.dto';
import { ProductService } from 'src/modules/product/product.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@Controller('product')
@ApiTags('중고거래 및 에코마켓 제품 API')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 제품 생성
  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '제품 생성 API',
    description: '중고거래 또는 에코마켓의 제품을 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async createProduct(@Req() req, @Body() productDTO: ProductDTO) {
    const { theme, name, detail, price, product_image_id } = productDTO;

    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!theme || !name || !detail || !price)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    if (!['user', 'market'].includes(theme))
      throw new BadRequestException('theme에 잘못된 값이 입력되었습니다.');

    await this.productService.createProduct({
      user_id: req.user.user_id,
      product_image_id,
      theme,
      name,
      detail,
      price,
    });

    return { message: '제품 등록에 성공했습니다.' };
  }

  // 제품 전체 조회
  @Get()
  @ApiOperation({
    summary: '제품 전체 조회 API',
    description: '중고거래 또는 에코마켓의 제품을 전체 조회한다.',
  })
  async findProductAll(
    @Query('theme') theme: string,
    @Query('sort') sort?: string,
  ) {
    if (!sort) sort = 'id'; // 기본 정렬은 최신순

    return await this.productService.findProductAll(theme, sort);
  }

  // 제품 상세 조회
  @Get(':id')
  @ApiOperation({
    summary: '제품 개별 조회 API',
    description: '중고거래 또는 에코마켓의 제품을 개별 조회한다.',
  })
  async findProductOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findProductOneById(id);
  }

  // 제품 수정
  @Patch(':id')
  @ApiOperation({
    summary: '제품 수정 API',
    description: '중고거래 또는 에코마켓의 제품을 수정한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productDTO: ProductDTO,
  ) {
    return await this.productService.updateProductById(id, productDTO);
  }

  // 제품 삭제
  @Delete(':id')
  @ApiOperation({
    summary: '제품 삭제 API',
    description: '중고거래 또는 에코마켓의 제품을 삭제한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.deleteProductById(id);
  }
}
