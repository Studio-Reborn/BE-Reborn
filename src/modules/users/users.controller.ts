/**
File Name : users.controller
Description : 사용자 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    사용자 정보 조회 추가
2024.11.13  이유민      Modified    닉네임 수정 추가
2024.11.18  이유민      Modified    swagger 추가
2024.11.19  이유민      Modified    id로 사용자 정보 조회 추가
*/
import {
  Controller,
  Get,
  Patch,
  Req,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { UsersService } from 'src/modules/users/users.service';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@Controller('users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 본인 정보 조회
  @Get()
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
  async findMyUserInfo(@Req() req) {
    return await this.usersService.findUserById(req.user.user_id);
  }

  // 사용자 정보 조회
  @Get(':id')
  @ApiOperation({
    summary: '사용자 정보 조회 API',
    description: 'user_id를 이용해 사용자 정보를 조회한다.',
  })
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findUserById(id);
  }

  // 닉네임 수정
  @Patch('/nickname')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '닉네임 수정 API',
    description: '사용자의 닉네임을 수정한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async updateNickname(@Req() req, @Body('nickname') nickname: string) {
    return await this.usersService.updateNickname(req.user.user_id, nickname);
  }
}
