/**
File Name : chat.controller
Description : 채팅 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.12.06  이유민      Created     
2024.12.06  이유민      Modified    채팅 추가
2025.02.13  이유민      Modified    swagger 설명 수정
*/
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { ChatDTO } from 'src/modules/chat/chat.dto';
import { ChatService } from 'src/modules/chat/chat.service';

@Controller('chat')
@ApiTags('채팅 API')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 채팅방 생성
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '채팅방 생성 API',
    description: '채팅방을 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async createChat(@Req() req, @Body() chatDTO: ChatDTO) {
    const { product_id, seller_id } = chatDTO;
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 사용 가능합니다.');

    const chat = await this.chatService.findChatByChatInfo(
      product_id,
      seller_id,
      req.user.user_id,
    );

    if (chat) {
      return chat;
    }

    return await this.chatService.createChat({
      product_id,
      seller_id,
      buyer_id: req.user.user_id,
    });
  }

  // 내 채팅 전체 조회
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '내 채팅방 전체 조회 API',
    description: '사용자 본인의 채팅방을 전체 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findMyChatAll(@Req() req) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 사용 가능합니다.');

    return await this.chatService.findMyChatAll(req.user.user_id);
  }

  // id로 채팅방 검색
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '개별 채팅방의 대화 내용 조회 API',
    description: '채팅방 ID를 이용해 채팅방과 대화 내용 등을 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findChatById(@Req() req, @Param('id') id: string) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 사용 가능합니다.');

    return await this.chatService.findChatById(id, req.user.user_id);
  }

  // 채팅창 삭제
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '채팅창 삭제 API',
    description: '채팅창을 삭제한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async deletChatById(@Req() req, @Param('id') id: string) {
    return await this.chatService.deleteChatById(id, req.user.user_id);
  }
}
