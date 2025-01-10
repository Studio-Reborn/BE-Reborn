/**
File Name : level.controller
Description : 등급 관련 Controller
Author : 이유민

History
Date        Author      Status      Description
2025.01.06  이유민      Created     
2025.01.06  이유민      Modified    등급 정보 추가
2025.01.06  이유민      Modified    사용자 등급 추가
*/
import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  UnauthorizedException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { LevelInfoDTO } from 'src/modules/level/level.dto';
import { LevelService } from 'src/modules/level/level.service';

@Controller('level')
@ApiTags('등급 API')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  // 등급 생성
  @Post('/info')
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
  async createLevelInfo(@Req() req, @Body() levelInfoDTO: LevelInfoDTO) {
    const { name, description } = levelInfoDTO;
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (req.user.role !== 'admin')
      throw new UnauthorizedException('관리자만 접근 가능합니다.');

    if (!name || !description)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.levelService.createLevelInfo({ name, description });
  }

  // 등급 전체 조회
  @Get('/info')
  @ApiOperation({
    summary: '상품 좋아요 생성 API',
    description: '상품 좋아요 데이터를 생성한다.',
  })
  async findLevelInfoAll() {
    return await this.levelService.findLevelInfoAll();
  }

  // 사용자의 등급 조회
  @Get('/user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '상품 좋아요 생성 API',
    description: '상품 좋아요 데이터를 생성한다.',
  })
  async findLevelAssignmentByUserId(@Req() req) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return await this.levelService.findLevelAssignmentByUserId(
      req.user.user_id,
    );
  }
}
