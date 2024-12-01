const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const app = express();

const swaggerFilesPath = './swagger-files';

function loadSwagger(fileName) {
  const filePath = path.join(swaggerFilesPath, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`El archivo Swagger "${fileName}" no existe.`);
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContent);
}

app.use('/docs/user', swaggerUi.serve, swaggerUi.setup(loadSwagger('user.yaml')));
app.use('/docs/song', swaggerUi.serve, swaggerUi.setup(loadSwagger('song.yaml')));
app.use('/docs/post', swaggerUi.serve, swaggerUi.setup(loadSwagger('post.yaml')));
app.use('/docs/album', swaggerUi.serve, swaggerUi.setup(loadSwagger('album.yaml')));
app.use('/docs/playlist', swaggerUi.serve, swaggerUi.setup(loadSwagger('playlist.yaml')));
app.use('/docs/comment', swaggerUi.serve, swaggerUi.setup(loadSwagger('comment.yaml')));
app.use('/docs/artist', swaggerUi.serve, swaggerUi.setup(loadSwagger('artist.yaml')));

// Ruta base para mostrar un mensaje genérico
app.get('/docs', (req, res) => {
  res.send(`
    <h1>Documentación API</h1>
    <p>Accede a la documentación específica:</p>
    <ul>
      <li><a href="/docs/user">Documentación de Usuarios</a></li>
      <li><a href="/docs/song">Documentación de Canciones</a></li>
      <li><a href="/docs/post">Documentación de Posteos</a></li>
      <li><a href="/docs/album">Documentación de Albumnes</a></li>
      <li><a href="/docs/playlist">Documentación de Playlists</a></li>
      <li><a href="/docs/comment">Documentación de Comentarios</a></li>
      <li><a href="/docs/artist">Documentación de Artistas</a></li>
    </ul>
  `);
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/docs`);
});
