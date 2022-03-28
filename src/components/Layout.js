import Box from '@mui/material/Box';
import { useWallet } from '@tezos-contrib/react-wallet-provider';
import { Link } from 'react-router-dom';

function SyncButton() {
  const { activeAccount, connect, disconnect } = useWallet();

  return (
    <div>
      {!activeAccount && <button onClick={connect}>Connect</button>}
      {activeAccount && (
        <div>
          <button onClick={disconnect}>Disconnect</button>
          <Link to={`/user/${activeAccount?.address}`}>My Profile</Link>
        </div>
      )}
    </div>
  );
}

function Layout({ children }) {
  return (
    <Box>
      <header>
        <SyncButton />
        <Link to="/">Home</Link>
      </header>
      {children}
    </Box>
  );
}

export default Layout;
