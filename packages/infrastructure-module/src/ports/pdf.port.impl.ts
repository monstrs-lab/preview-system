import { fromBuffer } from 'pdf2pic'

import { PDFPort }    from '@preview-system/application-module'

export class PDFPortImpl extends PDFPort {
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
