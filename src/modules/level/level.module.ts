/**
File Name : level.module
Description : 등급 관련 Module
Author : 이유민

History
Date        Author      Status      Description
2025.01.06  이유민      Created     
2025.01.06  이유민      Modified    등급 정보 추가
2025.01.06  이유민      Modified    사용자 등급 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelInfo } from 'src/modules/level/entity/level_info.entity';
import { LevelInfoRepository } from 'src/modules/level/repository/level_info.repository';
import { LevelAssignment } from 'src/modules/level/entity/level_assignment.entity';
import { LevelAssignmentRepository } from 'src/modules/level/repository/level_assignment.repository';
import { LevelService } from 'src/modules/level/level.service';
import { LevelController } from 'src/modules/level/level.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LevelInfo, LevelAssignment])],
  providers: [LevelInfoRepository, LevelAssignmentRepository, LevelService],
  controllers: [LevelController],
})
export class LevelModule {}
