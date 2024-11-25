/**
File Name : product.entity
Description : 상품 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    상품 등록 기능 추가
2024.11.08  이유민      Modified    리본 리메이크 제품 분리
2024.11.19  이유민      Modified    price 타입 변경
2024.11.21  이유민      Modified    detail 타입 변경
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  product_image_id: number;

  @Column({
    type: 'enum',
    enum: ['user', 'market'],
    default: 'user',
  })
  theme: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'longtext' })
  detail: string;

  @Column({ nullable: false, type: 'bigint' })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
