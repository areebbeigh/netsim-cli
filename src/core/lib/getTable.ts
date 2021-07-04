import { Console } from 'console';
import { Transform } from 'stream';

// Return console.table output
function getTable(data: any) {
  const ts = new Transform({
    transform(chunk, enc, cb) {
      cb(null, chunk);
    },
  });
  const logger = new Console({ stdout: ts });
  logger.table(data);
  return (ts.read() || '').toString();
}

export default getTable;
