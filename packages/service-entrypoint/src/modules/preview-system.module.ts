import { AppModule }                         from '@deepkit/app'
import { FrameworkModule }                   from '@deepkit/framework'

import { PreviewSystemInfrastructureModule } from '@preview-system/infrastructure-module'

import { PreviewSystemModuleConfig }         from '../configs/index.js'
import { DatabaseModule }                    from './database.module.js'
import { FilesystemModule }                  from './filesystem.module.js'

export class PreviewSystemModule extends AppModule {
  constructor() {
    super({
      config: PreviewSystemModuleConfig,
      imports: [new FrameworkModule()],
    })

    this.setup((module, config) => {
      module
        .addImport(
          new PreviewSystemInfrastructureModule({
            allowedSourceUrls: config.access.urls,
          })
        )
        .addImport(new DatabaseModule())
        .addImport(new FilesystemModule())
    })
  }
}
