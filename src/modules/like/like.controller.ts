/**
File Name : like.controller
Description : 좋아요 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.12.16  이유민      Created     
2024.12.16  이유민      Modified    상품 좋아요 추가
2024.12.17  이유민      Modified    product_id 타입 수정
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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { ProductLikeDTO } from 'src/modules/like/like.dto';
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '상품 좋아요 조회 API',
    description: '상품 좋아요 데이터를 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findProductLikeByProductId(@Req() req, @Param('id') id: string) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!id) throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.likeService.findProductLikeByProductId(id);
  }

  // 사용자가 해당 상품 좋아요 눌렀는지 조회
  @Get('/product/user/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '상품 좋아요 조회 API',
    description: '상품 좋아요 데이터를 조회한다.',
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
}
