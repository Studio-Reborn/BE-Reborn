/**
File Name : billing.dto
Description : 결제 및 주문 관련 Dto
Author : 이유민

History
Date        Author      Status      Description
2024.11.24  이유민      Created     
2024.11.24  이유민      Modified    결제 추가
2024.11.24  이유민      Modified    주문 추가
2024.11.26  이유민      Modified    주문 제품 추가
*/
import { IsInt, IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  product_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  price: number;
}

export class TossPaymentDTO {
  // 토스페이먼츠 관련
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  paymentKey: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  amount: number;

  // order 관련
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  postcode: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  detail_address: string;

  @ApiProperty()
  @IsString()
  extra_address: string;

  @ApiProperty()
  @IsArray()
  order_items: OrderItemDTO[];
}
