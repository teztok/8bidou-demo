import classNames from 'classnames';
import { chunkLeft } from '../libs/utils';

export default function Preview({ rgb, large = false }) {
  const pixels = chunkLeft(rgb);

  return (
    <div className={classNames('Preview', { 'Preview--large': large })}>
      {pixels.map((pixel, idx) => (
        <div key={idx} className="Preview__Pixel" style={{ backgroundColor: `#${pixel}` }}></div>
      ))}
      <div style={{ clear: 'both' }}></div>
    </div>
  );
}
