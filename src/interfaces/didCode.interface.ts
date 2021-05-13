export interface iDidCodeAsset {
  id: number;
  did: string;
  code: string;
  asset: string;
  createdAt?: Date;
}

export interface iIssuedCredentials {
  id: number;
  did: string;
  jwt: string;
  type: string;
  asset: string;
}
