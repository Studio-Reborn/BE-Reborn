/**
File Name : users.controller
Description : 사용자 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    사용자 정보 조회 추가
2024.11.13  이유민      Modified    닉네임 수정 추가
*/
import { Controller, Get, Patch, Req, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { UsersService } from 'src/modules/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 사용자 정보 조회
  @Get()
  @UseGuards(JwtAuthGuard)
  async findUserById(@Req() req) {
    return await this.usersService.findUserById(req.user.user_id);
  }

  @Patch('/nickname')
  @UseGuards(JwtAuthGuard)
  async updateNickname(@Req() req, @Body('nickname') nickname: string) {
    return await this.usersService.updateNickname(req.user.user_id, nickname);
  }
}
