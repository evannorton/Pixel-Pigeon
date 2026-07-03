export interface Env {
  readonly clipboardMode: "navigator" | "post-message";
  readonly newgroundsAppID: string | null;
  readonly newgroundsEncryptionKey: string | null;
  readonly remoteAssetsURL: string | null;
}
