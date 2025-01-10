/**
File Name : level_assignment.repository
Description : 사용자 등급 데이터 Repository
Author : 이유민

History
Date        Author      Status      Description
2025.01.06  이유민      Created     
2025.01.06  이유민      Modified    사용자 등급 추가
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelAssignment } from 'src/modules/level/entity/level_assignment.entity';

@Injectable()
export class LevelAssignmentRepository {
  constructor(
    @InjectRepository(LevelAssignment)
    private readonly assignmentRepository: Repository<LevelAssignment>,
  ) {}

  // 사용자 등급 생성 및 수정
  async createLevelAssignment(
    assignmentData: Partial<LevelAssignment>,
  ): Promise<LevelAssignment> {
    const level = this.assignmentRepository.create(assignmentData);
    return await this.assignmentRepository.save(level);
  }

  // user_id로 사용자 등급 조회
  async findLevelAssignmentByUserId(user_id: number): Promise<LevelAssignment> {
    const level = await this.assignmentRepository
      .createQueryBuilder('assignment')
      .leftJoin('level_info', 'info', 'assignment.level_id = info.id')
      .select([
        'assignment.level_id AS level_id',
        'assignment.assigned_at AS assigned_at',
        'info.name AS level_name',
        'info.description AS level_description',
      ])
      .where('assignment.user_id = :user_id', { user_id })
      .orderBy('assignment.assigned_at', 'DESC')
      .getRawOne();

    if (!level) {
      await this.createLevelAssignment({ user_id, level_id: 1 });

      return await this.findLevelAssignmentByUserId(user_id);
    }

    // 등급 계산 및 수정
    const check = await this.calculateLevelAssignmentByUserId(
      user_id,
      level.level_id,
    );

    if (check.update) {
      // 수정되었을 경우 다시 검색
      return await this.findLevelAssignmentByUserId(user_id);
    }

    return level;
  }

  async calculateLevelAssignmentByUserId(
    user_id: number,
    old_level_id: number,
  ): Promise<{ update: boolean }> {
    let level_id = 1;

    // 중고거래 횟수 계산
    const preLoved = await this.assignmentRepository
      .createQueryBuilder('assignment')
      .leftJoin(
        'user_product',
        'preLoved',
        'assignment.user_id = preLoved.user_id',
      )
      .select('COUNT(*) AS "cnt"')
      .where('assignment.user_id = :user_id AND preLoved.deleted_at IS NULL', {
        user_id,
      })
      .getRawOne();

    // 에코마켓 구매 및 리본 리메이크 구매 횟수 계산
    const purchase = await this.assignmentRepository
      .createQueryBuilder('assignment')
      .leftJoin('orders', 'orders', 'assignment.user_id = orders.user_id')
      .leftJoin('order_items', 'items', 'orders.id = items.order_id')
      .select([
        "COUNT(CASE WHEN items.category = 'market' THEN 1 END) AS `market_cnt`",
        "COUNT(CASE WHEN items.category = 'reborn' THEN 1 END) AS `reborn_cnt`",
      ])
      .where('assignment.user_id = :user_id AND orders.deleted_at IS NULL', {
        user_id,
      })
      .getRawOne();

    preLoved.cnt = Number(preLoved.cnt);
    purchase.market_cnt = Number(purchase.market_cnt);
    purchase.reborn_cnt = Number(purchase.reborn_cnt);

    if (
      preLoved.cnt === 0 &&
      purchase.market_cnt === 0 &&
      purchase.reborn_cnt === 0
    ) {
      level_id = 1;
    } else if (
      preLoved.cnt > 0 ||
      purchase.market_cnt > 0 ||
      purchase.reborn_cnt > 0
    ) {
      level_id = 2;
    }

    if (preLoved.cnt >= 10) level_id = 3;

    if (purchase.market_cnt >= 10) level_id = 4;

    if (purchase.reborn_cnt >= 10) level_id = 5;

    if (preLoved.cnt + purchase.market_cnt + purchase.reborn_cnt >= 50)
      level_id = 6;

    if (
      (preLoved.cnt >= 10 && purchase.market_cnt >= 10) ||
      (preLoved.cnt >= 10 && purchase.reborn_cnt >= 10) ||
      (purchase.market_cnt >= 10 && purchase.reborn_cnt >= 10)
    ) {
      const maxActivity = Math.max(
        preLoved.cnt,
        purchase.market_cnt,
        purchase.reborn_cnt,
      );

      if (maxActivity === preLoved.cnt) {
        level_id = 3;
      } else if (maxActivity === purchase.market_cnt) {
        level_id = 4;
      } else if (maxActivity === purchase.reborn_cnt) {
        level_id = 5;
      }
    }

    // 기존 등급과 계산 등급이 다를 경우 새 데이터 생성
    if (level_id !== old_level_id) {
      await this.createLevelAssignment({ user_id, level_id });
      return { update: true };
    }

    return { update: false };
  }
}
