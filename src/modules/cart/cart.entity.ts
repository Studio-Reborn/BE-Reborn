/**
File Name : cart.entity
Description : 장바구니 Entity
Author : 이유민

History
Date        Author      Status      Description
2025.01.11  이유민      Created     
2025.01.11  이유민      Modified    장바구니 추가
*/
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('cart')
export class Cart {
  @PrimaryColumn()
  user_id: number;

  @Column('text')
  cart_items: string;
}
