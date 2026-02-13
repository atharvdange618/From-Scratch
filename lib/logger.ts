import { env } from "@/lib/env";

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDev = env.NODE_ENV !== "production";

  info(message: string, context?: LogContext) {
    if (this.isDev) {
      console.log(`ℹ️ ${message}`, context || "");
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.isDev) {
      console.warn(`⚠️ ${message}`, context || "");
    }
  }

  error(message: string, error?: unknown, context?: LogContext) {
    const errorInfo =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : { error };

    if (this.isDev) {
      console.error(`❌ ${message}`, errorInfo, context || "");
    }
  }

  debug(message: string, context?: LogContext) {
    if (this.isDev) {
      console.debug(`🔍 ${message}`, context || "");
    }
  }
}

export const logger = new Logger();
