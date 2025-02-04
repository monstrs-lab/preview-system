import { Entity }     from '@mikro-orm/core'
import { Property }   from '@mikro-orm/core'
import { PrimaryKey } from '@mikro-orm/core'
import { BaseEntity } from '@mikro-orm/core'

@Entity({ tableName: 'previews' })
export class PreviewEntity extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ length: 2048 })
  sourceURL!: string

  @Property({ length: 2048 })
  previewURL!: string
}
