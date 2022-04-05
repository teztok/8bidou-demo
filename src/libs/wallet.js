import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';

const Tezos = new TezosToolkit('https://mainnet.api.tez.ie');

const wallet = new BeaconWallet({
  name: 'TezTok 8bidou',
  preferredNetwork: 'mainnet',
});

Tezos.setWalletProvider(wallet);

export function getWallet(client) {
  wallet.client = client;
  return Tezos.wallet;
}
