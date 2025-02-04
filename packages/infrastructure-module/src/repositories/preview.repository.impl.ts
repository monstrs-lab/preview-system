import type { Database }          from '@deepkit/orm'
import type { PreviewRepository } from '@preview-system/application-module'

import { Preview }                from '../entities/index.js'

export class PreviewRepositoryImpl implements PreviewRepository {
  constructor(private readonly database: Database) {}

  async save(sourceUrl: string, previewUrl: string): Promise<void> {
    await this.database.persist(new Preview(sourceUrl, previewUrl))
  }

  async findBySourceUrl(sourceUrl: string): Promise<string | undefined> {
    try {
      return await this.database.query(Preview).filter({ sourceUrl }).findOneField('previewUrl')
    } catch {
      return undefined
    }
  }
}
