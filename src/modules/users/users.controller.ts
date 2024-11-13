/**
File Name : users.controller
Description : 사용자 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    사용자 정보 조회 추가
*/
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
}
