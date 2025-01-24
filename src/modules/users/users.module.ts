/**
File Name : users.module
Description : 사용자 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    사용자 정보 조회 추가
2025.01.19  이유민      Modified    모듈 코드 리팩토링
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/users.entity';
import { UsersRepository } from 'src/modules/users/users.repository';
import { UsersService } from 'src/modules/users/users.service';
import { UsersController } from 'src/modules/users/users.controller';
import { MarketModule } from 'src/modules/market/market.module';
import { ProductModule } from 'src/modules/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), MarketModule, ProductModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
