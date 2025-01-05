import * as request from 'supertest'
import TestAgent from 'supertest/lib/agent'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { Test } from '@nestjs/testing'
import { Test as SuperTest } from 'supertest'
import { AppModule } from '../src/app.module'
import { ValidationPipe } from '../src/pipes'
import { PrismaService } from '../src/modules/shared/prisma.service'

const setupTestModule = async (): Promise<{
  prisma: PrismaClient
  app: TestAgent<SuperTest>
}> => {
  execSync('yarn db:test:migrate', {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DB },
  })

  process.env.DATABASE_URL = process.env.TEST_DB

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const app = moduleRef.createNestApplication()
  const prismaService = moduleRef.get(PrismaService)
  app.useGlobalPipes(ValidationPipe)
  await app.init()
  await prismaService.cleanDatabase()

  return { prisma: prismaService, app: request(app.getHttpServer()) }
}

const teardownTestModule = async (prisma: PrismaClient) => {
  await prisma.$disconnect()
}

export { setupTestModule, teardownTestModule }
