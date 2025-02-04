import { registerAs } from '@nestjs/config'

export interface ServiceConfig {
  port: number
}

export const serviceConfig = registerAs(
  'service',
  (): ServiceConfig => ({
    port: process.env.PORT != null ? (Number.parseInt(process.env.PORT ?? '', 10) ?? 3000) : 3000,
  })
)
