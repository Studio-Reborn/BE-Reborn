/**
File Name : payments.entity
Description : 결제 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.11.24  이유민      Created     
2024.11.24  이유민      Modified    결제 추가
*/
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  method: string;

  @Column({ nullable: false })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
