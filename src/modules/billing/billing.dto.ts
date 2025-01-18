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
2024.11.28  이유민      Modified    category 추가
2024.12.17  이유민      Modified    product_id 타입 수정
2025.01.17  이유민      Modified    코드 리팩토링
2025.01.18  이유민      Modified    name 및 phone 추가
2025.01.18  이유민      Modified    tracking_number 및 status 추가
*/
import { IsInt, IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsString()
  category: string;
}

export class ItemUpdateDTO {
  @ApiProperty()
  @IsInt()
  status: string;

  @ApiProperty()
  @IsString()
  tracking_number: string;
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
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsArray()
  order_items: OrderItemDTO[];
}
