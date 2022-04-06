import classNames from 'classnames';
import Button from '@mui/material/Button';

export default function StandardButton({ inverted = false, autoWidth = false, className, ...otherProps }) {
  return (
    <Button {...otherProps} className={classNames('Button', { 'Button--autoWidth': autoWidth, 'Button--inverted': inverted }, className)} />
  );
}
