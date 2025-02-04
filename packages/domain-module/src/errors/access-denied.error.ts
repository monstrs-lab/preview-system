import { DomainError } from '@monstrs/core-errors'

export class AccessDeniedError extends DomainError {
  constructor() {
    super('Access denied.', 'preview-system.access-denied')
  }
}
