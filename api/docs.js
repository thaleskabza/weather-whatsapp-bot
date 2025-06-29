module.exports = (req, res) => {
    const swaggerUrl = "/openapi.json";
    const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Swagger UI</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
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
  