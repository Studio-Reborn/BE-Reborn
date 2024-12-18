/**
File Name : chat.dto
Description : 채팅 dto
Author : 이유민

History
Date        Author      Status      Description
2024.12.06  이유민      Created     
2024.12.06  이유민      Modified    채팅 추가
2024.12.17  이유민      Modified    product_id 타입 수정
*/
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  seller_id: number;
}
