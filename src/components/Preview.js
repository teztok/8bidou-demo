import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { chunkLeft } from '../libs/utils';

export default function Preview({ rgb, large = false }) {
  const cRef = useRef(null);
  const pixels = chunkLeft(rgb);

  useEffect(() => {
    const c = cRef.current;
    const ctx = c.getContext('2d');
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y <8; y++) {
        ctx.fillStyle = '#' + pixels[x + y * 8];
        ctx.fillRect(x, y, 1, 1);
      }
    }
  });

  return (
    <div className={classNames('Preview', { 'Preview--large': large })}>
      <canvas
        className="Preview__Canvas" ref={cRef} width={8} height={8} style={{
          imageRendering: 'pixelated',
          width: '100%',
          height: '100%',
        }} />
    </div>
  );
}
