/**
File Name : level.service
Description : 등급 관련 Service
Author : 이유민

History
Date        Author      Status      Description
2025.01.06  이유민      Created     
2025.01.06  이유민      Modified    등급 정보 추가
2025.01.06  이유민      Modified    사용자 등급 추가
*/
import { Injectable } from '@nestjs/common';
import { LevelInfo } from 'src/modules/level/entity/level_info.entity';
import { LevelInfoRepository } from 'src/modules/level/repository/level_info.repository';
import { LevelAssignment } from 'src/modules/level/entity/level_assignment.entity';
import { LevelAssignmentRepository } from 'src/modules/level/repository/level_assignment.repository';

@Injectable()
export class LevelService {
  constructor(
    private readonly levelInfoRepository: LevelInfoRepository,
    private readonly assignmentRepository: LevelAssignmentRepository,
  ) {}

  // 등급 생성
  async createLevelInfo(levelData: Partial<LevelInfo>): Promise<object> {
    return this.levelInfoRepository.createLevelInfo(levelData);
  }

  // 등급 전체 조회
  async findLevelInfoAll(): Promise<LevelInfo[]> {
    return this.levelInfoRepository.findLevelInfoAll();
  }

  // 사용자의 등급 조회하기
  async findLevelAssignmentByUserId(user_id: number): Promise<LevelAssignment> {
    return this.assignmentRepository.findLevelAssignmentByUserId(user_id);
  }
}
