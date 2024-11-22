/**
File Name : upload.module
Description : 파일 업로드 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    파일 업로드 추가
*/
import { Module } from '@nestjs/common';
import { UploadController } from 'src/modules/upload/upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/modules/profile_image/profile_image.entity';
import { ProfileRepository } from 'src/modules/profile_image/profile_image.repository';
import { ProfileService } from 'src/modules/profile_image/profile_image.service';
import { Users } from 'src/modules/users/users.entity';
import { UsersRepository } from 'src/modules/users/users.repository';
import { UsersService } from 'src/modules/users/users.service';
import { ProductImage } from 'src/modules/product_image/product_image.entity';
import { ProductImageRepository } from 'src/modules/product_image/product_image.repository';
import { ProductImageService } from 'src/modules/product_image/product_image.service';

@Module({
  imports: [
    // Multer 설정 (옵션)
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const randomName = `${Date.now()}${fileExtName}`;
          callback(null, randomName);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
    TypeOrmModule.forFeature([Profile, Users, ProductImage]),
  ],
  providers: [
    ProfileRepository,
    ProfileService,
    UsersRepository,
    UsersService,
    ProductImageRepository,
    ProductImageService,
  ],
  controllers: [UploadController],
})
export class UploadModule {}
