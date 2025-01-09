import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { AppModule } from './app.module'
import { ValidationPipe } from './pipes'

async function bootstrap() {
  const port = process.env.PORT ?? 3000
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(ValidationPipe)
  app.enableCors()
  await app.listen(port, () => {
    Logger.log(`🚀 Server is running on port: ${port}`)
  })
}
bootstrap()
