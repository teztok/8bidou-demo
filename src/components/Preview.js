import classNames from 'classnames';

function chunkLeft(str, size = 6) {
  if (typeof str === 'string') {
    const length = str.length;
    const chunks = Array(Math.ceil(length / size));
    for (let i = 0, index = 0; index < length; i++) {
      chunks[i] = str.slice(index, (index += size));
    }
    return chunks;
  }
}

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
