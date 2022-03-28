import get from 'lodash/get';
import { Link } from 'react-router-dom';
import { shortenTzAddress } from '../libs/utils';

export default function UserLink({ field, data, label = null }) {
  const name =
    label || (get(data, `${field}_profile.alias`) ? get(data, `${field}_profile.alias`) : shortenTzAddress(data[`${field}_address`]));

  return <Link to={`/user/${data[`${field}_address`]}`}>{name}</Link>;
}
