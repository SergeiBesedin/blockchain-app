export interface Transaction {
  readonly sender: string;
  readonly recipient: string;
  readonly amount: number;
}

export interface IBlock {
  readonly previousBlockHash: string;
  readonly timestamp: number;
  readonly transactions: Transaction[];
  hash: string;
}
