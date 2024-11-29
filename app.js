const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerMerge = require('swagger-merge');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const app = express();

const swaggerFilesPath = './swagger-files';

const swaggerDocs = fs
  .readdirSync(swaggerFilesPath)
  .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
  .map((file) => {
    const filePath = path.join(swaggerFilesPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContent);
  });

const mergedSwagger = swaggerMerge.merge(swaggerDocs);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedSwagger));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/api-docs`);
});
