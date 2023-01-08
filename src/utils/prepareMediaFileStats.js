const { statSync } = require('fs');
const { extname } = require('path');

const prepareMediaFileStats = (path, range, contentType) => {
  const fileSize = statSync(path).size;
  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
  const contentLength = end - start + 1;
  const contentExtension = extname(path).slice(1);
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': `${contentType}/${contentExtension}`,
  };

  return { headers, start, end };
};

module.exports = prepareMediaFileStats;
