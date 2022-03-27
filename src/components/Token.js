import Preview from './Preview';
import Price from './Price';
import { Link } from 'react-router-dom';

function Token({ token }) {
  return (
    <div className="Token">
      <Link to={`/token/${token.token_id}`}>
        <Preview rgb={token.eightbid_rgb} />
        {token.price && <Price amount={token.price} />}
      </Link>
    </div>
  );
}

export default Token;
