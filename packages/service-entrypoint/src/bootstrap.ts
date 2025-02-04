import type { NestFastifyApplication }   from '@nestjs/platform-fastify'

import { ConfigService }                 from '@nestjs/config'
import { NestFactory }                   from '@nestjs/core'
import { FastifyAdapter }                from '@nestjs/platform-fastify'

import { PreviewSystemEntrypointModule } from './module/index.js'

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestFastifyApplication>(
    PreviewSystemEntrypointModule,
    new FastifyAdapter()
  )

  app.enableShutdownHooks()

  await app.listen(app.get(ConfigService).get<number>('service.port') ?? 3000, '0.0.0.0')
}

bootstrap()
