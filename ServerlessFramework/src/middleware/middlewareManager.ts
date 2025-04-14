import {
    APIGatewayProxyEvent,
    Context,
    APIGatewayProxyResult
} from 'aws-lambda';

// Interfaz base que deben implementar todos los middlewares
import { iMiddleware } from './iMiddleware';

export const withMiddleware = (
    handler: (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>,
    optionalMiddlewares: iMiddleware[] = [],
    mandatoryMiddlewares: iMiddleware[]
): (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult> => {
    return async (
        event: APIGatewayProxyEvent,
        context: Context
    ): Promise<APIGatewayProxyResult> => {
        // Ejecutamos primero los middlewares obligatorios, luego los opcionales
        for (const middleware of [...mandatoryMiddlewares, ...optionalMiddlewares]) {
            await middleware.execute(event);
        }

        // Finalmente se ejecuta el handler principal
        return await handler(event, context);
    };
};
