/**
File Name : profile_image.controller
Description : 프로필 이미지 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    프로필 이미지 추가
*/
import {
  Controller,
  Get,
  UnauthorizedException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from 'src/modules/profile_image/profile_image.service';
import { UsersService } from 'src/modules/users/users.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
  ) {}

  // 사용자 프로필 이미지 조회
  @Get()
  @UseGuards(JwtAuthGuard)
  async findProfile(@Req() req) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    const user = await this.usersService.findUserById(req.user.user_id);

    return await this.profileService.findProfileById(user.profile_image_id);
  }
}
