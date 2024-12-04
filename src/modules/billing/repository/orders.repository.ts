/**
File Name : orders.repository
Description : 주문 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.24  이유민      Created     
2024.11.24  이유민      Modified    주문 추가
2024.11.27  이유민      Modified    userId로 구매내역 조회 추가
2024.12.04  이유민      Modified    코드 리팩토링
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

  async findMarketPurchasesByUserId(user_id: number): Promise<object[]> {
    return await this.orderRepository
      .createQueryBuilder('orders')
      .leftJoin('payments', 'payments', 'orders.payments_id = payments.id')
      .leftJoin('order_items', 'items', 'orders.id = items.order_id')
      .leftJoin('market_product', 'product', 'items.product_id = product.id')
      .leftJoin('market', 'market', 'product.market_id = market.id')
      .leftJoin(
        'product_image',
        'product_image',
        'product.product_image_id = product_image.id',
      )
      .select([
        'orders.id AS order_id',
        'orders.created_at AS order_created_at',
        'orders.payments_id AS payments_id',
        'payments.method AS payments_method',
        'payments.status AS payments_status',
        'items.product_id AS product_id',
        'items.quantity AS product_quantity',
        'items.price AS product_price',
        'product.name AS product_name',
        'product_image.url AS product_image',
        'market.market_name AS market_name',
        'market.id AS market_id',
      ])
      .where('orders.user_id = :user_id AND items.category = "market"', {
        user_id,
      })
      .orderBy({ 'orders.created_at': 'DESC' })
      .getRawMany();
  }

  async findRemakePurchasesByUserId(user_id: number): Promise<object[]> {
    return await this.orderRepository
      .createQueryBuilder('orders')
      .leftJoin('payments', 'payments', 'orders.payments_id = payments.id')
      .leftJoin('order_items', 'items', 'orders.id = items.order_id')
      .leftJoin('remake_product', 'product', 'items.product_id = product.id')
      .leftJoin(
        'product_image',
        'product_image',
        'product.product_image_id = product_image.id',
      )
      .select([
        'orders.id AS order_id',
        'orders.created_at AS order_created_at',
        'orders.payments_id AS payments_id',
        'payments.method AS payments_method',
        'payments.status AS payments_status',
        'items.product_id AS product_id',
        'items.quantity AS product_quantity',
        'items.price AS product_price',
        'product.name AS product_name',
        'product_image.url AS product_image',
      ])
      .where('orders.user_id = :user_id AND items.category = "reborn"', {
        user_id,
      })
      .orderBy({ 'orders.created_at': 'DESC' })
      .getRawMany();
  }
}
