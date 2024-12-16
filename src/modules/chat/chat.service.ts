/**
File Name : chat.service
Description : 채팅 Service
Author : 이유민

History
Date        Author      Status      Description
2024.12.06  이유민      Created     
2024.12.06  이유민      Modified    채팅 기능 추가
*/
import { Injectable } from '@nestjs/common';
import { Chat } from 'src/modules/chat/entity/chat.entity';
import { Message } from 'src/modules/chat/entity/message.entity';
import { ChatRepository } from 'src/modules/chat/repository/chat.repository';
import { MessageRepository } from 'src/modules/chat/repository/message.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepostiory: MessageRepository,
  ) {}

  // 채팅방 관련 생성
  async createChat(chatData: Partial<Chat>): Promise<Chat> {
    return this.chatRepository.createChat(chatData);
  }

  // 내 채팅 전체 조회
  async findMyChatAll(user_id: number): Promise<Chat[]> {
    return this.chatRepository.findMyChatAll(user_id);
  }

  // chat id로 채팅방 검색
  async findChatById(id: string, user_id: number): Promise<any> {
    return this.chatRepository.findChatById(id, user_id);
  }

  // seller_id & buyer_id로 채팅방 검색
  async findChatByChatInfo(
    product_id: number,
    seller_id: number,
    buyer_id: number,
  ): Promise<Chat> {
    return this.chatRepository.findChatByChatInfo(
      product_id,
      seller_id,
      buyer_id,
    );
  }

  // id로 채팅창 제품 삭제
  async deleteChatById(id: string, user_id: number): Promise<object> {
    return this.chatRepository.deleteChatById(id, user_id);
  }

  // 채팅 메시지 생성
  async createMessage(messageData: Partial<Message>): Promise<Message> {
    return this.messageRepostiory.createMessage(messageData);
  }
}
