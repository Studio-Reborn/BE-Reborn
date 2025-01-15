/**
File Name : cart_items.entity
Description : 장바구니 아이템 Entity
Author : 이유민

History
Date        Author      Status      Description
2025.01.15  이유민      Created     
2025.01.15  이유민      Modified    장바구니 아이템 추가
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  cart_id: number;

  @Column({ nullable: false })
  product_id: string;

  @Column({ nullable: false })
  quantity: number;

  @DeleteDateColumn()
  deleted_at: Date;
}
