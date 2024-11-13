/**
File Name : auth.entity
Description : 회원가입 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    회원 기능 추가
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({ default: null })
  refresh_token: string;

  @Column({ default: 0 })
  login_attempts: number;

  @Column({ default: null })
  last_login_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
