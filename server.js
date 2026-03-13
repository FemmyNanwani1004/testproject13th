const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const root = __dirname;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
};

function resolvePath(urlPath) {
  const safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const relativePath = safePath === path.sep || safePath === "." ? "index.html" : safePath.replace(/^[/\\]/, "");
  return path.join(root, relativePath);
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host}`);
  let filePath = resolvePath(requestUrl.pathname);

  try {
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    const body = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
    });
    response.end(body);
  } catch (error) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log(`Dashboard available at http://${host}:${port}`);
});
