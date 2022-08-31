import { Blockchain } from '../lib/bc-transactions';

const miner = async (): Promise<void> => {
  console.log('Creating the genesis block...');
  const bc = new Blockchain();
  await bc.createGenesisBlock();

  bc.createTransaction({ sender: 'Sergei', recipient: 'Alex', amount: 1000 });
  bc.createTransaction({ sender: 'Alex', recipient: 'Ivan', amount: 500 });

  await bc.minePendignTransaction();

  bc.createTransaction({ sender: 'Boris', recipient: 'Eva', amount: 100 });

  await bc.minePendignTransaction();

  console.log(JSON.stringify(bc, null, 2));
};

miner();
