/**
File Name : chat.repository
Description : 채팅 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.12.06  이유민      Created     
2024.12.06  이유민      Modified    채팅 추가
2024.12.09  이유민      Modified    내 채팅 전체 조회 추가
2024.12.17  이유민      Modified    product_id 타입 수정
2025.01.31  이유민      Modified    이미지 url 관련 오류 수정
*/
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/modules/chat/entity/chat.entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  // 채팅방 생성
  async createChat(chatData: Partial<Chat>): Promise<Chat> {
    return await this.chatRepository.save(chatData);
  }

  // 내 채팅 전체 조회
  async findMyChatAll(user_id: number): Promise<Chat[]> {
    const chats = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin('users', 'seller', 'chat.seller_id = seller.id')
      .leftJoin('users', 'buyer', 'chat.buyer_id = buyer.id')
      .leftJoin('user_product', 'product', 'chat.product_id = product.id')
      .leftJoin(
        'product_image',
        'product_image',
        'product.product_image_id = product_image.id',
      )
      .select([
        'chat.id AS chat_id',
        'chat.seller_id AS seller_id',
        'seller.nickname AS seller_nickname',
        'chat.buyer_id AS buyer_id',
        'buyer.nickname AS buyer_nickname',
        'product.id AS product_id',
        'product.name AS product_name',
        'product.price AS product_price',
        'product_image.url AS product_image',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('msg.created_at')
          .from('messages', 'msg')
          .where('msg.chat_id = chat.id')
          .orderBy('msg.created_at', 'DESC')
          .limit(1);
      }, 'latest_created_at')
      .where(
        `(chat.seller_id = :user_id AND (
      chat.seller_deleted_at IS NULL 
      OR EXISTS (
        SELECT 1 
        FROM messages msg 
        WHERE msg.chat_id = chat.id 
          AND msg.created_at > chat.seller_deleted_at
      )
    ))
    OR (chat.buyer_id = :user_id AND (
      chat.buyer_deleted_at IS NULL 
      OR EXISTS (
        SELECT 1 
        FROM messages msg 
        WHERE msg.chat_id = chat.id 
          AND msg.created_at > chat.buyer_deleted_at
      )
    ))`,
        {
          user_id,
        },
      )
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('msg.id')
          .from('messages', 'msg')
          .where('msg.chat_id = chat.id')
          .limit(1);
        return `EXISTS (${subQuery.getQuery()})`;
      })
      .orderBy('latest_created_at', 'DESC')
      .getRawMany();

    chats.forEach((chat) => {
      if (chat.product_image) {
        chat.product_image = JSON.parse(chat.product_image);
      }
    });

    return chats;
  }

  // chat id로 채팅방 검색
  async findChatById(id: string, user_id: number): Promise<any> {
    const chatInfo = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin('users', 'seller', 'chat.seller_id = seller.id')
      .leftJoin('users', 'buyer', 'chat.buyer_id = buyer.id')
      .leftJoin('user_product', 'product', 'chat.product_id = product.id')
      .select([
        'chat.id AS chat_id',
        'chat.seller_id AS seller_id',
        'seller.nickname AS seller_nickname',
        'chat.buyer_id AS buyer_id',
        'buyer.nickname AS buyer_nickname',
        'product.id AS product_id',
        'product.name AS product_name',
        'product.price AS product_price',
        'product.status AS product_status',
      ])
      .where('chat.id = :id', { id })
      .getRawOne();

    const messages = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin('messages', 'messages', 'chat.id = messages.chat_id')
      .select([
        'messages.sender_id AS messages_sender_id',
        'messages.content AS messages_content',
        'messages.created_at AS messages_created_at',
      ])
      .where('chat.id = :id', { id })
      .andWhere(
        `
        (
          (:seller_id = :user_id AND chat.seller_deleted_at IS NULL)
          OR (:buyer_id = :buyer_id AND chat.buyer_deleted_at IS NULL)
          OR (:seller_id = :user_id AND chat.seller_deleted_at IS NOT NULL AND messages.created_at > chat.seller_deleted_at)
          OR (:buyer_id = :user_id AND chat.buyer_deleted_at IS NOT NULL AND messages.created_at > chat.buyer_deleted_at)
        )
        `,
        { seller_id: chatInfo.seller_id, user_id, buyer_id: chatInfo.buyer_id },
      )
      .orderBy('messages.created_at', 'ASC')
      .getRawMany();

    return { chat: chatInfo, messages };
  }

  // seller_id & buyer_id로 채팅방 검색
  async findChatByChatInfo(
    product_id: string,
    seller_id: number,
    buyer_id: number,
  ): Promise<Chat> {
    return await this.chatRepository
      .createQueryBuilder('chat')
      .where(
        'product_id = :product_id AND seller_id = :seller_id AND buyer_id = :buyer_id',
        { product_id, seller_id, buyer_id },
      )
      .getOne();
  }

  // id로 채팅창 제품 삭제
  async deleteChatById(id: string, user_id: number): Promise<object> {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .where('chat.id = :id', { id })
      .getOne();

    if (!chat) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    if (chat.seller_id !== user_id && chat.buyer_id !== user_id)
      throw new UnauthorizedException('접근할 수 없습니다.');

    if (chat.seller_id === user_id) chat.seller_deleted_at = new Date();
    else chat.buyer_deleted_at = new Date();

    await this.chatRepository.save(chat);

    return { message: '채팅방이 성공적으로 삭제되었습니다.' };
  }
}
