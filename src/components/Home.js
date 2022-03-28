import Layout from './Layout';
import LatestMintsTokenGrid from './LatestMintsTokenGrid';
import LatestSalesTokenGrid from './LatestSalesTokenGrid';

function Home() {
  return (
    <Layout>
      <div className="Home">
        <LatestMintsTokenGrid />
        <LatestSalesTokenGrid />
      </div>
    </Layout>
  );
}

export default Home;
