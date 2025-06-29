module.exports = (req, res) => {
    const swaggerUrl = "/openapi.json";
    const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Swagger UI</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
        <!-- Favicon (using emoji as placeholder) -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌬️</text></svg>">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="API documentation for the Weather WhatsApp Bot">
        <meta property="og:title" content="Weather WhatsApp Bot API Documentation">
        <meta property="og:description" content="Explore the API endpoints for the Weather WhatsApp Bot.">
        <meta property="og:image" content="/favicon.svg">
        <meta property="og:type" content="website">
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
      <script>
        window.onload = () => {
          SwaggerUIBundle({
            url: "${swaggerUrl}",
            dom_id: '#swagger-ui'
          });
        };
      </script>
    </body>
  </html>
    `.trim();
  
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  };
  