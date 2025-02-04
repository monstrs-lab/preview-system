import { PutObjectCommand }                             from '@aws-sdk/client-s3'
import { S3Client }                                     from '@aws-sdk/client-s3'
import { Storage }                                      from '@google-cloud/storage'
import { Inject }                                       from '@nestjs/common'

import { FilesystemPort }                               from '@preview-system/application-module'

import { PREVIEW_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS } from '../module/index.js'
import { PreviewSystemInfrastructureModuleOptions }     from '../module/index.js'

export class FilesystemPortImpl extends FilesystemPort {
  constructor(
    @Inject(PREVIEW_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS)
    private readonly options: PreviewSystemInfrastructureModuleOptions
  ) {
    super()
  }

  async save(path: string, data: Buffer): Promise<string> {
    if (this.options.storage.client instanceof S3Client) {
      await this.options.storage.client.send(
        new PutObjectCommand({
          Bucket: this.options.storage.bucket,
          Key: path,
          Body: data,
          ACL: 'public-read',
        })
      )

      // eslint-disable-next-line
      const endpoint = await this.options.storage.client.config.endpoint?.()!

      return `${endpoint.protocol}//${endpoint.hostname}${endpoint.port ? `:${endpoint.port}` : ''}/${this.options.storage.bucket}/${path}`
    }

    if (this.options.storage.client instanceof Storage) {
      const bucket = this.options.storage.client.bucket(this.options.storage.bucket)
      await bucket.file(path).save(data, { public: true })

      return bucket.file(path).publicUrl()
    }

    throw new Error('Unknown storage')
  }
}
