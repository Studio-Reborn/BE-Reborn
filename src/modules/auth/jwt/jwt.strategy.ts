/**
File Name : jwt.strategy
Description : JWT 전략
Author : 이유민

History
Date        Author      Status      Description
2024.11.12  이유민      Created     
2024.11.12  이유민      Modified    jwt 추가
*/
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    return { user_id: payload.user_id, email: payload.email };
  }
}
