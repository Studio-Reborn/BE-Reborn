/**
File Name : product_image.entity
Description : 상품 이미지 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.11.20  이유민      Created     
2024.11.20  이유민      Modified    상품 이미지 추가
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('product_image')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'json' })
  url: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
