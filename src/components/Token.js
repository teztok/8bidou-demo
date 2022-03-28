import Preview from './Preview';
import Price from './Price';
import { Link } from 'react-router-dom';

function Token({ token }) {
  return (
    <div className="Token">
      <Link to={`/token/${token.token_id}`}>
        <Preview rgb={token.eightbid_rgb} />
        <div className="Token__Metadata">
          <div className="Token__Cols">
            <div className="Token__Editions">
              {token.sales_count}/{token.editions}
            </div>
            <div className="Token__Price">{token.price !== null ? <Price amount={token.price} /> : '-'}</div>
          </div>
          <div className="Token__Creator">{token.eightbid_creator_name}</div>
        </div>
      </Link>
    </div>
  );
}

export default Token;
