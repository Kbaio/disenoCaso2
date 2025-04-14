import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context
} from 'aws-lambda';

// Importación del servicio de pagos
import { PaymentService } from '../service/paymentService';

// Importación de loggers (CloudWatch o consola)
import { CloudWatchLogger, ConsoleLogger, Logger } from '../service/logger';

// Importación de middlewares
import { withMiddleware } from '../middleware/middlewareManager';
import { loggerMiddleware } from '../middleware/loggerMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

// Inicialización del logger dependiendo del entorno
let logger: Logger;

if (process.env.NODE_ENV === 'production') {
    logger = new CloudWatchLogger();
} else {
    logger = new ConsoleLogger();
}

// Instancia del servicio de pagos
const paymentService = new PaymentService();

// Handler principal de Lambda
const rawHandler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    logger.log('Starting paymentHandler');

    try {
        // Parseamos el cuerpo del evento recibido desde API Gateway
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

        // Extraemos los campos necesarios del body
        const {
            userId,
            cardNumber,
            service,
            paymentAmount,
            paymentFrequency, // no se utiliza directamente aquí, pero puede ser útil a futuro
            startDate         // idem
        } = body;

        // Procesamos el pago usando el servicio
        const result = await paymentService.processPayment(
            userId,
            cardNumber,
            service,
            paymentAmount
        );

        logger.log(`Payment processed successfully for userId: ${userId}`);

        // Retornamos respuesta exitosa
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Payment processed successfully',
                result
            })
        };
    } catch (error: unknown) {
        // Manejo de errores inesperados
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.log(`Error processing payment: ${errorMessage}`);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error processing purchase',
                error: errorMessage
            })
        };
    }
};

// Exportamos el handler usando middlewares:
//  - loggerMiddleware para registrar la ejecución
//  - authMiddleware para validar autenticación del usuario
export const paymentHandler = withMiddleware(
    rawHandler,
    [new loggerMiddleware()],
    [new authMiddleware()]
);
