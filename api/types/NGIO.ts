interface NGIOInitOptions {}

export interface NGIO {
  readonly init: (
    appID: string,
    encryptionKey: string,
    options: NGIOInitOptions,
  ) => void;
}
