import useSWR from 'swr';
import { request, gql } from 'graphql-request';
import { useParams } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import Preview from './Preview';
import UserLink from './UserLink';
import Price from './Price';
import Layout from './Layout';
import LoadingLayer from './LoadingLayer';
import BuyButton from './BuyButton';
import CreationsTokenGrid from './CreationsTokenGrid';
import { TEZTOK_API, FA2_CONTRACT_8X8_COLOR, MARKETPLACE_CONTRACT_8X8_COLOR } from '../consts';
import { hexToRGB, getPrimaryHexColor } from '../libs/utils';

const TokenQuery = gql`
  query getToken($tokenId: String!) {
    token: tokens_by_pk(fa2_address: "${FA2_CONTRACT_8X8_COLOR}", token_id: $tokenId) {
      token_id
      name
      description
      editions
      price
      sales_count
      minted_at
      eightbid_creator_name
      eightbid_rgb
      artist_address
      artist_profile {
        alias
        description
      }
      listings(where: { status: { _eq: "active" } }, order_by: { price: asc }) {
        seller_address
        swap_id
        seller_profile {
          alias
          description
        }
        contract_address
        price
        amount
        amount_left
        status
      }
      events(where: { implements: { _eq: "SALE" } }, order_by: { opid: desc }) {
        opid
        timestamp
        seller_address
        seller_profile {
          alias
          description
        }
        buyer_address
        buyer_profile {
          alias
          description
        }
        amount
        price
        total_price
      }
      holdings(where: { amount: { _gt: 0 } }, order_by: { amount: desc }) {
        holder_address
        holder_profile {
          alias
          description
        }
        amount
      }
    }
  }
`;

function useToken(tokenId) {
  const { data, error } = useSWR(['/token', tokenId], (key, tokenId) => request(TEZTOK_API, TokenQuery, { tokenId }));

  return {
    token: data && data.token,
    error,
    isLoading: !data,
  };
}

function Sales({ sales }) {
  if (!sales.length) {
    return <div className="Sales">no sales yet</div>;
  }

  return (
    <div className="Sales">
      <ul>
        {sales.map((sale) => (
          <li key={sale.opid}>
            {sale.amount} x <UserLink data={sale} field="seller" /> ➔ <UserLink data={sale} field="buyer" /> for{' '}
            <Price amount={sale.price} /> &nbsp;(
            <ReactTimeAgo date={new Date(sale.timestamp)} />)
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListingsAndHoldings({ holdings, listings }) {
  const holdingsFiltered = holdings.filter(({ holder_address }) => holder_address !== MARKETPLACE_CONTRACT_8X8_COLOR);
  return (
    <div className="ListingsAndHoldings">
      <ul>
        {listings.map((listing) => (
          <li key={listing.swap_id}>
            {listing.amount_left} x <UserLink data={listing} field="seller" /> <BuyButton amount={listing.price} swapId={listing.swap_id} />
          </li>
        ))}
        {holdingsFiltered.map((holding) => (
          <li key={holding.holder_address}>
            {holding.amount} x <UserLink data={holding} field="holder" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TokenDetail() {
  const { tokenId } = useParams();
  const { isLoading, token } = useToken(tokenId);

  if (isLoading) {
    return <LoadingLayer />;
  }

  const backgroundColor = hexToRGB(getPrimaryHexColor(token.eightbid_rgb), 0.25);

  return (
    <Layout backgroundColor={backgroundColor}>
      <div className="TokenDetail">
        <div className="Token__Cols">
          <div className="TokenDetail__Thumbnail">
            <Preview rgb={token.eightbid_rgb} large />
          </div>
          <div className="TokenDetail__Meta">
            <h3>
              <a href={`https://www.8bidou.com/item_detail/?id=${token.token_id}`}>#{token.token_id}</a>
              <br />
              <UserLink field="artist" data={token} label={token.eightbid_creator_name} />
            </h3>

            <div className="TokenDetail__Meta__Info">
              <span>TITLE</span>
              <br />
              {token.name}
            </div>

            <div className="TokenDetail__Meta__Info">
              <span>DESCRIPTION</span>
              <br />
              {token.description}
            </div>
            <div className="TokenDetail__Meta__Info">
              <span>EDITIONS</span>
              <br />
              {token.editions}
            </div>
            <div className="TokenDetail__Meta__Info">
              <span>SALES</span>
              <br />
              {token.sales_count}
            </div>
            <div className="TokenDetail__Meta__Info">
              <span>MINTED</span>
              <br />
              {new Date(token.minted_at).toLocaleDateString()}
            </div>
            <div className="TokenDetail__Meta__Info">
              {token.listings.length ? <BuyButton amount={token.listings[0].price} swapId={token.listings[0].swap_id} /> : null}
            </div>
          </div>
        </div>

        <div className="TokenWrapper">
          <h2>Listings</h2>
          <ListingsAndHoldings holdings={token.holdings} listings={token.listings} />
        </div>
        <div className="TokenWrapper">
          <h2>Sales</h2>
          <Sales sales={token.events} />
        </div>

        <CreationsTokenGrid headline="Other pixels from this artist" address={token.artist_address} />

        <pre>{JSON.stringify(token, null, 2)}</pre>
      </div>
    </Layout>
  );
}

export default TokenDetail;
