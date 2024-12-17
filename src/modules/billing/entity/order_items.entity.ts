/**
File Name : order_items.entity
Description : 주문 제품 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.11.26  이유민      Created     
2024.11.26  이유민      Modified    주문 제품 추가
2024.11.28  이유민      Modified    category 추가
2024.12.17  이유민      Modified    product_id 타입 수정
*/
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('order_items')
export class OrderItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  order_id: string;

  @Column({ nullable: false })
  product_id: string;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  total_price: number;

  @Column({
    type: 'enum',
    enum: ['market', 'reborn'],
    nullable: false,
    default: 'market',
  })
  category: string;

  @CreateDateColumn()
  created_at: Date;
}
