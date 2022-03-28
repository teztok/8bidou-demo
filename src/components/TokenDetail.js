import useSWR from 'swr';
import { request, gql } from 'graphql-request';
import { useParams } from 'react-router-dom';
import Preview from './Preview';
import UserLink from './UserLink';
import Price from './Price';
import Layout from './Layout';
import LoadingLayer from './LoadingLayer';
import BuyButton from './BuyButton';
import CreationsTokenGrid from './CreationsTokenGrid';
import { TEZTOK_API, FA2_CONTRACT_8X8_COLOR } from '../consts';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const TokenQuery = gql`
  query getToken($tokenId: String!) {
    token: tokens_by_pk(fa2_address: "${FA2_CONTRACT_8X8_COLOR}", token_id: $tokenId) {
      token_id
      name
      description
      editions
      price
      sales_count
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
      holdings {
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

function ListingsTable({ listings }) {
  return (
    <Table sx={{ minWidth: 650 }} size="small">
      <TableHead>
        <TableRow>
          <TableCell>Seller</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Price</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {listings.map((listing) => (
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>
              <UserLink data={listing} field="seller" />
            </TableCell>
            <TableCell>{listing.amount_left}</TableCell>
            <TableCell>
              <BuyButton amount={listing.price} swapId={listing.swap_id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SalesTable({ sales }) {
  return (
    <Table sx={{ minWidth: 650 }} size="small">
      <TableHead>
        <TableRow>
          <TableCell>Seller</TableCell>
          <TableCell>Buyer</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sales.map((sale) => (
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>
              <UserLink data={sale} field="seller" />
            </TableCell>
            <TableCell>
              <UserLink data={sale} field="buyer" />
            </TableCell>
            <TableCell>{sale.amount}</TableCell>
            <TableCell>
              <Price amount={sale.price} />
            </TableCell>
            <TableCell>{sale.timestamp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function Holdings({ holdings }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Holder</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {holdings.map((holding) => (
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>
              <UserLink data={holding} field="holder" />
            </TableCell>
            <TableCell>{holding.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TokenDetail() {
  const { tokenId } = useParams();
  const { isLoading, token } = useToken(tokenId);

  if (isLoading) {
    return <LoadingLayer />;
  }

  return (
    <Layout>
      <div className="TokenDetail">
        <div className="TokenDetail__Meta">
          <div>#{token.token_id}</div>
          <div>
            <strong>creator:</strong>
            {token.eightbid_creator_name}
          </div>
          <div>
            <strong>name:</strong>
            {token.name}
          </div>
          <div>
            <strong>description:</strong>
            {token.description}
          </div>
          <div>
            <strong>editions:</strong>
            {token.editions}
          </div>
          <div>
            <strong>sales:</strong>
            {token.sales_count}
          </div>
          <div>
            <Price amount={token.price} />
          </div>
        </div>

        <Preview rgb={token.eightbid_rgb} large />
        <h2>Listings</h2>
        <ListingsTable listings={token.listings} />
        <h2>Sales</h2>
        <SalesTable sales={token.events} />
        <h2>Holders</h2>
        <Holdings holdings={token.holdings} />

        <CreationsTokenGrid headline="All creations by this artist" address={token.artist_address} />

        <pre>{JSON.stringify(token, null, 2)}</pre>
      </div>
    </Layout>
  );
}

export default TokenDetail;
