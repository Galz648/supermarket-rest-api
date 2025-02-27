import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      message: 'Israeli Supermarket Data Query API',
      version: '0.1.0',
      status: 'operational'
    };
  }
} 
