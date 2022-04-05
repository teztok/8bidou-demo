import classNames from 'classnames';
import Button from '@mui/material/Button';

export default function StandardButton({ autoWidth = false, className, ...otherProps }) {
  return <Button {...otherProps} className={classNames('Button', { 'Button--autoWidth': autoWidth }, className)} />;
}
