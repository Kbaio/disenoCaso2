import { APIGatewayProxyEvent } from 'aws-lambda';
import { iMiddleware } from './iMiddleware';
import { Logger } from '../service/logger';
import { userService } from '../service/userService';

// Middleware que valida que el request tenga los datos necesarios y correctos antes de ejecutar el handler principal
export class validateUserRequestMiddleware implements iMiddleware {
    private logger: Logger;
    private service: userService;

    constructor(logger: Logger, service: userService) {
        this.logger = logger;
        this.service = service;
    }

    // Método obligatorio de la interfaz iMiddleware
    async execute(event: APIGatewayProxyEvent): Promise<void> {
        // Verifica si el cuerpo de la solicitud existe
        if (!event.body) {
            this.logger.log('Request body is missing');
            throw new Error('No body provided in event');
        }

        let parsed;
        try {
            // Intenta parsear el cuerpo como JSON
            parsed = JSON.parse(event.body);
        } catch (error) {
            this.logger.log('Invalid JSON in request body');
            throw new Error('Invalid JSON in request body');
        }

        const { userId, amount } = parsed;

        // Validación de presencia de campos requeridos
        if (!userId || !amount) {
            this.logger.log('Missing required parameters: userId and amount');
            throw new Error('Missing required parameters: userId and amount');
        }

        // Validación de tipos de datos
        if (typeof userId !== 'string' || typeof amount !== 'number') {
            this.logger.log('Invalid data types for userId or amount');
            throw new Error('Invalid data types for userId or amount');
        }

        // Validación lógica: se verifica si el usuario realmente existe
        const exists = await this.service.userExists(userId);
        if (!exists) {
            this.logger.log(`User ${userId} does not exist`);
            throw new Error(`User ${userId} does not exist`);
        }

        // Si pasa todas las validaciones
        this.logger.log(`Request validated for user ${userId}`);
    }
}
