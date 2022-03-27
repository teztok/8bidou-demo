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

export default function Preview({ rgb }) {
  const pixels = chunkLeft(rgb);

  return (
    <div className="Preview">
      {pixels.map((pixel) => (
        <div className="Pixel" style={{ backgroundColor: `#${pixel}` }}></div>
      ))}
      <div style={{ clear: 'both' }}></div>
    </div>
  );
}
