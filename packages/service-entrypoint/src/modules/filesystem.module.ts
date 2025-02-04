import { PreviewSystemModuleConfig } from '../configs/index.js'

import { Filesystem }                     from '@deepkit/filesystem'
import { FilesystemAwsS3Adapter }         from '@deepkit/filesystem-aws-s3'
import { createModule }                   from '@deepkit/app'

export class FilesystemModule extends createModule({
  providers: [
    {
      provide: Filesystem,
      useFactory: (config: PreviewSystemModuleConfig): Filesystem =>
        new Filesystem(new FilesystemAwsS3Adapter(config.filesystem)),
    },
  ],
}) {
  override root: boolean = true
}
