import { Global, Module } from '@nestjs/common';
import { InMemoryDB } from './in-memory.db';

@Global()
@Module({
  providers: [InMemoryDB],
  exports: [InMemoryDB],
})
export class DatabaseModule {}
