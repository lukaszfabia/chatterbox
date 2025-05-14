import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Status Service API',
            version: '1.0.0',
            description: 'Status Service API - Chatterbox',
        },
    },
    apis: ['./src/infrastructure/rest/routes.ts', './src/infrastructure/ws/websocket.ts'],
};


export const swaggerSpec = swaggerJSDoc(options) 