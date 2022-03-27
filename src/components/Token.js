import Preview from './Preview';
import { Link } from 'react-router-dom';

function Token({ token }) {
  return (
    <div className="Token">
      <Link to={`/token/${token.token_id}`}>
        <Preview rgb={token.eightbid_rgb} />
      </Link>
    </div>
  );
}

export default Token;
