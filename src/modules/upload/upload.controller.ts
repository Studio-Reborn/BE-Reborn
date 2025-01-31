/**
File Name : upload.controller
Description : 파일 업로드 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    프로필 이미지 업로드 추가
2024.11.18  이유민      Modified    swagger 추가
2024.11.20  이유민      Modified    상품 이미지 업로드 추가
2024.11.21  이유민      Modified    에코마켓 프로필 이미지 업로드 추가
2025.01.27  이유민      Modified    구글 드라이브 연동 추가
*/
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { ProfileService } from 'src/modules/profile_image/profile_image.service';
import { UsersService } from 'src/modules/users/users.service';
import { ProductImageService } from 'src/modules/product_image/product_image.service';
import { GoogleDriveService } from 'src/services/google-drive.service';
import * as path from 'path';

@Controller('upload')
@ApiTags('파일 업로드 API')
export class UploadController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
    private readonly productImageService: ProductImageService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  // 회원 프로필 이미지 업로드
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
    const uploadDir = path.resolve(__dirname, '../../../uploads');
    const filePath = path.join(uploadDir, file.filename);
    const fileName = file.filename;
    const mimeType = file.mimetype;

    // 구글 드라이브에 파일 저장
    const fileUrl = await this.googleDriveService.uploadFile(
      filePath,
      fileName,
      mimeType,
    );

    const profile_image = await this.profileService.createProfile({
      url: fileUrl.split('uc?id=')[1],
    });

    // 회원 테이블 profile_iamge_id 값 수정
    await this.usersService.updateProfileImageId(
      req.user.user_id,
      profile_image.id,
    );

    return { message: '프로필 이미지가 변경되었습니다.' };
  }

  // 에코마켓 프로필 이미지 업로드
  @Post('/profile/eco-market')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '에코마켓 프로필 이미지 파일 업로드 API',
    description: '에코마켓 프로필 이미지를 업로드한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async uploadEcoMarketProfile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    const uploadDir = path.resolve(__dirname, '../../../uploads');
    const filePath = path.join(uploadDir, file.filename);
    const fileName = file.filename;
    const mimeType = file.mimetype;

    const fileUrl = await this.googleDriveService.uploadFile(
      filePath,
      fileName,
      mimeType,
    );
    console.log(fileUrl);

    return await this.profileService.createProfile({
      url: fileUrl.split('uc?id=')[1],
    });
  }

  // 상품 이미지 업로드
  @Post('/product-image')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadProductImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const imagesUrl = [];
    for (let i = 0; i < files.length; i++) {
      const uploadDir = path.resolve(__dirname, '../../../uploads');
      const filePath = path.join(uploadDir, files[i].filename);
      const fileName = files[i].filename;
      const mimeType = files[i].mimetype;

      const fileUrl = await this.googleDriveService.uploadFile(
        filePath,
        fileName,
        mimeType,
      );

      imagesUrl.push(fileUrl.split('uc?id=')[1]);
    }

    return await this.productImageService.createProductImage({
      url: imagesUrl,
    });
  }
}
