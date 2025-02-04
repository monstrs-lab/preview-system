import type { Preview } from '@preview-system/domain-module'

export abstract class PreviewRepository {
  abstract save(deal: Preview): Promise<Preview>

  abstract findBySourceURL(sourceURL: string): Promise<Preview | undefined>
}
