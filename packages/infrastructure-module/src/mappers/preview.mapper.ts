/* eslint-disable no-param-reassign */

import type { ExtractProperties } from '@monstrs/base-types'

import { Injectable }             from '@nestjs/common'

import { Preview }                from '@preview-system/domain-module'

import { PreviewEntity }          from '../entities/index.js'

@Injectable()
export class PreviewMapper {
  fromPersistence(entity: PreviewEntity): Preview {
    const properties: Omit<ExtractProperties<Preview>, 'autoCommit'> = {
      id: entity.id,
      sourceURL: entity.sourceURL,
      previewURL: entity.previewURL,
    }

    return Object.assign(new Preview(), properties)
  }

  toPersistence(aggregate: Preview, entity: PreviewEntity): PreviewEntity {
    entity.id = aggregate.id
    entity.sourceURL = aggregate.sourceURL
    entity.previewURL = aggregate.previewURL

    return entity
  }
}
