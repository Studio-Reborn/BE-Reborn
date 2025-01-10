/**
File Name : level_assignment.entity
Description : 사용자 등급 데이터 Entity
Author : 이유민

History
Date        Author      Status      Description
2025.01.06  이유민      Created     
2025.01.06  이유민      Modified    사용자 등급 추가
*/
import { Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('level_assignment')
export class LevelAssignment {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  level_id: number;

  @CreateDateColumn()
  assigned_at: Date;
}
