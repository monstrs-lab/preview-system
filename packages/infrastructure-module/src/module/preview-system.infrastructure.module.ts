import type { FilesystemPort }                     from '@preview-system/application-module'
import type { PDFPort }                            from '@preview-system/application-module'
import type { PreviewRepository }                  from '@preview-system/application-module'
import type { VideoPort }                          from '@preview-system/application-module'
import type { AccessPort }                         from '@preview-system/application-module'

import { createModule }                            from '@deepkit/app'
import { provide }                                 from '@deepkit/injector'

import { PreviewSystemApplicationModule }          from '@preview-system/application-module'

import * as controllers                            from '../controllers/index.js'
import { AccessPortImpl }                          from '../ports/index.js'
import { FilesystemPortImpl }                      from '../ports/index.js'
import { PDFPortImpl }                             from '../ports/index.js'
import { VideoPortImpl }                           from '../ports/index.js'
import { PreviewRepositoryImpl }                   from '../repositories/index.js'
import { PreviewSystemInfrastructureModuleConfig } from './preview-system.infrastructure.module.config.js'

export class PreviewSystemInfrastructureModule extends createModule({
  config: PreviewSystemInfrastructureModuleConfig,

  controllers: [...Object.values(controllers)],
}) {
  override imports = [new PreviewSystemApplicationModule()]

  override process(): void {
    this.getImportedModuleByClass(PreviewSystemApplicationModule)
      .addProvider(
        provide<AccessPort>({ useValue: new AccessPortImpl(this.config.allowedSourceUrls) })
      )
      .addProvider(provide<VideoPort>({ useClass: VideoPortImpl }))
      .addProvider(provide<PDFPort>({ useClass: PDFPortImpl }))
      .addProvider(provide<FilesystemPort>({ useClass: FilesystemPortImpl }))
      .addProvider(provide<PreviewRepository>({ useClass: PreviewRepositoryImpl }))
  }
}
