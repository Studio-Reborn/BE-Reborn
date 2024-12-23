/**
File Name : review.dto
Description : 리뷰 Dto
Author : 이유민

History
Date        Author      Status      Description
2024.12.19  이유민      Created     
2024.12.19  이유민      Modified    리뷰 추가
*/
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
