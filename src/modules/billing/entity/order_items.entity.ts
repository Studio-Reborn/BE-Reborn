/**
File Name : order_items.entity
Description : 주문 제품 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.11.26  이유민      Created     
2024.11.26  이유민      Modified    주문 제품 추가
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
  product_id: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  total_price: number;

  @CreateDateColumn()
  created_at: Date;
}
