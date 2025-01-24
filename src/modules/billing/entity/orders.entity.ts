/**
File Name : orders.entity
Description : 주문 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.11.24  이유민      Created     
2024.11.24  이유민      Modified    주문 추가
2024.11.26  이유민      Modified    product_id 제거
2025.01.18  이유민      Modified    name 및 phone 추가
*/
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  postcode: number;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  detail_address: string;

  @Column({ nullable: false })
  extra_address: string;

  @Column({ nullable: false })
  payments_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
