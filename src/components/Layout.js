import Box from '@mui/material/Box';
import SyncButton from './SyncButton';
import { Link } from 'react-router-dom';

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
