import { Block, Blockchain } from '../lib/bc-transactions.js';

const enum Status {
  Initialization = '⏳ Initializing the blockchain, creating the genesis block ...',
  AddTransaction = '📥 Add one or more transactions',
  ReadyToMine = '✔ Ready to mine a new block',
  MineInProgress = '⏳ Mining a new block ...',
}

class Main {
  //   statusEl: HTMLElement;
  blocksEl: HTMLElement;
  pendingListEl: HTMLElement;
  confirmBtn: HTMLButtonElement;
  transferBtn: HTMLButtonElement;
  senderInp: HTMLInputElement;
  recipientInp: HTMLInputElement;
  amountInp: HTMLInputElement;
  blockchain: Blockchain;

  constructor() {
    this.blockchain = new Blockchain();
    this.blocksEl = document.getElementById('blocks');
    this.pendingListEl = document.getElementById('pendign-list');
    this.confirmBtn = document.getElementById('confirm') as HTMLButtonElement;
    this.transferBtn = document.getElementById('transfer') as HTMLButtonElement;
    this.senderInp = document.getElementById('sender') as HTMLInputElement;
    this.recipientInp = document.getElementById(
      'recipient'
    ) as HTMLInputElement;
    this.amountInp = document.getElementById('amount') as HTMLInputElement;
    this.confirmBtn.onclick = this._mineBlock.bind(this);
    this.transferBtn.onclick = this._addNewTransaction.bind(this);
  }

  private _clearForm(): void {
    this.senderInp.innerHTML = '';
    this.recipientInp.innerHTML = '';
    this.amountInp.innerHTML = '';
  }

  async addGenesisBlock() {
    await this.blockchain.createGenesisBlock();
    this.blocksEl.innerHTML = this.blockchain.chain
      .map((block, ind) => this._createBlockHtml(block, ind))
      .join('');
  }

  private _addNewTransaction(): void {
    const payload = {
      sender: this.senderInp.value,
      recipient: this.recipientInp.value,
      amount: Number(this.amountInp.value),
    };
    this.blockchain.createTransaction(payload);
    this._clearForm();
  }

  private async _mineBlock() {
    await this.blockchain.minePendignTransaction();
  }

  private _toggleState(confirm: boolean, transferForm: boolean): void {
    this.confirmBtn.disabled = confirm;
  }

  private _createBlockHtml(block: Block, index: number): string {
    const { timestamp, previousBlockHash, hash, transactions } = block;
    return `
   <div class="block">
    <div class="block__container">
       <div class="block__header">
          <span class="block__index">#${index}</span>
          <span class="block__timestamp">${new Date(
            timestamp
          ).toLocaleTimeString()}</span>
       </div>
       <div class="block__hash">
       <div class="block__prev-hash">
          <div class="hash-title">Prev hash</div>
          <div class="hash-value">${previousBlockHash}</div>
       </div>
       <div class="block__this-hash">
          <div class="hash-title">This hash</div>
          <div class="hash-value">${hash}</div>
       </div>
       </div>
       <div class="block__transactions">
         <div class="hash-title">Transactions</div>
         <ul class="block__transactions-list">
         ${transactions.map(
           (t) =>
             `<li class="transaction-item">${t.sender} → ${t.recipient} — ${t.amount}</li>`
         )}
         </ul>
       </div>
    </div>
   </div>
   `;
  }
}

const main = new Main();
main.addGenesisBlock();
