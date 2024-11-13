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
*/
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from 'src/modules/auth/auth.repository';
import { Auth } from 'src/modules/auth/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async createAuth(authData: Partial<Auth>): Promise<number> {
    return this.authRepository.createAuth(authData);
  }

  async login(
    user_id: number,
    email: string,
    auth_id: number,
    res: Response,
  ): Promise<object> {
    const payload = { user_id, email };

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
}
