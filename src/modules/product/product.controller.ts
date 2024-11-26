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
2024.11.21  이유민      Modified    사용자별 판매 제품 조회 추가
2024.11.21  이유민      Modified    제품 상세 조회 경로 변경
2024.11.26  이유민      Modified    상품 테이블 분리
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
import {
  UserProductDTO,
  MarketProductDTO,
} from 'src/modules/product/product.dto';
import { ProductService } from 'src/modules/product/product.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@Controller('product')
@ApiTags('중고거래 및 에코마켓 제품 API')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 중고거래 관련
  // 중고거래 제품 생성
  @Post('/pre-loved')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '중고거래 제품 생성 API',
    description: '중고거래 제품을 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async createUserProduct(@Req() req, @Body() userProductDTO: UserProductDTO) {
    const { name, detail, price, product_image_id } = userProductDTO;

    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!product_image_id || !name || !detail || !price)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    await this.productService.createUserProduct({
      user_id: req.user.user_id,
      product_image_id,
      name,
      detail,
      price,
    });

    return { message: '제품 등록에 성공했습니다.' };
  }

  // 중고거래 제품 전체 조회
  @Get('/pre-loved')
  @ApiOperation({
    summary: '중고거래 제품 전체 조회 API',
    description: '중고거래 제품을 전체 조회한다.',
  })
  async findUserProductAll(@Query('sort') sort?: string) {
    if (!sort) sort = 'id'; // 기본 정렬은 최신순

    return await this.productService.findUserProductAll(sort);
  }

  // user_id로 중고거래 판매 제품 조회
  @Get('/pre-loved/user/:user_id')
  @ApiOperation({
    summary: '사용자별 중고거래 판매 제품 조회 API',
    description: '사용자별 중고거래 판매 제품을 조회한다.',
  })
  async findUserProductByUserId(
    @Param('user_id', ParseIntPipe) user_id: number,
  ) {
    return await this.productService.findUserProductByUserId(user_id);
  }

  // 중고거래 제품 상세 조회
  @Get('/pre-loved/info/:id')
  @ApiOperation({
    summary: '중고거래 제품 개별 조회 API',
    description: '중고거래 제품을 개별 조회한다.',
  })
  async findUserProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findUserProductOneById(id);
  }

  // 중고거래 제품 수정
  @Patch('/pre-loved/:id')
  @ApiOperation({
    summary: '중고거래 제품 수정 API',
    description: '중고거래 제품을 수정한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async updateUserProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() userProductDTO: UserProductDTO,
  ) {
    return await this.productService.updateUserProductById(id, userProductDTO);
  }

  // 중고거래 제품 삭제
  @Delete('/pre-loved/:id')
  @ApiOperation({
    summary: '중고거래 제품 삭제 API',
    description: '중고거래 제품을 삭제한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async deleteUserProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.deleteUserProductById(id);
  }

  // 에코마켓 관련
  // 에코마켓 제품 생성
  @Post('/eco-market/:market_id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '에코마켓 제품 생성 API',
    description: '에코마켓의 제품을 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async createMarketProduct(
    @Req() req,
    @Param('market_id', ParseIntPipe) market_id: number,
    @Body() marketproductDTO: MarketProductDTO,
  ) {
    const { name, detail, price, product_image_id, quantity } =
      marketproductDTO;

    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!product_image_id || !name || !detail || !price || !quantity)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    await this.productService.createMarketProduct({
      market_id,
      product_image_id,
      quantity,
      name,
      detail,
      price,
    });

    return { message: '제품 등록에 성공했습니다.' };
  }

  // market_id로 에코마켓 판매 제품 조회
  @Get('/eco-market/market/:market_id')
  @ApiOperation({
    summary: '마켓별 판매 제품 조회 API',
    description: '마켓별 에코마켓 판매 제품을 조회한다.',
  })
  async findMarketProductByMarektId(
    @Param('market_id', ParseIntPipe) market_id: number,
  ) {
    return await this.productService.findMarketProductByMarektId(market_id);
  }

  // id로 에코마켓 제품 상세 조회
  @Get('/eco-market/info/:id')
  @ApiOperation({
    summary: '에코마켓 제품 개별 조회 API',
    description: '에코마켓의 제품을 개별 조회한다.',
  })
  async findMarketProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findMarketProductOneById(id);
  }

  // 에코마켓 제품 수정
  @Patch('/eco-market/:id')
  @ApiOperation({
    summary: '에코마켓 제품 수정 API',
    description: '에코마켓의 제품을 수정한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async updateMarketProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() marketproductDTO: MarketProductDTO,
  ) {
    return await this.productService.updateMarketProductById(
      id,
      marketproductDTO,
    );
  }

  // 에코마켓 제품 삭제
  @Delete('/eco-market/:id')
  @ApiOperation({
    summary: '에코마켓 제품 삭제 API',
    description: '에코마켓의 제품을 삭제한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async deleteMarketProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.deleteMarketProductById(id);
  }
}
