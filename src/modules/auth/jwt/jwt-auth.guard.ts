/**
File Name : jwt-auth.guard
Description : JWT 가드
Author : 이유민

History
Date        Author      Status      Description
2024.11.12  이유민      Created     
2024.11.12  이유민      Modified    jwt 추가
*/
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
