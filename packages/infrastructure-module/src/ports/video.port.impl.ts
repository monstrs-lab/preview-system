import { mkdtemp }   from 'node:fs/promises'
import { readFile }  from 'node:fs/promises'
import { tmpdir }    from 'node:os'
import { join }      from 'node:path'

import ffmpeg        from 'fluent-ffmpeg'

import { VideoPort } from '@preview-system/application-module'

export class VideoPortImpl extends VideoPort {
  async extractFrame(url: string): Promise<Buffer> {
    const folder = await mkdtemp(join(tmpdir(), 'ffmpeg-'))

    const filename: string = await new Promise((resolve, reject) => {
      let file: string

      ffmpeg(url)
        .on('filenames', (filenames) => {
          ;[file] = filenames
        })
        .on('end', () => {
          resolve(file)
        })
        .on('error', (error) => {
          reject(error)
        })
        .screenshots({
          count: 1,
          folder,
        })
    })

    return readFile(join(folder, filename))
  }
}
