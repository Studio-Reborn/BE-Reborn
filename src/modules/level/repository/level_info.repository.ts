/**
File Name : level_info.repository
Description : 등급 정보 Repository
Author : 이유민

History
Date        Author      Status      Description
2025.01.06  이유민      Created     
2025.01.06  이유민      Modified    등급 정보 추가
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelInfo } from 'src/modules/level/entity/level_info.entity';

@Injectable()
export class LevelInfoRepository {
  constructor(
    @InjectRepository(LevelInfo)
    private readonly levelInfoRepository: Repository<LevelInfo>,
  ) {}

  // 사용자 등급 생성
  async createLevelInfo(levelData: Partial<LevelInfo>): Promise<object> {
    const level = this.levelInfoRepository.create(levelData);
    await this.levelInfoRepository.save(level);

    return { message: '사용자 등급이 성공적으로 생성되었습니다.' };
  }

  // 사용자 등급 전체 조회
  async findLevelInfoAll(): Promise<LevelInfo[]> {
    return await this.levelInfoRepository
      .createQueryBuilder('info')
      .where('info.deleted_at IS NULL')
      .orderBy('info.id', 'ASC')
      .getMany();
  }
}
