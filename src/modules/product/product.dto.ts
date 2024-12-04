/**
File Name : product.dto
Description : 상품 Dto
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    상품 등록 기능 추가
2024.11.08  이유민      Modified    리본 리메이크 제품 분리
2024.11.20  이유민      Modified    상품 이미지 추가
2024.11.21  이유민      Modified    market_id 추가
2024.11.26  이유민      Modified    상품 테이블 분리
2024.12.04  이유민      Modified    status 추가
*/
import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserProductDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  product_image_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  detail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsString()
  status: string;
}

export class MarketProductDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  product_image_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  detail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsString()
  status: string;
}
