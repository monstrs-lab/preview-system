import type { Filesystem }        from '@deepkit/filesystem'
import type { FilesystemPort }    from '@preview-system/application-module'

import { join }                   from 'node:path'

import { FilesystemLocalAdapter } from '@deepkit/filesystem'
import { FilesystemAwsS3Adapter } from '@deepkit/filesystem-aws-s3'

export class FilesystemPortImpl implements FilesystemPort {
  constructor(private readonly filesystem: Filesystem) {}

  async save(path: string, data: Buffer): Promise<string> {
    await this.filesystem.write(path, data, 'public')

    if (this.filesystem.adapter instanceof FilesystemLocalAdapter) {
      // @ts-expect-error Get full path
      return join(this.filesystem.adapter.root, path)
    }

    if (this.filesystem.adapter instanceof FilesystemAwsS3Adapter) {
      const { options } = this.filesystem.adapter

      if (options.endpoint) {
        return `${options.endpoint}/${join(options.bucket, options.path || '', path)}`
      }
    }

    return this.filesystem.publicUrl(path)
  }
}
