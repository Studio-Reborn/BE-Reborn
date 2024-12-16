/**
File Name : chat.entity
Description : 채팅 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.12.05  이유민      Created     
2024.12.05  이유민      Modified    채팅 추가
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  product_id: number;

  @Column({ nullable: false })
  seller_id: number;

  @Column({ nullable: false })
  buyer_id: number;

  @DeleteDateColumn()
  seller_deleted_at: Date;

  @DeleteDateColumn()
  buyer_deleted_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
