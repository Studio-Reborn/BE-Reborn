/**
File Name : message.entity
Description : 채팅 메시지 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.12.05  이유민      Created     
2024.12.05  이유민      Modified    채팅 메시지 추가
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  chat_id: string;

  @Column({ nullable: false })
  sender_id: number;

  @Column({ type: 'longtext', nullable: false })
  content: string;

  @CreateDateColumn()
  created_at: Date;
}
