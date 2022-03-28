import { useWallet } from '@tezos-contrib/react-wallet-provider';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { MARKETPLACE_CONTRACT_8X8_COLOR } from '../consts';
import Price from './Price';

const Tezos = new TezosToolkit('https://mainnet.api.tez.ie');

export default function BuyButton({ swapId, amount }) {
  const { client, activeAccount } = useWallet();

  return (
    <Button
      disabled={!activeAccount}
      onClick={async () => {
        const wallet = new BeaconWallet({
          name: 'TezTok 8bidou',
          preferredNetwork: 'mainnet',
        });

        wallet.client = client;
        Tezos.setWalletProvider(wallet);

        const contract = await Tezos.wallet.at(MARKETPLACE_CONTRACT_8X8_COLOR);
        const res = await contract.methods.buy(swapId, 1, amount);

        await res.send({
          amount,
          mutez: true,
          storageLimit: 175,
        });
      }}
      variant="outlined"
      size="small"
      endIcon={<ShoppingCartIcon />}
    >
      Buy for&nbsp;
      <Price amount={amount} />
    </Button>
  );
}
