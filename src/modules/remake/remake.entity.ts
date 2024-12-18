/**
File Name : remake.entity
Description : 리본 리메이크 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 요청 기능 추가
2024.11.08  이유민      Modified    리본 리메이크 제품 분리
2024.11.19  이유민      Modified    detail 타입 변경
2024.12.04  이유민      Modified    deleted_at 추가
2024.12.18  이유민      Modified    id 타입 수정
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('reborn_requests')
export class Remake {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  remake_product: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

@Entity('remake_product')
export class RemakeProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  product_image_id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'longtext', nullable: false })
  detail: string;

  @Column()
  matter: string;

  @Column({ nullable: false })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
