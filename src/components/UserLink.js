import { useWallet } from '@tezos-contrib/react-wallet-provider';
import { Link } from 'react-router-dom';
import { getUsername } from '../libs/utils';

export default function UserLink({ field, data, label = null, hideIsYouIndicator = false }) {
  const { activeAccount } = useWallet();
  const isYou = !hideIsYouIndicator && data[`${field}_address`] === activeAccount?.address;

  const name = label || getUsername(data, field);

  return (
    <Link to={`/user/${data[`${field}_address`]}`} className={`${isYou ? 'User' : ''}`}>
      {name}
      {isYou ? <span className="User__Icon"><em>👀</em></span> : ''}
    </Link>
  );
}
