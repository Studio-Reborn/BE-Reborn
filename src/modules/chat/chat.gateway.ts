/**
File Name : chat.gateway
Description : 채팅(socket) Gateway
Author : 이유민

History
Date        Author      Status      Description
2024.12.05  이유민      Created     
2024.12.05  이유민      Modified    채팅 기능 추가
*/
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/modules/chat/chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(private readonly chatService: ChatService) {}

  // 서버 초기화 시 호출
  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  // 클라이언트 연결 시 호출
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // 클라이언트 연결 종료 시 호출
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // this.server.emit('message', {
    //   user: 'Server',
    //   message: `User ${client.id} has left`,
    // });
  }

  // 클라이언트에서 특정 이벤트 발생 시 처리
  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { chat_id: string; sender_id: number; content: string },
  ): Promise<void> {
    try {
      const newMessage = await this.chatService.createMessage({
        chat_id: payload.chat_id,
        sender_id: payload.sender_id,
        content: payload.content,
      });

      this.logger.log(
        `Message received from ${payload.sender_id}: ${payload.content}`,
      );

      // 해당 채팅방에 새 메시지 전달
      this.server.emit(`${payload.chat_id}`, newMessage);

      // 새 메시지 알림 이벤트
      this.server.emit('new_chat_message', {
        chat_id: payload.chat_id,
        content: payload.content,
        sender_id: payload.sender_id,
      });
    } catch (error) {
      this.logger.error(`Error saving message: ${error.message}`);
    }
  }
}
