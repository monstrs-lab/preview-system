export interface PDFPort {
  extractFrame: (url: string) => Promise<Buffer>
}
