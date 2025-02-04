import { DomainError } from '@monstrs/core-errors'

export class InvalidSourceTypeError extends DomainError {
  constructor() {
    super('Invalid source type.', 'preview-system.invalid-source-type')
  }
}
