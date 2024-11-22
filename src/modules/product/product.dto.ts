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
*/
import { IsInt, IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['user', 'market'])
  theme: string;

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
  product_image_id: number;

  @ApiProperty()
  @IsInt()
  market_id: number;
}
