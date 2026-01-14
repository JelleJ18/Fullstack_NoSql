import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class RootController {
  @Get('/')
  @Header('Content-Type', 'text/html; charset=utf-8')
  status() {
    const now = new Date().toISOString();
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Backend status</title>
    <style>
      :root { color-scheme: light dark; }
      body{
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        margin:40px; color:#111; background:#fff
      }
      .ok{color:#0a7d0a}
      .dim{color:#666}
      code{background:#f4f4f4; padding:2px 4px; border-radius:4px}
      .box{border:1px solid #e5e5e5; padding:16px; border-radius:8px}

      @media (prefers-color-scheme: dark) {
        body { color:#ededed; background:#0a0a0a; }
        .ok{ color:#7dffa3 }
        .dim{ color:#aaaaaa }
        code{ background:#1a1a1a }
        .box{ border-color:#333 }
      }
    </style>
  </head>
  <body>
    <h1 class="ok">Backend up ✅</h1>
    <div class="box">
      <p><strong>Time (UTC):</strong> ${now}</p>
      <p><strong>Health:</strong> OK</p>
      <p class="dim">Try API: <code><a href="/api/hello">/api/hello</a></code></p>
    </div>
  </body>
</html>`;
  }
}
