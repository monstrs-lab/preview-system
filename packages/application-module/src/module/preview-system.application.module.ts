import { createModule } from '@deepkit/app'

import * as usecases    from '../use-cases/index.js'

export class PreviewSystemApplicationModule extends createModule({
  providers: [...Object.values(usecases)],
  exports: [...Object.values(usecases)],
}) {}
