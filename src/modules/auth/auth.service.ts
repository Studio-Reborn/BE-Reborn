/**
File Name : auth.service
Description : 회원가입 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    회원 기능 추가
2024.11.12  이유민      Modified    jwt 추가
2024.11.13  이유민      Modified    토큰 검증 추가
2024.11.13  이유민      Modified    비밀번호 변경 추가
2024.12.04  이유민      Modified    role 추가
2025.01.19  이유민      Modified    아이디 찾기 및 비밀번호 찾기 추가
*/
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from 'src/modules/auth/auth.repository';
import { Auth } from 'src/modules/auth/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { v1 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async createAuth(authData: Partial<Auth>): Promise<number> {
    return this.authRepository.createAuth(authData);
  }

  async login(
    user_id: number,
    email: string,
    auth_id: number,
    res: Response,
    role: string,
  ): Promise<object> {
    const payload = { user_id, email, role };

    // refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });

    await this.authRepository.updateRefreshToken(auth_id, refreshToken);

    // access token
    const accessToken = this.jwtService.sign(payload);

    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600;`,
    );

    return { Authorization: `${accessToken}` };
  }

  async verifyToken(accessToken: string): Promise<object> {
    try {
      const verified = this.jwtService.verify(accessToken);

      return verified;
    } catch {
      throw new UnauthorizedException('인증되지 않은 토큰입니다.');
    }
  }

  async findPasswordById(id: number): Promise<Auth | undefined> {
    return this.authRepository.findPasswordById(id);
  }

  async updatePassword(
    id: number,
    hashedChangePassword: string,
  ): Promise<object> {
    return this.authRepository.updatePassword(id, hashedChangePassword);
  }

  // 아이디 찾기
  async findEmail(nickname: string, phone: string): Promise<Auth> {
    return await this.authRepository.findEmail(nickname, phone);
  }

  // 비밀번호 찾기
  async findPassword(
    email: string,
    nickname: string,
    phone: string,
  ): Promise<object> {
    const user = await this.authRepository.findEmail(nickname, phone);

    if (user['user_email'] !== email)
      throw new NotFoundException('사용자를 찾을 수 없습니다.');

    // 새 비밀번호 생성
    const newPassword = uuid();

    // 비밀번호 변경
    this.authRepository.updatePassword(
      user['user_id'],
      bcrypt.hashSync(newPassword, 10),
    );

    // 메일 전송
    const html = fs
      .readFileSync('src/templates/send-email.html', 'utf8')
      .replace('{{newPassword}}', newPassword);

    await this.mailerService.sendMail({
      to: email,
      subject: '[Reborn] 새로운 비밀번호가 발급되었습니다.',
      html,
    });

    return { message: '비밀번호가 변경되었습니다.' };
  }
}
