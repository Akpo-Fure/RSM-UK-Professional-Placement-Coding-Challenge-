import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('You can only clean the database in a test environment')
    }

    if (process.env.DATABASE_URL !== process.env.TEST_DB) {
      throw new Error('You can only clean the test database')
    }

    await this.$transaction([
      this.season.deleteMany(),
      this.tvShowStreamingService.deleteMany(),
      this.tVShow.deleteMany(),
      this.film.deleteMany(),
      this.streamingService.deleteMany(),
    ])
  }
}
