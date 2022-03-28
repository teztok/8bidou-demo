import { useEffect } from 'react';
import TokenDetail from './components/TokenDetail';
import UserDetail from './components/UserDetail';
import Home from './components/Home';
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="token/:tokenId" element={<TokenDetail />} />
        <Route path="user/:address" element={<UserDetail />} />
      </Routes>
    </div>
  );
}

export default App;
