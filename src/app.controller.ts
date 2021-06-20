import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from './utils/response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Response<string> {
    return this.appService.getHello();
  }
}
