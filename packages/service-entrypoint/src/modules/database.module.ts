import { PreviewSystemModuleConfig } from '../configs/index.js'

import { Database }                       from '@deepkit/orm'
import { PostgresDatabaseAdapter }        from '@deepkit/postgres'
import { createModule }                   from '@deepkit/app'

import { entities }                       from '@preview-system/infrastructure-module'

export class DatabaseModule extends createModule({
  providers: [
    {
      provide: Database,
      useFactory: (config: PreviewSystemModuleConfig): Database =>
        new Database(new PostgresDatabaseAdapter(config.database), [...Object.values(entities)]),
    },
  ],
}) {
  override root: boolean = true
}
