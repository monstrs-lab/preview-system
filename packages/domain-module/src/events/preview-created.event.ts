export class PreviewCreatedEvent {
  constructor(
    public readonly previewId: string,
    public readonly sourceURL: string,
    public readonly previewURL: string
  ) {}
}
