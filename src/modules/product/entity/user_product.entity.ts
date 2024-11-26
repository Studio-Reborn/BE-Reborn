/**
File Name : user_product.entity
Description : 중고거래 상품 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.11.26  이유민      Created     
2024.11.26  이유민      Modified    상품 테이블 분리
2024.11.26  이유민      Modified    상품 상태 추가
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('user_product')
export class UserProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  product_image_id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'longtext' })
  detail: string;

  @Column({ nullable: false, type: 'bigint' })
  price: number;

  @Column({ nullable: false, default: '판매중' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
