import { Inject }                                       from '@nestjs/common'
import { URLPattern }                                   from 'urlpattern-polyfill'

import { AccessPort }                                   from '@preview-system/application-module'

import { PREVIEW_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS } from '../module/index.js'
import { PreviewSystemInfrastructureModuleOptions }     from '../module/index.js'

export class AccessPortImpl extends AccessPort {
  #patterns: Array<URLPattern>

  constructor(
    @Inject(PREVIEW_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS)
    options: PreviewSystemInfrastructureModuleOptions
  ) {
    super()

    this.#patterns = options.access.urls.map((url) => new URLPattern(url))
  }

  async can(url: string): Promise<boolean> {
    return this.#patterns.some((pattern) => pattern.test(url))
  }
}
