import { useParams } from 'react-router-dom';
import Layout from './Layout';
import CreationsTokenGrid from './CreationsTokenGrid';
import InventoryTokenGrid from './InventoryTokenGrid';

function UserDetail() {
  const { address } = useParams();
  return (
    <Layout>
      <div className="UserDetail">
        <CreationsTokenGrid address={address} />
        <InventoryTokenGrid address={address} />
      </div>
    </Layout>
  );
}

export default UserDetail;
