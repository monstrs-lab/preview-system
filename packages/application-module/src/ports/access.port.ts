export abstract class AccessPort {
  abstract can(url: string): Promise<boolean>
}
