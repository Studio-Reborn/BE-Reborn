import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { RemakeModule } from 'src/modules/remake/remake.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ProductModule } from 'src/modules/product/product.module';
import { UsersModule } from 'src/modules/users/users.module';
import { UploadModule } from 'src/modules/upload/upload.module';
import { ProfileModule } from 'src/modules/profile_image/profile_image.module';
import { ProductImageModule } from 'src/modules/product_image/product_image.module';
import { MarketModule } from 'src/modules/market/market.module';
import { BillingModule } from 'src/modules/billing/billing.module';
import { ChatModule } from 'src/modules/chat/chat.module';
import { LikeModule } from 'src/modules/like/like.module';
import { ReviewModule } from 'src/modules/review/review.module';
import { LevelModule } from 'src/modules/level/level.module';
import { CartModule } from 'src/modules/cart/cart.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // 정적 파일의 URL 경로를 /uploads로 설정
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.naver.com',
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: `'Reborn' <${process.env.EMAIL_ADDRESS}>`, //보낸사람
        },
      }),
    }),
    RemakeModule,
    AuthModule,
    ProductModule,
    UsersModule,
    UploadModule,
    ProfileModule,
    ProductImageModule,
    MarketModule,
    BillingModule,
    ChatModule,
    LikeModule,
    ReviewModule,
    LevelModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
