import { Logger }                       from '@monstrs/logger'
import { Controller }                   from '@nestjs/common'
import { Get }                          from '@nestjs/common'
import { Query }                        from '@nestjs/common'
import { Redirect }                     from '@nestjs/common'
import { UnauthorizedException }        from '@nestjs/common'
import { ConflictException }            from '@nestjs/common'
import { InternalServerErrorException } from '@nestjs/common'
import { UnprocessableEntityException } from '@nestjs/common'

import { GeneratePreviewUseCase }       from '@preview-system/application-module'
import { AccessDeniedError }            from '@preview-system/domain-module'
import { InvalidSourceTypeError }       from '@preview-system/domain-module'

@Controller('preview')
export class PreviewController {
  #logger = new Logger(PreviewController.name)

  constructor(private readonly generatePreviewUseCase: GeneratePreviewUseCase) {}

  @Get()
  @Redirect()
  async preview(@Query('url') url: string): Promise<{ url: string }> {
    if (url == null) {
      throw new UnprocessableEntityException()
    }

    try {
      const previewURL = await this.generatePreviewUseCase.execute({ url })

      return {
        url: previewURL,
      }
    } catch (error) {
      this.#logger.error(error)

      if (error instanceof AccessDeniedError) {
        throw new UnauthorizedException()
      }

      if (error instanceof InvalidSourceTypeError) {
        throw new ConflictException()
      }

      throw new InternalServerErrorException()
    }
  }
}
