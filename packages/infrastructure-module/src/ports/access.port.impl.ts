import type { AccessPort } from '@preview-system/application-module'

import { URLPattern }      from 'urlpattern-polyfill'

export class AccessPortImpl implements AccessPort {
  #patterns: Array<URLPattern>

  constructor(private readonly allowedSourceUrls: string) {
    this.#patterns = this.allowedSourceUrls.split(',').map((url) => new URLPattern(url))
  }

  async can(url: string): Promise<boolean> {
    return this.#patterns.some((pattern) => pattern.test(url))
  }
}
