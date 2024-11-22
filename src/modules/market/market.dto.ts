/**
File Name : market.dto
Description : 에코마켓 Dto
Author : 이유민

History
Date        Author      Status      Description
2024.11.21  이유민      Created     
2024.11.21  이유민      Modified    에코마켓 추가
*/
import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarketDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  profile_image_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  market_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  market_detail: string;
}
