import { useWallet } from '@tezos-contrib/react-wallet-provider';
import UserLink from './UserLink';
import BuyButton from './BuyButton';
import CancelSwapButton from './CancelSwapButton';

export default function ListingsTable({ listings }) {
  const { activeAccount } = useWallet();

  if (!listings || !listings.length) {
    return (
      <div>
        <em>no results</em>
      </div>
    );
  }

  return (
    <table className="ListingsTable">
      <tbody>
        {listings.map((listing) => {
          const isYou = listing.seller_address === activeAccount?.address;

          return (
            <tr key={listing.swap_id}>
              <td>
                {listing.amount_left} x <UserLink data={listing} field="seller" />
              </td>
              <td>{isYou ? <CancelSwapButton listing={listing} /> : <BuyButton listing={listing} />}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
