import { PrimaryKey }    from '@deepkit/type'
import { AutoIncrement } from '@deepkit/type'
import { Unique }        from '@deepkit/type'
import { entity }        from '@deepkit/type'

@entity.name('previews')
export class Preview {
  id: AutoIncrement & PrimaryKey & number = 0

  createdAt: Date = new Date()

  constructor(
    public sourceUrl: Unique & string,
    public previewUrl: Unique & string
  ) {}
}
