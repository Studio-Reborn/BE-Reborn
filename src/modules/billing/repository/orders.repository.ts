/**
File Name : orders.repository
Description : 주문 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.24  이유민      Created     
2024.11.24  이유민      Modified    주문 추가
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/modules/billing/entity/orders.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // 주문 생성
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  // user_id로 주문 조회
  async findOrderByUserId(user_id: number): Promise<Order[]> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .where('order.user_id = :user_id AND order.user_id IS NULL', { user_id })
      .getMany();
  }
}
