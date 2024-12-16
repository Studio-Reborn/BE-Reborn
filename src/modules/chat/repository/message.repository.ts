/**
File Name : message.repository
Description : 채팅 메시지 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.12.06  이유민      Created     
2024.12.06  이유민      Modified    채팅 메시지 추가
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/modules/chat/entity/message.entity';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  // 채팅 메시지 생성
  async createMessage(messageData: Partial<Message>): Promise<Message> {
    return await this.messageRepository.save(messageData);
  }
}
