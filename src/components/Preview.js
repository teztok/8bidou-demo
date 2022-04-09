import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { chunkLeft } from '../libs/utils';
import { PIXEL_FORMAT } from '../consts';

export default function Preview({ rgb, large = false }) {
  const cRef = useRef();
  let pixels = null;

  try {
    pixels = chunkLeft(rgb);
  } catch (err) {}

  useEffect(() => {
    const c = cRef.current;
    const ctx = c.getContext('2d');
    for (let x = 0; x < PIXEL_FORMAT; x++) {
      for (let y = 0; y < PIXEL_FORMAT; y++) {
        ctx.fillStyle = '#' + pixels[x + y * PIXEL_FORMAT];
        ctx.fillRect(x, y, 1, 1);
      }
    }
  });

  if (pixels === null) {
    return <div className={classNames('Preview', { 'Preview--large': large })}>failed to load.</div>;
  }

  return (
    <div className={classNames('Preview', { 'Preview--large': large })}>
      <canvas className="Preview__Canvas" ref={cRef} width={PIXEL_FORMAT} height={PIXEL_FORMAT} />
    </div>
  );
}
