/**
File Name : market_like.entity
Description : 마켓 좋아요 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.12.17  이유민      Created     
2024.12.17  이유민      Modified    마켓 좋아요 추가
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('market_like')
export class MarketLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  market_id: number;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
