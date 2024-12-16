/**
File Name : product_like.entity
Description : 상품 좋아요 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.12.16  이유민      Created     
2024.12.16  이유민      Modified    상품 좋아요 추가
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('product_like')
export class ProductLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  product_id: number;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
