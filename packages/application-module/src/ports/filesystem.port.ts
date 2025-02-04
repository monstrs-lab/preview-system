export abstract class FilesystemPort {
  abstract save(path: string, data: Buffer): Promise<string>
}
