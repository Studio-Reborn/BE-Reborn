/**
File Name : payments.repository
Description : 결제 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.24  이유민      Created     
2024.11.24  이유민      Modified    결제 추가
*/
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/modules/billing/entity/payments.entity';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  // 결제 생성
  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = this.paymentRepository.create(paymentData);
    return await this.paymentRepository.save(payment);
  }

  // id로 결제 조회
  async findPaymentById(user_id: number, id: string): Promise<Payment> {
    const payment = await this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.id = :id AND payment.deleted_at IS NULL', { id })
      .getOne();

    if (!payment) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    if (payment.user_id !== user_id)
      throw new UnauthorizedException('접근할 수 없습니다.');

    return payment;
  }

  // 결제 취소
  async cancelPayment(user_id: number, id: string): Promise<object> {
    const payment = await this.findPaymentById(user_id, id);

    Object.assign(payment, { status: 'CANCELED' });
    await this.paymentRepository.save(payment);

    return { message: '결제가 성공적으로 취소되었습니다.' };
  }
}
