/**
File Name : like.dto
Description : 좋아요 Dto
Author : 이유민

History
Date        Author      Status      Description
2024.12.16  이유민      Created     
2024.12.16  이유민      Modified    상품 좋아요 추가
2024.12.17  이유민      Modified    product_id 타입 수정
2024.12.17  이유민      Modified    마켓 좋아요 추가
*/
import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductLikeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  product_id: string;
}

export class MarketLikeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  market_id: number;
}
