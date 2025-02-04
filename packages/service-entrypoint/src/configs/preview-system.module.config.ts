/* eslint-disable max-classes-per-file */

import type { MinLength } from '@deepkit/type'

export class PreviewSystemAccessModuleConfig {
  urls!: MinLength<1> & string
}

export class PreviewSystemFilesystemModuleConfig {
  bucket!: string

  region!: string

  accessKeyId!: string

  secretAccessKey!: string

  endpoint?: string

  path?: string
}

export class PreviewSystemDatabaseModuleConfig {
  host!: string

  user!: string

  password!: string

  database!: string

  port: number = 5432
}

export class PreviewSystemModuleConfig {
  access!: PreviewSystemAccessModuleConfig

  filesystem!: PreviewSystemFilesystemModuleConfig

  database!: PreviewSystemDatabaseModuleConfig
}
