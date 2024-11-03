/**
File Name : remake.module
Description : 리본 리메이크 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 요청 기능 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Remake } from 'src/modules/remake/remake.entity';
import { RemakeRepository } from 'src/modules/remake/remake.repository';
import { RemakeService } from 'src/modules/remake/remake.service';
import { RemakeController } from 'src/modules/remake/remake.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Remake])],
  providers: [RemakeService, RemakeRepository],
  controllers: [RemakeController],
})
export class RemakeModule {}
