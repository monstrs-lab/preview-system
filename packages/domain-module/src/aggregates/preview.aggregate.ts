import { randomUUID }          from 'node:crypto'

import { Guard }               from '@monstrs/guard-clause'
import { Against }             from '@monstrs/guard-clause'
import { AggregateRoot }       from '@nestjs/cqrs'

import { PreviewCreatedEvent } from '../events/index.js'

export class Preview extends AggregateRoot {
  #id!: string

  #sourceURL!: string

  #previewURL!: string

  get id(): string {
    return this.#id
  }

  private set id(id: string) {
    this.#id = id
  }

  get sourceURL(): string {
    return this.#sourceURL
  }

  private set sourceURL(sourceURL: string) {
    this.#sourceURL = sourceURL
  }

  get previewURL(): string {
    return this.#previewURL
  }

  private set previewURL(previewURL: string) {
    this.#previewURL = previewURL
  }

  @Guard()
  create(
    @(Against('sourceURL').Empty()) sourceURL: string,
    @(Against('previewURL').Empty()) previewURL: string
  ): Preview {
    this.apply(new PreviewCreatedEvent(randomUUID(), sourceURL, previewURL))

    return this
  }

  protected onPreviewCreatedEvent(event: PreviewCreatedEvent): void {
    this.#id = event.previewId
    this.#sourceURL = event.sourceURL
    this.#previewURL = event.previewURL
  }
}
