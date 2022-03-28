import { useParams } from 'react-router-dom';
import Layout from './Layout';
import { useWallet } from '@tezos-contrib/react-wallet-provider';
import { shortenTzAddress } from '../libs/utils';
import CreationsTokenGrid from './CreationsTokenGrid';
import InventoryTokenGrid from './InventoryTokenGrid';

// - Tacos Spent
// - Tacos Claimed
// - Alias
// - Description
// - Twitter

function UserDetail() {
  const { activeAccount } = useWallet();
  const { address } = useParams();
  return (
    <Layout>
      <div className="UserDetail">
        <h2>{activeAccount?.address === address ? 'My Profile' : shortenTzAddress(address)}</h2>
        <CreationsTokenGrid address={address} />
        <InventoryTokenGrid address={address} />
      </div>
    </Layout>
  );
}

export default UserDetail;
