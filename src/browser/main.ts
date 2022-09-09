import { Block, Blockchain } from '../lib/bc-transactions.js';
import { Transaction } from '../typings/typings.js';

const enum Status {
  Initialization = '⏳ Initializing the blockchain, creating the genesis block ...',
  AddTransaction = '📥 Add one or more transactions',
  ReadyToMine = '✔ Ready to mine a new block',
  MineInProgress = '⏳ Mining a new block ...',
}

const enum StatusColor {
  Initialization = '#addaff',
  AddTransaction = '#e4daff',
  ReadyToMine = '#dffff6',
  MineInProgress = '#fddbb3',
}

class Main {
  statusEl: HTMLElement;
  blocksEl: HTMLElement;
  notificationEl: HTMLElement;
  pendingListEl: HTMLElement;
  confirmBtn: HTMLButtonElement;
  transferBtn: HTMLButtonElement;
  transactionForm: HTMLFormElement;
  senderInp: HTMLInputElement;
  recipientInp: HTMLInputElement;
  amountInp: HTMLInputElement;
  blockchain: Blockchain;

  constructor() {
    this.blockchain = new Blockchain();
    this.statusEl = document.getElementById('status');
    this.blocksEl = document.getElementById('blocks');
    this.notificationEl = document.getElementById('notification');
    this.pendingListEl = document.getElementById('pending-list');
    this.confirmBtn = document.getElementById('confirm') as HTMLButtonElement;
    this.transferBtn = document.getElementById('transfer') as HTMLButtonElement;
    this.transactionForm = document.getElementById(
      'transaction-form'
    ) as HTMLFormElement;
    this.senderInp = document.getElementById('sender') as HTMLInputElement;
    this.recipientInp = document.getElementById(
      'recipient'
    ) as HTMLInputElement;
    this.amountInp = document.getElementById('number') as HTMLInputElement;
    this.confirmBtn.onclick = this._mineBlock.bind(this);
    this.transactionForm.onsubmit = this._addNewTransaction.bind(this);
  }

  private _clearFields(): void {
    this.senderInp.value = '';
    this.recipientInp.value = '';
    this.amountInp.value = '';
  }

  async addGenesisBlock(): Promise<void> {
    this._changeStatus(Status.Initialization, StatusColor.Initialization);
    this._showPendingList(true);
    await this.blockchain.createGenesisBlock();
    this.blocksEl.innerHTML = this.blockchain.chain
      .map((block, ind) => this._createBlockHtml(block, ind))
      .join('');
    this._changeStatus(Status.AddTransaction, StatusColor.AddTransaction);
    this._blockButtons(true, false);
  }

  private _addNewTransaction(e: SubmitEvent): void {
    e.preventDefault();
    const transaction = {
      sender: this.senderInp.value,
      recipient: this.recipientInp.value,
      amount: Number(this.amountInp.value),
    };
    this._blockButtons(false, false);
    this.blockchain.createTransaction(transaction);
    this._createTransactionItem(transaction);
    this._showPendingList(false);
    this._changeStatus(Status.ReadyToMine, StatusColor.ReadyToMine);
    this._clearFields();
  }

  private _createTransactionItem(t: Transaction): void {
    const { sender, recipient, amount } = t;
    const pendingItem = document.createElement('li');
    pendingItem.classList.add('pending-item');
    pendingItem.textContent = `${sender} — ${recipient}: $${amount}`;
    this.pendingListEl.appendChild(pendingItem);
  }

  private async _mineBlock(): Promise<void> {
    this._changeStatus(Status.MineInProgress, StatusColor.MineInProgress);
    this._blockButtons(true, true);
    await this.blockchain.minePendignTransaction();
    this.blocksEl.innerHTML = this.blockchain.chain
      .map((block, ind) => this._createBlockHtml(block, ind))
      .join('');
    this._blockButtons(true, false);
    this.pendingListEl.innerHTML = '';
    this._changeStatus(Status.AddTransaction, StatusColor.AddTransaction);
    this._showPendingList(true);
  }

  private _blockButtons(confirm: boolean, transferForm: boolean): void {
    this.transferBtn.disabled =
      this.amountInp.disabled =
      this.senderInp.disabled =
      this.recipientInp.disabled =
        transferForm;
    this.confirmBtn.disabled = confirm;
  }

  private _changeStatus(txt: Status, color: StatusColor): void {
    this.statusEl.textContent = txt;
    this.statusEl.style.backgroundColor = color;
  }

  private _showPendingList(show: boolean): void {
    this.pendingListEl.classList.toggle('hide', show);
    this.notificationEl.classList.toggle('hide', !show);
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
         ${transactions
           .map(
             (t) =>
               `<li class="transaction-item">${t.sender} — ${t.recipient} — $${t.amount}</li>`
           )
           .join('')}
         </ul>
       </div>
    </div>
   </div>
   `;
  }
}

const main = new Main();
main.addGenesisBlock();
