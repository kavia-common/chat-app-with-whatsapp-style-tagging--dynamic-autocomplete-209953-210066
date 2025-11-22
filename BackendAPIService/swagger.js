const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Chat & Tagging REST API',
      version: '1.0.0',
      description: 'REST API for chat messages and dynamic tag suggestions. Endpoints for message CRUD and tag suggestion management.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Messages', description: 'Message history and CRUD operations' },
      { name: 'Tags', description: 'Tag suggestions and management' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
