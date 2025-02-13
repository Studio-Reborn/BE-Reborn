/**
File Name : billing.controller
Description : 결제 및 주문 관련 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.24  이유민      Created     
2024.11.24  이유민      Modified    결제 추가
2024.11.24  이유민      Modified    주문 추가
2024.11.27  이유민      Modified    userId로 구매내역 조회 추가
2025.01.18  이유민      Modified    내 마켓 관련 API 추가
2025.01.18  이유민      Modified    리본 리메이크 판매 내역 추가
2025.02.13  이유민      Modified    swagger 설명 수정
*/
import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { TossPaymentDTO, ItemUpdateDTO } from 'src/modules/billing/billing.dto';
import { BillingService } from 'src/modules/billing/billing.service';

@Controller('billing')
@ApiTags('결제 및 주문 API')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // Toss Payment 결제
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '결제 API',
    description: '토스 페이먼츠 결제 후 주문 및 결제 데이터를 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async createBilling(@Req() req, @Body() tossPaymentDTO: TossPaymentDTO) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return await this.billingService.TossPayment(
      req.user.user_id,
      tossPaymentDTO,
    );
  }

  // Toss Payment 결제 취소
  @Post('/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '결제 취소 API',
    description: '토스 페이먼츠 결제 취소 후 주문 및 결제 데이터를 수정한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async cancelBilling(
    @Req() req,
    @Body() body: { paymentKey: string; cancelReason: string },
  ) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return await this.billingService.tossPaymentsCancel(
      req.user.user_id,
      body.paymentKey,
      body.cancelReason,
    );
  }

  @Get('/purchase/eco-market')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '에코마켓 구매내역 조회 API',
    description: '사용자 본인의 에코마켓 구매내역을 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findMarketPurchasesByUserId(@Req() req) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return await this.billingService.findMarketPurchasesByUserId(
      req.user.user_id,
    );
  }

  @Get('/purchase/reborn-remake')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '리본 리메이크 구매내역 조회 API',
    description: '사용자 본인의 리본 리메이크 구매내역을 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findRemakePurchasesByUserId(@Req() req) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return await this.billingService.findRemakePurchasesByUserId(
      req.user.user_id,
    );
  }

  @Get('/item/remake')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '관리자의 리본 리메이크 구매내역 전체 조회 API',
    description: '관리자가 리본 리메이크 구매내역을 모두 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findRemakeItem(@Req() req) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (req.user.role !== 'admin')
      throw new UnauthorizedException('관리자만 이용 가능합니다.');

    return await this.billingService.findRemakeItem();
  }

  @Patch('/item/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '구매내역 아이템 수정 API',
    description: '일반 사용자의 구매내역 아이템을 수정한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async updateItemsById(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() itemUpdateDTO: ItemUpdateDTO,
  ) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return await this.billingService.updateItemById(id, itemUpdateDTO);
  }
}
