import { App }                 from '@deepkit/app'
import { Database }            from '@deepkit/orm'

import { PreviewSystemModule } from './modules/index.js'

const bootstrap = async (): Promise<void> => {
  const app = App.fromModule(new PreviewSystemModule()).loadConfigFromEnv({
    prefix: 'PREVIEW_SYSTEM_',
  })

  await app.get(Database).migrate()
  await app.run(['server:start'])
}

bootstrap()
