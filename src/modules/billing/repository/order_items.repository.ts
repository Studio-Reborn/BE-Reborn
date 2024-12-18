/**
File Name : order_items.repository
Description : 주문 제품 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.26  이유민      Created     
2024.11.26  이유민      Modified    주문 제품 추가
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItems } from 'src/modules/billing/entity/order_items.entity';

@Injectable()
export class OrderItemsRepository {
  constructor(
    @InjectRepository(OrderItems)
    private readonly orderItemsRepository: Repository<OrderItems>,
  ) {}

  // 주문 제품 생성
  async createOrderItems(
    orderItemsData: Partial<OrderItems>[],
  ): Promise<OrderItems[]> {
    return await this.orderItemsRepository.save(orderItemsData);
  }
}
