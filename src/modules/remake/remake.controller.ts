/**
File Name : remake.dto
Description : 리본 리메이크 Dto
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 추천 기능 추가
2024.11.06  이유민      Modified    리본 리메이크 제품 요청 기능 추가
2024.11.08  이유민      Modified    리본 리메이크 제품 조회 추가
2024.11.12  이유민      Modified    UseGuards 추가
2024.11.13  이유민      Modified    jwt 관련 파일 경로 수정
2024.11.18  이유민      Modified    리본 리메이크 제품 CRUD 추가
*/
import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Query,
  Param,
  Req,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { RemakeService } from 'src/modules/remake/remake.service';
import { RemakeDTO, RemakeProductDTO } from 'src/modules/remake/remake.dto';

@Controller('remake')
export class RemakeController {
  constructor(private readonly remakeService: RemakeService) {}

  // 리본 리메이크 제품 요청
  @Post('/request')
  @UseGuards(JwtAuthGuard)
  async create(@Req() req, @Body() remakeDTO: RemakeDTO) {
    const { remake_product } = remakeDTO;

    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!remake_product)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return this.remakeService.createRemake({
      user_id: req.user.user_id,
      remake_product,
    });
  }

  // 리본 리메이크 제품 추천받기
  @Get()
  async recommendProduct(@Query('thing') thing: string) {
    return this.remakeService.recommendRemake(thing);
  }

  // 리본 리메이크 제품 생성
  @Post('/product')
  async createRemakeProduct(@Body() remakeProductDTO: RemakeProductDTO) {
    return this.remakeService.createRemakeProduct(remakeProductDTO);
  }

  // 리본 리메이크 제품 전체 조회
  @Get('/product')
  async findRemakeProductAll() {
    return this.remakeService.findRemakeProductAll();
  }

  // 리본 리메이크 제품 개별 조회
  @Get('/product/:id')
  async findRemakeProductById(@Param('id', ParseIntPipe) id: number) {
    return this.remakeService.findRemakeProductById(id);
  }

  // 리본 리메이크 제품 수정
  @Patch('/product/:id')
  @UseGuards(JwtAuthGuard)
  async updateRemakeProductById(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() remakeProductDTO: RemakeProductDTO,
  ) {
    return this.remakeService.updateRemakeProductById(id, remakeProductDTO);
  }

  // 리본 리메이크 제품 삭제
  @Delete('/product/:id')
  @UseGuards(JwtAuthGuard)
  async deleteRemakeProductById(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.remakeService.deleteRemakeProductById(id);
  }
}
