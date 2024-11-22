/**
File Name : profile_image.module
Description : 프로필 이미지 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    프로필 이미지 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/modules/profile_image/profile_image.entity';
import { ProfileRepository } from 'src/modules/profile_image/profile_image.repository';
import { ProfileService } from 'src/modules/profile_image/profile_image.service';
import { ProfileController } from 'src/modules/profile_image/profile_image.controller';
import { Users } from 'src/modules/users/users.entity';
import { UsersRepository } from 'src/modules/users/users.repository';
import { UsersService } from 'src/modules/users/users.service';
import { UsersController } from 'src/modules/users/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Users])],
  providers: [ProfileRepository, ProfileService, UsersRepository, UsersService],
  controllers: [ProfileController, UsersController],
})
export class ProfileModule {}
