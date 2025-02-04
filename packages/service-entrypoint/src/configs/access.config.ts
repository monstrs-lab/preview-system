import { registerAs } from '@nestjs/config'

export interface AccessConfig {
  urls: Array<string>
}

export const accessConfig = registerAs(
  'access',
  (): AccessConfig => ({
    urls: process.env.PREVIEW_SYSTEM_ACCESS_URLS
      ? process.env.PREVIEW_SYSTEM_ACCESS_URLS.split(',')
      : [],
  })
)
