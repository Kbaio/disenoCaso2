// src/service/logger.ts
import CloudWatchLogs from 'aws-sdk/clients/cloudwatchlogs';

// Definición de la interfaz Logger, que garantiza que todas las clases Logger tengan un método log
export interface Logger {
    log(message: string): Promise<void>;
}

// Implementación del logger que imprime mensajes en la consola
export class ConsoleLogger implements Logger {
    // El método log imprime un mensaje en la consola
    async log(message: string): Promise<void> {
        console.log(`[Console] ${message}`);
    }
}

// Implementación del logger que manda los mensajes a CloudWatch Logs
export class CloudWatchLogger implements Logger {
    private cloudWatch: CloudWatchLogs;
    private logGroupName = '/svless-template/logs';  // Nombre del grupo de logs en CloudWatch
    private logStreamName = 'app-stream';  // Nombre del stream de logs
    private sequenceToken?: string;  // Token de secuencia para organizar los logs

    constructor() {
        // Inicializa el cliente de CloudWatch Logs usando la región configurada en el entorno
        this.cloudWatch = new CloudWatchLogs({ region: process.env.AWS_REGION || 'us-east-2' });
    }

    // El método log manda un mensaje a CloudWatch Logs
    async log(message: string): Promise<void> {
        // Creación de los eventos de log
        const logEvents = [
            {
                message,  // El mensaje a loguear
                timestamp: Date.now(),  // Marca temporal actual
            },
        ];

        // Parámetros necesarios para enviar el evento a CloudWatch Logs
        const params: CloudWatchLogs.Types.PutLogEventsRequest = {
            logGroupName: this.logGroupName,  // Grupo de logs donde se enviará el mensaje
            logStreamName: this.logStreamName,  // Stream dentro del grupo de logs
            logEvents,  // Los eventos de log
            sequenceToken: this.sequenceToken,  // Token de secuencia (se usa para asegurar el orden de los eventos)
        };

        try {
            // Enviar el evento a CloudWatch Logs
            const response = await this.cloudWatch.putLogEvents(params).promise();
            // Actualizar el token de secuencia para el siguiente evento
            this.sequenceToken = response.nextSequenceToken;
        } catch (error) {
            // Si ocurre un error, lo muestra en la consola
            console.error('Error logging to CloudWatch:', error);
        }
    }
}
