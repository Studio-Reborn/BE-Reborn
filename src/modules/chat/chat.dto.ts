/**
File Name : chat.dto
Description : 채팅 dto
Author : 이유민

History
Date        Author      Status      Description
2024.12.06  이유민      Created     
2024.12.06  이유민      Modified    채팅 추가
*/
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  product_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  seller_id: number;
}
