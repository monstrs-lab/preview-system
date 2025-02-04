export interface FilesystemPort {
  save: (path: string, data: Buffer) => Promise<string>
}
