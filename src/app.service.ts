import { Injectable } from '@nestjs/common';
import { Response } from './utils/response';

@Injectable()
export class AppService {
  getHello(): Response<string> {
    return new Response({ data: 'Hi 👋🏽 Autochek' });
  }
}
