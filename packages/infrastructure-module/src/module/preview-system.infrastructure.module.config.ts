import type { MinLength } from '@deepkit/type'

export class PreviewSystemInfrastructureModuleConfig {
  allowedSourceUrls!: MinLength<1> & string
}
