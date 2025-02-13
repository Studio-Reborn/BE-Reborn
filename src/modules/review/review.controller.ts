/**
File Name : review.entity
Description : 리뷰 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.12.19  이유민      Created     
2024.12.19  이유민      Modified    리뷰 추가
2024.12.28  이유민      Modified    리뷰 상세 조회 추가
2025.01.07  이유민      Modified    에코마켓별 리뷰 조회 추가
2025.02.13  이유민      Modified    swagger 설명 수정
*/
import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ReviewDTO } from 'src/modules/review/review.dto';
import { ReviewService } from 'src/modules/review/review.service';

@Controller('review')
@ApiTags('리뷰 API')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // 리뷰 생성
  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '리뷰 생성 API',
    description: '리뷰를 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async createReview(@Req() req, @Body() reviewDTO: ReviewDTO) {
    const { product_id, content, items_id } = reviewDTO;

    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!product_id || !content)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return this.reviewService.createReview({
      user_id: req.user.user_id,
      product_id,
      content,
      items_id,
    });
  }

  // 제품별 리뷰 조회
  @Get('/product/:id')
  @ApiOperation({
    summary: '제품별 리뷰 조회 API',
    description: '판매 제품별 리뷰를 조회한다.',
  })
  async findReviewByProductId(@Param('id') id: string) {
    return this.reviewService.findReviewByProductId(id);
  }

  // 마켓별 리뷰 조회
  @Get('/market/:id')
  @ApiOperation({
    summary: '마켓별 리뷰 조회 API',
    description: '에코마켓별 리뷰를 조회한다.',
  })
  async findReviewByMarketId(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findReviewByMarketId(id);
  }

  // 사용자별 작성 리뷰 조회
  @Get('/my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '사용자별 작성 리뷰 조회 API',
    description: '본인이 작성한 리뷰를 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findReviewByUserId(@Req() req) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return this.reviewService.findReviewByUserId(req.user.user_id);
  }

  // 리뷰 상세 조회
  @Get('/info/:id')
  @ApiOperation({
    summary: '리뷰 상세 조회 API',
    description: '상세 리뷰를 조회한다.',
  })
  async findReviewById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findReviewById(id);
  }

  // 리뷰 수정
  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '리뷰 수정 API',
    description: '리뷰를 수정한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async updateReviewById(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() content: string,
  ) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return this.reviewService.updateReviewById(id, req.user.user_id, content);
  }

  // 리뷰 삭제
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '리뷰 삭제 API',
    description: '리뷰를 삭제한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async deleteReviewById(@Req() req, @Param('id', ParseIntPipe) id: number) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return this.reviewService.deleteReviewById(id, req.user.user_id);
  }
}
