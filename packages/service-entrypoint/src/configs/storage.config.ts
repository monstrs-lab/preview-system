import type { S3ClientConfig } from '@aws-sdk/client-s3'
import type { StorageOptions } from '@google-cloud/storage'

import { registerAs }          from '@nestjs/config'

export interface StorageConfig {
  type: 'google' | 's3'
  bucket: string
  client: S3ClientConfig | StorageOptions
}

export const storageConfig = registerAs('storage', (): StorageConfig => {
  if (process.env.PREVIEW_SYSTEM_STORAGE_TYPE === 's3') {
    if (process.env.PREVIEW_SYSTEM_STORAGE_BUCKET === undefined) {
      throw new Error('PREVIEW_SYSTEM_STORAGE_BUCKET is required')
    }

    if (process.env.PREVIEW_SYSTEM_STORAGE_ACCESS_KEY_ID === undefined) {
      throw new Error('PREVIEW_SYSTEM_STORAGE_ACCESS_KEY_ID is required')
    }

    if (process.env.PREVIEW_SYSTEM_STORAGE_SECRET_ACCESS_KEY === undefined) {
      throw new Error('PREVIEW_SYSTEM_STORAGE_SECRET_ACCESS_KEY is required')
    }

    return {
      type: 's3',
      bucket: process.env.PREVIEW_SYSTEM_STORAGE_BUCKET,
      client: {
        endpoint: process.env.PREVIEW_SYSTEM_STORAGE_ENDPOINT,
        region: process.env.PREVIEW_SYSTEM_STORAGE_REGION,
        credentials: {
          accessKeyId: process.env.PREVIEW_SYSTEM_STORAGE_ACCESS_KEY_ID,
          secretAccessKey: process.env.PREVIEW_SYSTEM_STORAGE_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true,
      },
    }
  }

  if (process.env.PREVIEW_SYSTEM_STORAGE_TYPE === 'google') {
    if (process.env.PREVIEW_SYSTEM_STORAGE_BUCKET === undefined) {
      throw new Error('PREVIEW_SYSTEM_STORAGE_BUCKET is required')
    }

    if (process.env.PREVIEW_SYSTEM_STORAGE_PROJECT_ID === undefined) {
      throw new Error('PREVIEW_SYSTEM_STORAGE_PROJECT_ID is required')
    }

    if (process.env.PREVIEW_SYSTEM_STORAGE_KEY_FILE === undefined) {
      throw new Error('PREVIEW_SYSTEM_STORAGE_KEY_FILE is required')
    }

    return {
      type: 'google',
      bucket: process.env.PREVIEW_SYSTEM_STORAGE_BUCKET,
      client: {
        projectId: process.env.PREVIEW_SYSTEM_STORAGE_PROJECT_ID,
        keyFile: process.env.PREVIEW_SYSTEM_STORAGE_KEY_FILE,
      },
    }
  }

  throw new Error('Unknown storage type')
})
