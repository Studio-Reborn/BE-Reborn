/**
File Name : google-drive.service
Description : 구글 드라이브 파일 업로드 Service
Author : 이유민

History
Date        Author      Status      Description
2025.01.27  이유민      Created     
2025.01.27  이유민      Modified    구글 드라이브 연동 추가
2025.01.31  이유민      Modified    코드 리팩토링
*/
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class GoogleDriveService {
  private driveClient;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(
        Buffer.from(
          process.env.GOOGLE_CREDENTIALS.replace(/\\n/g, ''),
          'base64',
        ).toString('utf8'),
      ),
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.driveClient = google.drive({ version: 'v3', auth });
  }

  async uploadFile(
    filePath: string,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    const fileMetadata = {
      name: fileName, // Google Drive에 저장될 파일 이름
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // 업로드할 폴더 ID (루트에 저장하려면 생략 가능)
    };

    const media = {
      mimeType,
      body: fs.createReadStream(filePath),
    };

    try {
      const response = await this.driveClient.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id', // 업로드한 파일 ID만 반환
      });

      const fileId = response.data.id;

      // 파일을 누구나 볼 수 있도록 권한 설정
      await this.driveClient.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return `https://drive.google.com/uc?id=${response.data.id}`;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('구글 드라이브 파일 업로드 실패');
    }
  }
}
