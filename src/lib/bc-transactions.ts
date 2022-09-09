import { sha256 } from './universal-sha256.js';
import { Transaction, IBlock } from '../typings/typings';

//блокчейн с доказательством проделанной работы
export class Block implements IBlock {
  nonce: number = 0;
  hash: string;

  constructor(
    readonly previousBlockHash: string,
    readonly timestamp: number,
    readonly transactions: Transaction[]
  ) {}

  async mine(): Promise<void> {
    //увеличение числа нулей влияет на время вычисления хэша
    do {
      this.hash = await this.calculateHash(++this.nonce);
    } while (this.hash.startsWith('0000000') === false);
  }

  private async calculateHash(nonce: number): Promise<string> {
    const data =
      this.previousBlockHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      nonce;
    return sha256(data);
  }
}

export class Blockchain {
  private readonly _chain: Block[] = [];
  private _pendingTransactions: Transaction[] = [];

  private get latestBlock(): Block {
    //получаем последний блок
    return this._chain[this._chain.length - 1];
  }

  get chain(): Block[] {
    return [...this._chain];
  }

  get pendignTransactions(): Transaction[] {
    return [...this._pendingTransactions];
  }

  async createGenesisBlock(): Promise<void> {
    //создаем первичный блок
    const genesisBlock = new Block('0', Date.now(), []);
    await genesisBlock.mine();
    this._chain.push(genesisBlock);
  }

  createTransaction(transaction: Transaction): void {
    this._pendingTransactions.push(transaction);
  }

  async minePendignTransaction(): Promise<void> {
    const block = new Block(
      this.latestBlock.hash,
      Date.now(),
      this._pendingTransactions
    );
    await block.mine();
    this._chain.push(block);
    this._pendingTransactions = [];
  }
}
