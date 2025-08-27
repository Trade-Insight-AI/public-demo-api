import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common';
import { TEnvService } from '@/modules/env/services/env.service';
import { GenerateRandom } from '../utils/generateRandom';
import { AxiosInstance } from 'axios';

export abstract class ILogger {
  abstract setContextName(contextName: string): void;
  abstract log(message: any, context?: any): void;
  abstract error(message: any, context?: any): void;
  abstract warn(message: any, context?: any): void;
  abstract debug(message: any, context?: any): void;
  abstract verbose(message: any, context?: any): void;
}

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger implements ILogger {
  private contextName?: string;
  private httpService?: AxiosInstance;

  constructor(envService: TEnvService, contextName?: string) {
    super();

    if (contextName) {
      this.setContext(contextName);
    }

    // this.httpService = axios.create({
    //   baseURL: envService.get('EXTERNAL_DISCORD_WEBHOOK_URL'),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
  }

  /**
   * Set the context name for this logger instance
   * Usage: this.logger.setContextName(ServiceName.name);
   */
  setContextName(contextName: string): void {
    this.contextName = contextName;
    this.setContext(contextName);
  }

  log(message: any, context?: any): void {
    this.createFormattedLog('log', message, context);
  }

  error(message: any, context?: any): void {
    this.createFormattedLog('error', message, context);
  }

  warn(message: any, context?: any): void {
    this.createFormattedLog('warn', message, context);
  }

  debug(message: any, context?: any): void {
    this.createFormattedLog('debug', message, context);
  }

  verbose(message: any, context?: any): void {
    this.createFormattedLog('verbose', message, context);
  }

  private createFormattedLog(
    level: LogLevel,
    message: any,
    context?: any,
  ): void {
    // Determina o contexto a ser usado
    let contextName: string;
    let logId: string | undefined;
    let logData: any;

    let errorMessage: string = '';
    let isSimpleLog = false;

    if (typeof context === 'string') {
      contextName = context;
      logData = typeof message === 'object' ? message : { message };
      errorMessage = typeof message === 'string' ? message : '';

      //
    } else if (context && typeof context === 'object') {
      // Se for um objeto IRequestContext, usa o logId
      logId = context.logId;

      // Extract error message first
      if (typeof message === 'string') {
        errorMessage = message;
      } else if (context.message) {
        errorMessage = context.message;
      }

      // Try to extract context name from error message if it follows pattern like "[Context] Error"
      if (errorMessage) {
        const messageContextMatch = errorMessage.match(/\[([^\]]+)\]/);

        if (messageContextMatch) {
          contextName = messageContextMatch[1];
          // Remove the context part from the error message to avoid duplication
          errorMessage = errorMessage.replace(/\[([^\]]+)\]\s*/, '').trim();
        } else {
          // Fallback to errorName or default
          contextName =
            context.errorName ||
            this.contextName ||
            this.context ||
            'Application';
        }
      } else {
        contextName =
          context.errorName ||
          this.contextName ||
          this.context ||
          'Application';
      }

      // Append logId as suffix if available
      contextName = `[${contextName}][${logId ?? GenerateRandom.id()}]`;

      // Prepare log data with limited stack trace, excluding message
      logData = { ...context };

      if (logData.stack) {
        // Limit stack trace to first 3 lines
        const stackLines = logData.stack.split('\n');
        logData.stack = stackLines.slice(0, 4).join('\n'); // First line + 3 stack lines
      }

      // Remove message from JSON data to avoid duplication
      delete logData.message;
    } else {
      // Simple log case - no context object provided
      contextName = this.contextName || this.context || 'Application';
      errorMessage = typeof message === 'string' ? message : String(message);
      logData = null; // No additional data to log
      isSimpleLog = true;
    }

    // Format the final message
    let formattedMessage: string;

    if (isSimpleLog) {
      // For simple logs, just use the standard NestJS format
      formattedMessage = errorMessage;
      // Call parent logger normally for simple logs
      super[level](formattedMessage);

      if (level === 'error') {
        delete logData?.stack;

        this.sendErrorToWebhook({
          contextName,
          formattedMessage,
          logData: JSON.stringify(logData),
          stack: logData?.stack,
        });
      }

      const separator = '='.repeat(80);
      console.log(separator);
      return;

      //
    } else {
      const contextPart = `${contextName}`;
      const jsonData = JSON.stringify(logData);
      formattedMessage = `${contextPart}: ${errorMessage} ${jsonData}`;
    }

    // Call the parent logger with the formatted message and undefined context
    // to avoid NestJS adding its own context like [AllExceptionsFilter]
    super[level](formattedMessage, undefined);

    if (level === 'error') {
      const stack = logData?.stack;
      delete logData?.stack;
      delete logData?.errorName;

      this.sendErrorToWebhook({
        contextName,
        formattedMessage: errorMessage,
        logData: JSON.stringify(logData),
        stack,
      });
    }

    // Print separator on a new line only for complex logs
    const separator = '='.repeat(80);
    console.log(separator);
  }

  private sendErrorToWebhook({
    contextName,
    formattedMessage,
    logData,
    stack,
  }: {
    contextName: string;
    formattedMessage: string;
    logData: string;
    stack?: string;
  }) {
    let discordMessage = '';
    discordMessage += `\`contextName\`: ${contextName}\n`;
    discordMessage += `\`message\`: ${formattedMessage}`;

    if (logData) {
      discordMessage += `\n\`logData\`: ${logData}`;
    }

    if (stack) {
      discordMessage += `\n\`stack\`: ${stack}`;
    }

    // Limitar a mensagem a no máximo 1990 caracteres, adicionando "..." se necessário
    if (discordMessage.length > 1990) {
      discordMessage = `${discordMessage.slice(0, 1950)}...`;
    }

    discordMessage += '\n';
    discordMessage += '='.repeat(80);
    discordMessage += '\n';

    void this.httpService?.post('', {
      content: discordMessage,
    });
  }
}
