/**
File Name : profile_image.module
Description : 프로필 이미지 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    프로필 이미지 추가
2025.01.19  이유민      Modified    모듈 코드 리팩토링
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/modules/profile_image/profile_image.entity';
import { ProfileRepository } from 'src/modules/profile_image/profile_image.repository';
import { ProfileService } from 'src/modules/profile_image/profile_image.service';
import { ProfileController } from 'src/modules/profile_image/profile_image.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { MarketModule } from 'src/modules/market/market.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UsersModule, MarketModule],
  providers: [ProfileRepository, ProfileService],
  controllers: [ProfileController],
  exports: [ProfileRepository, ProfileService],
})
export class ProfileModule {}
