import { useWallet } from '@tezos-contrib/react-wallet-provider';
import { Link } from 'react-router-dom';

export default function SyncButton() {
  const { activeAccount, connect, disconnect } = useWallet();

  return (
    <div>
      {!activeAccount && <button onClick={connect}>Sync</button>}
      {activeAccount && (
        <div>
          <Link to={`/user/${activeAccount?.address}`}>My Profile</Link>
          <button onClick={disconnect}>Unsync</button>
        </div>
      )}
    </div>
  );
}
