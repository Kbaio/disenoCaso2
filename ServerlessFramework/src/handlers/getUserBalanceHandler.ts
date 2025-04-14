import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context
} from 'aws-lambda';

// Importamos los middlewares
import { withMiddleware } from '../middleware/middlewareManager';
import { validateUserRequestMiddleware } from '../middleware/validateUserRequestMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { loggerMiddleware } from '../middleware/loggerMiddleware';

// Importamos el servicio que contiene la lógica de negocio para usuarios
import { userService } from '../service/userService';

// Importamos tipos de logger disponibles (CloudWatch o consola)
import { CloudWatchLogger, ConsoleLogger, Logger } from '../service/logger';

// Inicializamos el logger según el entorno (producción usa CloudWatch, otro entorno usa consola)
let logger: Logger;
if (process.env.NODE_ENV === 'production') {
    logger = new CloudWatchLogger();
} else {
    logger = new ConsoleLogger();
}

// Instanciamos el servicio de usuario
const service = new userService();

// Handler principal que será ejecutado por Lambda
const rawHandler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    logger.log('Starting getUserBalance handler');

    try {
        // Parseamos el cuerpo del evento recibido desde API Gateway
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { userId, amount } = body;

        // Validamos que los campos necesarios estén presentes
        if (!userId || !amount) {
            logger.log('Missing userId or amount');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing userId or amount',
                })
            };
        }

        // Procesamos el pago con el servicio de usuario
        const result = await service.processPayment(userId, amount);

        // Si el usuario no fue encontrado
        if (!result) {
            logger.log(`User not found for userId: ${userId}`);
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'User not found',
                })
            };
        }

        // Éxito
        logger.log(`Payment successful for user ${userId} with amount ${amount}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Payment successful',
                data: result
            })
        };
    } catch (error: unknown) {
        // Manejamos errores inesperados
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.log(`Error processing purchase: ${errorMessage}`);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error processing purchase',
                error: errorMessage
            })
        };
    }
};

// Exportamos el handler aplicando los middlewares:
//  - loggerMiddleware se ejecuta siempre
//  - authMiddleware y validateUserRequestMiddleware se ejecutan antes del handler
export const getUserBalanceHandler = withMiddleware(
    rawHandler,
    [new loggerMiddleware()],
    [new authMiddleware(), new validateUserRequestMiddleware(logger, service)]
);
