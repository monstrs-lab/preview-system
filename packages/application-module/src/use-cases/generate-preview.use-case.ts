import { randomUUID }             from 'node:crypto'

import { Injectable }             from '@nestjs/common'
import mime                       from 'mime'

import { AccessDeniedError }      from '@preview-system/domain-module'
import { Preview }                from '@preview-system/domain-module'
import { InvalidSourceTypeError } from '@preview-system/domain-module'

import { AccessPort }             from '../ports/index.js'
import { FilesystemPort }         from '../ports/index.js'
import { PDFPort }                from '../ports/index.js'
import { VideoPort }              from '../ports/index.js'
import { PreviewRepository }      from '../repositories/index.js'

export interface GeneratePreviewUseCaseParams {
  url: string
}

@Injectable()
export class GeneratePreviewUseCase {
  constructor(
    private readonly previewRepository: PreviewRepository,
    private readonly filesystemPort: FilesystemPort,
    private readonly videoPort: VideoPort,
    private readonly pdfPort: PDFPort,
    private readonly accessPort: AccessPort
  ) {}

  async execute(params: GeneratePreviewUseCaseParams): Promise<string> {
    if (!(await this.accessPort.can(params.url))) {
      throw new AccessDeniedError()
    }

    const exists = await this.previewRepository.findBySourceURL(params.url)

    if (exists != null) {
      return exists.previewURL
    }

    const sourceType = mime.getType(params.url)

    if (sourceType == null) {
      throw new InvalidSourceTypeError()
    }

    let preview: Buffer

    if (sourceType.startsWith('video')) {
      preview = await this.videoPort.extractFrame(params.url)
    } else if (sourceType === 'application/pdf') {
      preview = await this.pdfPort.extractFrame(params.url)
    } else {
      throw new InvalidSourceTypeError()
    }

    const previewURL = await this.filesystemPort.save(`${randomUUID()}.png`, preview)

    await this.previewRepository.save(new Preview().create(params.url, previewURL))

    return previewURL
  }
}
