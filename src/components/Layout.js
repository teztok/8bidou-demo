import Box from '@mui/material/Box';
import SyncButton from './SyncButton';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <Box>
      <header>
        <div className="inner">
          <div className="columns">
            <div className="column">
              <Link to="/">Home</Link>
            </div>
            <div className="column">
              8bidou &times; TezTok
            </div>
            <div className="column">
              <SyncButton />
            </div>
          </div>
        </div>
      </header>
      <div className="content">
        {children}
      </div>
    </Box>
  );
}

export default Layout;
