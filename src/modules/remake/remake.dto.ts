/**
File Name : remake.dto
Description : 리본 리메이크 Dto
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 요청 기능 추가
2024.11.07  이유민      Modified    제품 요청 DTO 수정
*/
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemakeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  remake_product: string;
}
