/**
File Name : cart.dto
Description : 장바구니 Dto
Author : 이유민

History
Date        Author      Status      Description
2025.01.11  이유민      Created     
2025.01.11  이유민      Modified    장바구니 추가
*/
import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  product_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
