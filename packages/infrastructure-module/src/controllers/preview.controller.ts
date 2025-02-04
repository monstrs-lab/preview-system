import { HttpInternalServerError } from '@deepkit/http'
import { HttpQuery }               from '@deepkit/http'
import { Redirect }                from '@deepkit/http'
import { Logger }                  from '@deepkit/logger'
import { MinLength }               from '@deepkit/type'
import { http }                    from '@deepkit/http'

import { GeneratePreviewUseCase }  from '@preview-system/application-module'

export class PreviewController {
  constructor(
    private readonly generatePreviewUseCase: GeneratePreviewUseCase,
    private readonly logger: Logger
  ) {}

  @http.GET('/preview')
  async preview(url: HttpQuery<string> & MinLength<3>): Promise<Redirect> {
    try {
      const previewUrl = await this.generatePreviewUseCase.execute({
        url,
      })

      return Redirect.toUrl(previewUrl, 301)
    } catch (error) {
      this.logger.error(error)

      throw new HttpInternalServerError('Failed to generate preview')
    }
  }
}
