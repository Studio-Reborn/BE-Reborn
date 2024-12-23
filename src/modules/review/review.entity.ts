/**
File Name : review.entity
Description : 리뷰 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.12.19  이유민      Created     
2024.12.19  이유민      Modified    리뷰 추가
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  product_id: string;

  @Column({ type: 'longtext', nullable: false })
  content: string;

  @Column({ default: null })
  items_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
