import type { MinLength }         from '@deepkit/type'

import type { AccessPort }        from '../ports/index.js'
import type { FilesystemPort }    from '../ports/index.js'
import type { PDFPort }           from '../ports/index.js'
import type { VideoPort }         from '../ports/index.js'
import type { PreviewRepository } from '../repositories/preview.repository.js'

import { randomUUID }             from 'node:crypto'

import { assert }                 from '@deepkit/type'
import mime                       from 'mime'

import { AccessDeniedError }      from '@preview-system/domain-module'
import { InvalidSourceType }      from '@preview-system/domain-module'

export interface GeneratePreviewUseCaseParams {
  url: MinLength<1> & string
}

export class GeneratePreviewUseCase {
  constructor(
    private readonly previewRepository: PreviewRepository,
    private readonly filesystemPort: FilesystemPort,
    private readonly videoPort: VideoPort,
    private readonly pdfPort: PDFPort,
    private readonly accessPort: AccessPort
  ) {}

  async execute(params: GeneratePreviewUseCaseParams): Promise<string> {
    assert<GeneratePreviewUseCaseParams>(params)

    if (!(await this.accessPort.can(params.url))) {
      throw new AccessDeniedError()
    }

    const exists = await this.previewRepository.findBySourceUrl(params.url)

    if (exists != null) {
      return exists
    }

    const sourceType = mime.getType(params.url)

    if (sourceType == null) {
      throw new InvalidSourceType()
    }

    let preview: Buffer

    if (sourceType.startsWith('video')) {
      preview = await this.videoPort.extractFrame(params.url)
    } else if (sourceType === 'application/pdf') {
      preview = await this.pdfPort.extractFrame(params.url)
    } else {
      throw new InvalidSourceType()
    }

    const previewUrl = await this.filesystemPort.save(`${randomUUID()}.png`, preview)

    await this.previewRepository.save(params.url, previewUrl)

    return previewUrl
  }
}
