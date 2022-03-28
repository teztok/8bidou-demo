import Box from '@mui/material/Box';
import SyncButton from './SyncButton';
import { Link } from 'react-router-dom';

function Layout({ children, backgroundColor = 'inherit' }) {
  return (
    <Box style={{ backgroundColor: backgroundColor }}>
      <header>
        <div className="inner">
          <div className="columns">
            <div className="column">
              <Link to="/">8bidou &times; TezTok</Link>
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
