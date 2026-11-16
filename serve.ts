import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('./game/', import.meta.url));
const types: Record<string,string> = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json' };
const port = Number(process.env.PORT ?? 8080);
createServer((req,res) => {
  try {
    const name = decodeURIComponent(new URL(req.url ?? '/', 'http://local').pathname);
    const file = resolve(root, '.' + (name.endsWith('/') ? name+'index.html' : name));
    if (!file.startsWith(resolve(root)+sep) || !statSync(file).isFile()) throw Error();
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control':'no-store' });
    createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, '0.0.0.0', () => console.log(`Sunbreak: http://localhost:${port}`));
