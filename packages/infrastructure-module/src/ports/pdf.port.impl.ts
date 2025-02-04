import type { PDFPort } from '@preview-system/application-module'

import { fromBuffer }   from 'pdf2pic'

export class PDFPortImpl implements PDFPort {
  async extractFrame(url: string): Promise<Buffer> {
    const response = await fetch(url)

    const convert = fromBuffer(Buffer.from(await response.arrayBuffer()), { format: 'png' })

    const { buffer } = await convert(1, { responseType: 'buffer' })

    if (buffer == null) {
      throw new Error('PDF conversion failed')
    }

    return buffer
  }
}
