import Layout from './Layout';
import LatestMintsTokenGrid from './LatestMintsTokenGrid';
import LatestSalesTokenGrid from './LatestSalesTokenGrid';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Layout>
      <div className="Home">
        <div className="Intro">
          <h1>
            8bidou<span> &times; </span>TezTok
          </h1>
          <p>
            This is a fully functional technolgy demo of the <Link to="https://www.teztok.com">TezTok</Link> GraphQL API, which provides NFT
            related normalized data from the Tezos Blockchain. We are NOT affiliated with <Link to="https://www.8bidou.com">8bidou</Link>{' '}
            and derive NO financial benefit from trades being made with this application. It's all data and pixels.
          </p>
          <div className="ButtonGroup">
            <button onclick="" className="ButtonInvert">
              Understood
            </button>
          </div>
        </div>
        <LatestMintsTokenGrid />
        <LatestSalesTokenGrid />
      </div>
    </Layout>
  );
}

export default Home;
