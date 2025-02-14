/**
File Name : billing.service
Description : 결제 및 주문 관련 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.24  이유민      Created     
2024.11.24  이유민      Modified    결제 추가
2024.11.24  이유민      Modified    주문 추가
2024.11.27  이유민      Modified    userId로 구매내역 조회 추가
2024.11.28  이유민      Modified    order_items category 추가
2025.01.17  이유민      Modified    코드 리팩토링
2025.01.18  이유민      Modified    내 마켓 관련 API 추가
2025.01.18  이유민      Modified    리본 리메이크 판매 내역 추가
*/
import { Injectable } from '@nestjs/common';
import { PaymentRepository } from 'src/modules/billing/repository/payments.repository';
import { OrderRepository } from 'src/modules/billing/repository/orders.repository';
import { OrderItemsRepository } from 'src/modules/billing/repository/order_items.repository';
import { TossPaymentDTO } from 'src/modules/billing/billing.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { OrderItems } from 'src/modules/billing/entity/order_items.entity';

@Injectable()
export class BillingService {
  private readonly tossServer: string;
  private readonly tossSecretKey: string;

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.tossServer = this.configService.get<string>('TOSS_API_URL');
    this.tossSecretKey = this.configService.get<string>('TOSS_SECRET_KEY');
  }

  // 결제
  async TossPayment(
    user_id: number,
    tossPaymentDTO: TossPaymentDTO,
  ): Promise<object> {
    const {
      orderId,
      amount,
      paymentKey,
      postcode,
      address,
      detail_address,
      extra_address,
      order_items,
      name,
      phone,
    } = tossPaymentDTO;

    // 결제
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.tossServer}/confirm`,
        {
          paymentKey,
          orderId,
          amount,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.tossSecretKey}:`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    // 주문 데이터 생성
    await this.orderRepository.createOrder({
      id: orderId,
      user_id,
      postcode,
      address,
      detail_address,
      extra_address,
      payments_id: response.data.paymentKey,
      name,
      phone,
    });

    // 주문 제품 데이터 생성
    const orderItemsData = order_items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      total_price: item.price * item.quantity,
      category: item.category,
    }));

    await this.orderItemsRepository.createOrderItems(orderItemsData);

    // 결제 데이터 생성
    await this.paymentRepository.createPayment({
      id: response.data.paymentKey,
      user_id,
      amount: response.data.totalAmount,
      method: response.data.method,
      status: response.data.status,
    });

    return { message: '결제 성공' };
  }

  // 결제 취소(환불)
  async tossPaymentsCancel(
    user_id: number,
    paymentKey: string,
    cancelReason: string,
  ): Promise<object> {
    try {
      // 결제 취소
      await firstValueFrom(
        this.httpService.post(
          `${this.tossServer}/${paymentKey}/cancel`,
          { cancelReason },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${this.tossSecretKey}:`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      // 결제 테이블 수정
      await this.paymentRepository.cancelPayment(user_id, paymentKey);

      return { message: '결제가 성공적으로 취소되었습니다.' };
    } catch (err) {
      console.error(err);
    }
  }

  // user_id로 조회
  async findBillingByUserId(user_id: number): Promise<object[]> {
    return await this.orderRepository.findOrderByUserId(user_id);
  }

  async findRemakeItem(): Promise<OrderItems[]> {
    return await this.orderItemsRepository.findRemakeItem();
  }

  // 에코마켓 구매내역 조회
  async findMarketPurchasesByUserId(user_id: number): Promise<object[]> {
    return await this.orderRepository.findMarketPurchasesByUserId(user_id);
  }

  // 리본 리메이크 구매내역 조회
  async findRemakePurchasesByUserId(user_id: number): Promise<object[]> {
    return await this.orderRepository.findRemakePurchasesByUserId(user_id);
  }

  // items 수정
  async updateItemById(
    id: number,
    updateData: Partial<OrderItems>,
  ): Promise<object> {
    return await this.orderItemsRepository.updateItemById(id, updateData);
  }
}
