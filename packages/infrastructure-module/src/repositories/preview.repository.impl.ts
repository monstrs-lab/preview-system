import type { Preview }                             from '@preview-system/domain-module'

import { EntityRepository }                         from '@mikro-orm/core'
import { EntityManager }                            from '@mikro-orm/core'
import { InjectRepository }                         from '@mikro-orm/nestjs'
import { EntityManager as PostgreSqlEntityManager } from '@mikro-orm/postgresql'
import { Injectable }                               from '@nestjs/common'
import { Inject }                                   from '@nestjs/common'
import { EventBus }                                 from '@nestjs/cqrs'

import { PreviewRepository }                        from '@preview-system/application-module'

import { PreviewEntity }                            from '../entities/index.js'
import { PreviewMapper }                            from '../mappers/index.js'

@Injectable()
export class PreviewRepositoryImpl extends PreviewRepository {
  constructor(
    @InjectRepository(PreviewEntity)
    private readonly repository: EntityRepository<PreviewEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: PreviewMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  override async save(deal: Preview): Promise<Preview> {
    const exists = (await this.repository.findOne({ id: deal.id })) || new PreviewEntity()

    await this.em.persist(this.mapper.toPersistence(deal, exists)).flush()

    if (deal.getUncommittedEvents().length > 0) {
      this.eventBus.publishAll(deal.getUncommittedEvents())
    }

    deal.commit()

    return deal
  }

  override async findBySourceURL(sourceURL: string): Promise<Preview | undefined> {
    const entity = await this.repository.findOne({
      sourceURL,
    })

    return entity ? this.mapper.fromPersistence(entity) : undefined
  }
}
