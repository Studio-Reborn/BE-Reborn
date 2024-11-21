/**
File Name : market.controller
Description : 에코마켓 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.21  이유민      Created     
2024.11.21  이유민      Modified    에코마켓 추가
*/
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { MarketDTO } from 'src/modules/market/market.dto';
import { MarketService } from 'src/modules/market/market.service';

@Controller('market')
@ApiTags('에코마켓 API')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  // 에코마켓 생성
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '본인 정보 조회 API',
    description: '사용자 본인의 정보를 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async createMarket(@Body() marketDTO: MarketDTO) {
    return await this.marketService.createMarket(marketDTO);
  }
}
