export interface AccessPort {
  can: (url: string) => Promise<boolean>
}
