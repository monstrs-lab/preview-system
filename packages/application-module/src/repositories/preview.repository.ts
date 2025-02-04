export interface PreviewRepository {
  save: (sourceUrl: string, previewUrl: string) => Promise<void>

  findBySourceUrl: (sourceUrl: string) => Promise<string | undefined>
}
