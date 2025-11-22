const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const config = require('./config');
const { toErrorResponse } = require('./utils/httpErrors');

// Initialize express app
const app = express();

// CORS
app.use(cors(config.cors));
app.set('trust proxy', true);

// Swagger docs served with dynamic server url
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Expose the OpenAPI JSON for orchestrator linkage
app.get('/openapi.json', (req, res) => {
  const host = req.get('host');
  let protocol = req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;
  res.json({
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  });
});

// Parse JSON request body
app.use(express.json({ limit: '1mb' }));

// Mount routes
app.use('/', routes);

// Centralized error responder (must have 4 args)
app.use((err, req, res, next) => {
  const { status, payload } = toErrorResponse(err);
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json(payload);
});

module.exports = app;
