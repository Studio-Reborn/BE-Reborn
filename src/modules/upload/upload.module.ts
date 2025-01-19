/**
File Name : upload.module
Description : 파일 업로드 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    파일 업로드 추가
2025.01.19  이유민      Modified    모듈 코드 리팩토링
*/
import { Module } from '@nestjs/common';
import { UploadController } from 'src/modules/upload/upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersModule } from 'src/modules/users/users.module';
import { MarketModule } from 'src/modules/market/market.module';
import { ProfileModule } from 'src/modules/profile_image/profile_image.module';
import { ProductImageModule } from 'src/modules/product_image/product_image.module';

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
    UsersModule,
    MarketModule,
    ProfileModule,
    ProductImageModule,
  ],
  controllers: [UploadController],
})
export class UploadModule {}
