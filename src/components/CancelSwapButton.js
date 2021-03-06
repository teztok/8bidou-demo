import { useWallet } from '@tezos-contrib/react-wallet-provider';
import { MARKETPLACE_CONTRACT } from '../consts';
import { getWallet } from '../libs/wallet';
import Price from './Price';
import Button from './Button';

export default function CancelSwapButton({ listing, showPrice = true }) {
  const { client, activeAccount } = useWallet();

  return (
    <Button
      disabled={!activeAccount}
      onClick={async () => {
        const wallet = getWallet(client);
        const contract = await wallet.at(MARKETPLACE_CONTRACT);
        const res = await contract.methods.cancelswap(listing.swap_id);

        await res.send({
          amount: 0,
          storageLimit: 175,
        });
      }}
      variant="outlined"
      size="small"
      autoWidth
    >
      Cancel
      {showPrice ? (
        <>
          &nbsp;
          <Price amount={listing.price} />
        </>
      ) : null}
    </Button>
  );
}
