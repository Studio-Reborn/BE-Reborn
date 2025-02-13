/**
File Name : like.controller
Description : 좋아요 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.12.16  이유민      Created     
2024.12.16  이유민      Modified    상품 좋아요 추가
2024.12.17  이유민      Modified    product_id 타입 수정
2024.12.17  이유민      Modified    마켓 좋아요 추가
2024.12.18  이유민      Modified    마이페이지 관련 기능 추가
2025.02.13  이유민      Modified    swagger 설명 수정
*/
import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  UnauthorizedException,
  Param,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { ProductLikeDTO, MarketLikeDTO } from 'src/modules/like/like.dto';
import { LikeService } from 'src/modules/like/like.service';

@Controller('like')
@ApiTags('좋아요 API')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // 상품 좋아요 생성
  @Post('/product')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '상품 좋아요 생성 API',
    description: '상품 좋아요 데이터를 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async createProductLike(@Req() req, @Body() productLikeDTO: ProductLikeDTO) {
    const { product_id } = productLikeDTO;
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!product_id)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.likeService.createProductLike({
      user_id: req.user.user_id,
      product_id,
    });
  }

  // 상품의 총 좋아요 조회
  @Get('/product/all/:id')
  @ApiOperation({
    summary: '상품 총 좋아요 조회 API',
    description: '상품 전체 좋아요 데이터를 조회한다.',
  })
  async findProductLikeByProductId(@Param('id') id: string) {
    if (!id) throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.likeService.findProductLikeByProductId(id);
  }

  // 사용자가 해당 상품 좋아요 눌렀는지 조회
  @Get('/product/user/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '사용자의 제품 좋아요 조회 API',
    description: '사용자가 해당 제품에 좋아요를 눌렀는지 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findProductLikeByProductIdAndUserId(
    @Req() req,
    @Param('id') id: string,
  ) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!id) throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.likeService.findProductLikeByProductIdAndUserId(
      req.user.user_id,
      id,
    );
  }

  // 사용자별 좋아요 누른 상품
  @Get('/product/my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '사용자가 좋아요 누른 상품 전체 조회 API',
    description: '사용자가 좋아요 누른 상품을 모두 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findProductLikeByUserId(@Req() req) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return await this.likeService.findProductLikeByUserId(req.user.user_id);
  }

  // 마켓 좋아요 생성
  @Post('/market')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '마켓 좋아요 생성 API',
    description: '마켓 좋아요 데이터를 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async createMarketLike(@Req() req, @Body() marketLikeDTO: MarketLikeDTO) {
    const { market_id } = marketLikeDTO;
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!market_id)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.likeService.createMarketLike({
      user_id: req.user.user_id,
      market_id,
    });
  }

  // 마켓의 총 좋아요 조회
  @Get('/market/all/:id')
  @ApiOperation({
    summary: '마켓 총 좋아요 조회 API',
    description: '마켓 전체 좋아요 데이터를 조회한다.',
  })
  async findMarketLikeByMarketId(@Param('id', ParseIntPipe) id: number) {
    if (!id) throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.likeService.findMarketLikeByMarketId(id);
  }

  // 사용자가 해당 마켓 좋아요 눌렀는지 조회
  @Get('/market/user/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '사용자의 마켓 좋아요 조회 API',
    description: '사용자가 해당 마켓에 좋아요를 눌렀는지 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findMarketLikeByMarketIdAndUserId(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!id) throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.likeService.findMarketLikeByMarketIdAndUserId(
      req.user.user_id,
      id,
    );
  }

  // 사용자별 좋아요 누른 마켓
  @Get('/market/my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '사용자가 좋아요 누른 전체 마켓 조회 API',
    description: '사용자가 좋아요 누른 마켓을 모두 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findMarketLikeByUserId(@Req() req) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return await this.likeService.findMarketLikeByUserId(req.user.user_id);
  }
}
