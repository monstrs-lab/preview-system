export abstract class VideoPort {
  abstract extractFrame(url: string): Promise<Buffer>
}
