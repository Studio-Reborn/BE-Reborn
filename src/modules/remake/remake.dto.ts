/**
File Name : remake.dto
Description : 리본 리메이크 Dto
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 요청 기능 추가
2024.11.07  이유민      Modified    제품 요청 DTO 수정
2024.11.18  이유민      Modified    리본 리메이크 제품 DTO 추가
*/
import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemakeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  remake_product: string;
}

export class RemakeProductDTO {
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
  @IsString()
  matter: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  price: number;
}
