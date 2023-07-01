import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Post } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get('/test')
  async getTest(): Promise<unknown> {
    const test = await this.cacheManager.get('test');

    console.log('test', test);

    return test;
  }

  @Post('/test')
  async postTest(): Promise<void> {
    console.log('test');
    await this.cacheManager.set('test', 'pocketsand');
  }
}
