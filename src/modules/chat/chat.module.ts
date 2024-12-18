/**
File Name : chat.module
Description : 채팅 Module
Author : 이유민

History
Date        Author      Status      Description
2024.12.05  이유민      Created     
2024.12.05  이유민      Modified    채팅 기능 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from 'src/modules/chat/chat.gateway';
import { Chat } from 'src/modules/chat/entity/chat.entity';
import { ChatRepository } from 'src/modules/chat/repository/chat.repository';
import { Message } from 'src/modules/chat/entity/message.entity';
import { MessageRepository } from 'src/modules/chat/repository/message.repository';
import { ChatService } from 'src/modules/chat/chat.service';
import { ChatController } from 'src/modules/chat/chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message])],
  providers: [ChatGateway, ChatRepository, MessageRepository, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
