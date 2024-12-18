/**
File Name : billing.module
Description : 결제 및 주문 관련 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.24  이유민      Created     
2024.11.24  이유민      Modified    결제 추가
2024.11.24  이유민      Modified    주문 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Order } from 'src/modules/billing/entity/orders.entity';
import { OrderItems } from 'src/modules/billing/entity/order_items.entity';
import { Payment } from 'src/modules/billing/entity/payments.entity';
import { PaymentRepository } from 'src/modules/billing/repository/payments.repository';
import { OrderItemsRepository } from 'src/modules/billing/repository/order_items.repository';
import { OrderRepository } from 'src/modules/billing/repository/orders.repository';
import { BillingController } from 'src/modules/billing/billing.controller';
import { BillingService } from 'src/modules/billing/billing.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Order, Payment, OrderItems])],
  providers: [
    PaymentRepository,
    OrderRepository,
    OrderItemsRepository,
    BillingService,
  ],
  controllers: [BillingController],
})
export class BillingModule {}
