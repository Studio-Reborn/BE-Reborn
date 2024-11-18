/**
File Name : upload.controller
Description : 파일 업로드 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    프로필 이미지 업로드 추가
2024.11.18  이유민      Modified    swagger 추가
*/
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ProfileService } from 'src/modules/profile_image/profile_image.service';
import { UsersService } from 'src/modules/users/users.service';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@Controller('upload')
@ApiTags('파일 업로드 API')
export class UploadController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
  ) {}

  // 프로필 이미지 업로드
  @Post('/profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '프로필 이미지 파일 업로드 API',
    description: '프로필 이미지를 업로드한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async uploadFile(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const profile_image = await this.profileService.createProfile({
      url: file.path,
    });

    // 회원 테이블 profile_iamge_id 값 수정
    await this.usersService.updateProfileImageId(
      req.user.user_id,
      profile_image.id,
    );
    return { message: '프로필 이미지가 변경되었습니다.' };
  }
}
