import useSWR from 'swr';
import get from 'lodash/get';
import { request, gql } from 'graphql-request';
import { useParams } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import TwitterIcon from '@mui/icons-material/Twitter';
import Preview from './Preview';
import UserLink from './UserLink';
import Price from './Price';
import Layout from './Layout';
import Error from './Error';
import NotFound from './NotFound';
import LoadingLayer from './LoadingLayer';
import BuyButton from './BuyButton';
import CreationsTokenGrid from './CreationsTokenGrid';
import ListingsTable from './ListingsTable';
import HoldingsTable from './HoldingsTable';
import { TEZTOK_API, FA2_CONTRACT, MARKETPLACE_CONTRACT, ORIGINAL_TOKEN_LINK } from '../consts';
import { hexToRGB, getPrimaryHexColor, hexColorsToPng, toHex } from '../libs/utils';

const TokenQuery = gql`
  query getToken($tokenId: String!) {
    token: tokens_by_pk(fa2_address: "${FA2_CONTRACT}", token_id: $tokenId) {
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
        twitter
        description
      }
      listings(where: { status: { _eq: "active" } }, order_by: { price: asc }) {
        seller_address
        swap_id
        seller_profile {
          alias
          twitter
          description
        }
        contract_address
        price
        amount
        amount_left
        status
      }
      events(where: { implements: { _eq: "SALE" } }, order_by: { timestamp: desc }) {
        id
        opid
        timestamp
        seller_address
        seller_profile {
          alias
          twitter
          description
        }
        buyer_address
        buyer_profile {
          alias
          twitter
          description
        }
        amount
        price
      }
      holdings(where: { amount: { _gt: 0 } }, order_by: { amount: desc }) {
        holder_address
        holder_profile {
          alias
          twitter
          description
        }
        amount
      }
    }
  }
`;

function useToken(tokenId) {
  const { data, error, isValidating } = useSWR(['/token', tokenId], (key, tokenId) => request(TEZTOK_API, TokenQuery, { tokenId }), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  return {
    token: data && data.token,
    doesNotExist: data && data.token === null,
    error,
    isLoading: isValidating,
  };
}

function Sales({ sales }) {
  if (!sales.length) {
    return <div className="Sales">...</div>;
  }

  return (
    <div className="Sales">
      <table className="SalesTable">
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{1} x</td>
              <td>
                <UserLink data={sale} field="seller" />
                <span> ➔ </span>
                <UserLink data={sale} field="buyer" />
              </td>
              <td className="SalesTable__Price">
                <Price amount={sale.price} />
              </td>
              <td className="SalesTable__Time">
                <ReactTimeAgo date={new Date(sale.timestamp)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListingsAndHoldings({ holdings, listings }) {
  const holdingsFiltered = holdings.filter(({ holder_address }) => holder_address !== MARKETPLACE_CONTRACT);

  return (
    <div className="ListingsAndHoldings">
      {listings.length > 0 && <ListingsTable listings={listings} />}
      {holdingsFiltered.length > 0 && <HoldingsTable holdings={holdingsFiltered} />}
    </div>
  );
}

function TokenDetail() {
  const { tokenId } = useParams();
  const { isLoading, token, doesNotExist, error } = useToken(tokenId);

  if (error) {
    return <Error error={error} />;
  }

  if (doesNotExist) {
    return <NotFound />;
  }

  if (!token || isLoading) {
    return <LoadingLayer />;
  }

  const backgroundColor = hexToRGB(getPrimaryHexColor(toHex(token.eightbid_rgb)), 0.25);

  const favicon = hexColorsToPng(toHex(token.eightbid_rgb));

  const twitter = get(token, 'artist_profile.twitter');

  return (
    <Layout backgroundColor={backgroundColor} favicon={favicon}>
      <div className="TokenDetail">
        <div className="Token__Cols">
          <div className="TokenDetail__Thumbnail">
            <Preview rgb={toHex(token.eightbid_rgb)} large />
            {token.listings.length ? <BuyButton listing={token.listings[0]} /> : null}
          </div>
          <div className="TokenDetail__Meta">
            <h3>
              <UserLink field="artist" data={token} hideIsYouIndicator />
              {twitter ? (
                <>
                  <a href={`https://twitter.com/${twitter}`} className="TwitterLink">
                    <TwitterIcon fontSize="small" />
                  </a>
                </>
              ) : null}
            </h3>

            <div className="TokenDetail__MetaInfo">
              <span>TITLE</span>
              <br />
              {token.name}
            </div>
            <div className="TokenDetail__MetaInfo">
              <span>DESCRIPTION</span>
              <br />
              {token.description}
            </div>

            <div className="TokenDetail__8bidou">
              <a href={`${ORIGINAL_TOKEN_LINK}${token.token_id}`} className="ButtonInvert">
                Open #{token.token_id} on 8bidou
              </a>
            </div>

            <div className="Token__Subcols">
              <div className="TokenDetail__MetaInfo">
                <span>EDITIONS</span>
                <br />
                {token.editions}
              </div>
              <div className="TokenDetail__MetaInfo">
                <span>SALES</span>
                <br />
                {token.sales_count}
              </div>
              <div className="TokenDetail__MetaInfo">
                <span>MINTED</span>
                <br />
                {new Date(token.minted_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="TokenWrapperColumns">
          <div className="TokenWrapper">
            <h2>Listings</h2>
            <ListingsAndHoldings holdings={token.holdings} listings={token.listings} />
          </div>
          <div className="TokenWrapper">
            <h2>Sales</h2>
            <Sales sales={token.events} />
          </div>
        </div>

        <CreationsTokenGrid headline="More Creations" address={token.artist_address} filter={(t) => token.token_id !== t.token_id} />
      </div>
    </Layout>
  );
}

export default TokenDetail;
