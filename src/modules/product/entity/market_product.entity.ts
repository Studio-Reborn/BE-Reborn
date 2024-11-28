/**
File Name : market_product.entity
Description : 에코마켓 상품 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.11.26  이유민      Created     
2024.11.26  이유민      Modified    상품 테이블 분리
2024.11.26  이유민      Modified    상품 상태 추가
2024.11.26  이유민      Modified    상품 수량 추가
2024.11.27  이유민      Modified    status 수정
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('market_product')
export class MarketProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  market_id: number;

  @Column({ nullable: false })
  product_image_id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'longtext' })
  detail: string;

  @Column({ nullable: false, type: 'bigint' })
  price: number;

  @Column({ nullable: false, type: 'bigint' })
  quantity: number;

  @Column({
    type: 'enum',
    enum: ['판매중', '품절', '판매중단', '숨김'],
    nullable: false,
    default: '판매중',
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
