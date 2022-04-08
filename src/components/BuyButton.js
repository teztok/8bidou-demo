import { useWallet } from '@tezos-contrib/react-wallet-provider';
import { MARKETPLACE_CONTRACT } from '../consts';
import { getWallet } from '../libs/wallet';
import Price from './Price';
import Button from './Button';

export default function BuyButton({ listing }) {
  const { client, activeAccount } = useWallet();

  return (
    <Button
      disabled={!activeAccount}
      onClick={async () => {
        const wallet = getWallet(client);
        const contract = await wallet.at(MARKETPLACE_CONTRACT);
        const res = await contract.methods.buy(listing.swap_id, 1, listing.price);

        await res.send({
          amount: listing.price,
          mutez: true,
          storageLimit: 175,
        });
      }}
      variant="outlined"
      size="small"
      autoWidth
    >
      Buy for&nbsp;
      <Price amount={listing.price} />
    </Button>
  );
}
