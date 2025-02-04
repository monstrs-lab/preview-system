export abstract class PDFPort {
  abstract extractFrame(url: string): Promise<Buffer>
}
