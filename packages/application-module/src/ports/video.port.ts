export interface VideoPort {
  extractFrame: (url: string) => Promise<Buffer>
}
