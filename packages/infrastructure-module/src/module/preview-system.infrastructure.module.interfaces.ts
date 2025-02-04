import type { S3Client }       from '@aws-sdk/client-s3'
import type { Storage }        from '@google-cloud/storage'
import type { ModuleMetadata } from '@nestjs/common'
import type { Type }           from '@nestjs/common'

export interface PreviewSystemInfrastructureModuleOptions {
  access: {
    urls: Array<string>
  }
  storage: {
    client: S3Client | Storage
    bucket: string
  }
}

export interface PreviewSystemInfrastructureOptionsFactory {
  createPreviewSystemOptions: () =>
    | PreviewSystemInfrastructureModuleOptions
    | Promise<PreviewSystemInfrastructureModuleOptions>
}

export interface PreviewSystemInfrastructureModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  useExisting?: Type<PreviewSystemInfrastructureModuleOptions>
  useClass?: Type<PreviewSystemInfrastructureModuleOptions>
  useFactory?: (
    ...args: Array<any>
  ) => PreviewSystemInfrastructureModuleOptions | Promise<PreviewSystemInfrastructureModuleOptions>
  inject?: Array<any> // eslint-disable-line
}
