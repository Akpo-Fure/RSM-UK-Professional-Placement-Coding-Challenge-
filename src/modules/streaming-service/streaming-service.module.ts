import { Global, Module } from '@nestjs/common'
import { StreamingServiceService } from './streaming-service.service'
import { StreamingServiceController } from './streaming-service.controller'

@Global()
@Module({
  providers: [StreamingServiceService],
  controllers: [StreamingServiceController],
  exports: [StreamingServiceService],
})
export class StreamingServiceModule {}
