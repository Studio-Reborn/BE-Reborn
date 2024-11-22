/**
File Name : market.entity
Description : 에코마켓 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.11.21  이유민      Created     
2024.11.21  이유민      Modified    에코마켓 추가
2024.11.21  이유민      Modified    user_id 추가
2024.11.22  이유민      Modified    is_deletion_requested 추가
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('market')
export class Market {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ default: 1 })
  profile_image_id: number;

  @Column({ unique: true })
  market_name: string;

  @Column({ type: 'longtext' })
  market_detail: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: false })
  is_deletion_requested: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
