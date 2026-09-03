import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const porta = Number.parseInt(process.env.PORT || "4173", 10);
const raiz = resolve(fileURLToPath(new URL(".", import.meta.url)));

const tipos = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

function caminhoSeguro(url) {
  const caminhoUrl = new URL(url, `http://localhost:${porta}`).pathname;
  if (caminhoUrl === "/") {
    return join(raiz, "index.html");
  }

  const limpo = normalize(decodeURIComponent(caminhoUrl)).replace(/^[/\\]+/, "");
  return resolve(raiz, limpo);
}

createServer((pedido, resposta) => {
  const arquivo = caminhoSeguro(pedido.url || "/");

  if (!arquivo.startsWith(raiz + sep) && arquivo !== raiz) {
    resposta.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    resposta.end("Acesso negado");
    return;
  }

  if (!existsSync(arquivo) || statSync(arquivo).isDirectory()) {
    resposta.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    resposta.end("Não encontrado");
    return;
  }

  resposta.writeHead(200, { "content-type": tipos[extname(arquivo)] || "application/octet-stream" });
  createReadStream(arquivo).pipe(resposta);
}).listen(porta, () => {
  console.log(`Site local em http://localhost:${porta}`);
});
