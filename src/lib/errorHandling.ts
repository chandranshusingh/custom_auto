/**
 * Enhanced Error Handling for Auto Customizer
 * Provides specific error types and robust fallback mechanisms for 3D model loading
 */

// Specific error types for better error handling
export class ModelLoadError extends Error {
  constructor(
    message: string,
    public code: string,
    public modelPath: string,
    public isRetryable: boolean = true,
    public fallbackAction?: string
  ) {
    super(message);
    this.name = 'ModelLoadError';
  }
}

export class NetworkError extends ModelLoadError {
  constructor(modelPath: string, statusCode?: number) {
    super(
      `Network error loading model: ${statusCode ? `HTTP ${statusCode}` : 'Connection failed'}`,
      'NETWORK_ERROR',
      modelPath,
      true,
      'retry_with_timeout'
    );
  }
}

export class ParseError extends ModelLoadError {
  constructor(modelPath: string, parseError: string) {
    super(
      `Failed to parse 3D model: ${parseError}`,
      'PARSE_ERROR', 
      modelPath,
      false,
      'use_fallback_model'
    );
  }
}

export class FileNotFoundError extends ModelLoadError {
  constructor(modelPath: string) {
    super(
      `3D model file not found: ${modelPath}`,
      'FILE_NOT_FOUND',
      modelPath,
      false,
      'use_fallback_model'
    );
  }
}

export class DRACOError extends ModelLoadError {
  constructor(modelPath: string, dracoError: string) {
    super(
      `DRACO decompression failed: ${dracoError}`,
      'DRACO_ERROR',
      modelPath,
      true,
      'retry_without_draco'
    );
  }
}

export class ModelCorruptedError extends ModelLoadError {
  constructor(modelPath: string) {
    super(
      `3D model file appears to be corrupted or invalid`,
      'MODEL_CORRUPTED',
      modelPath,
      false,
      'use_fallback_model'
    );
  }
}

export class ModelTooLargeError extends ModelLoadError {
  constructor(modelPath: string, size: number, maxSize: number) {
    super(
      `3D model file too large: ${(size / 1024 / 1024).toFixed(1)}MB (max: ${(maxSize / 1024 / 1024).toFixed(1)}MB)`,
      'MODEL_TOO_LARGE',
      modelPath,
      false,
      'use_lower_quality_model'
    );
  }
}

export class WebGLError extends ModelLoadError {
  constructor(modelPath: string, webglError: string) {
    super(
      `WebGL rendering error: ${webglError}`,
      'WEBGL_ERROR',
      modelPath,
      false,
      'use_simple_geometry'
    );
  }
}

export class TimeoutError extends ModelLoadError {
  constructor(modelPath: string, timeoutMs: number) {
    super(
      `Model loading timed out after ${timeoutMs}ms`,
      'TIMEOUT_ERROR',
      modelPath,
      true,
      'retry_with_longer_timeout'
    );
  }
}

// Error recovery strategies
export interface ErrorRecoveryOptions {
  maxRetries: number;
  retryDelayMs: number;
  fallbackModels: Record<string, string>; // vehicleId -> fallback model path
  enableDRACOFallback: boolean;
  maxModelSizeBytes: number;
  loadTimeoutMs: number;
  enableGeometryFallback: boolean;
}

export type RecoveryAction = {
  action: 'retry' | 'fallback' | 'give_up';
  newModelPath?: string;
  options?: Record<string, unknown>;
};

export const DEFAULT_ERROR_RECOVERY: ErrorRecoveryOptions = {
  maxRetries: 3,
  retryDelayMs: 1000,
  fallbackModels: {
    // Map of vehicle IDs to simpler fallback models
    '1': '/models/cars/simple-hatchback.gltf', // Swift fallback
    '2': '/models/cars/simple-suv.gltf',      // Nexon fallback  
    '3': '/models/cars/simple-sedan.gltf',    // City fallback
    '4': '/models/cars/simple-offroad.gltf',  // Thar fallback
  },
  enableDRACOFallback: true,
  maxModelSizeBytes: 10 * 1024 * 1024, // 10MB max
  loadTimeoutMs: 30000, // 30 second timeout
  enableGeometryFallback: true,
};

export class ErrorRecoveryManager {
  private retryAttempts = new Map<string, number>();
  private lastErrors = new Map<string, ModelLoadError>();
  private options: ErrorRecoveryOptions;

  constructor(options: Partial<ErrorRecoveryOptions> = {}) {
    this.options = { ...DEFAULT_ERROR_RECOVERY, ...options };
  }

  /**
   * Analyze error and determine recovery strategy
   */
  public analyzeError(error: unknown, modelPath: string): ModelLoadError {
    // Convert generic errors to specific ModelLoadError types
    if (error instanceof ModelLoadError) {
      return error;
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      // Network-related errors
      if (message.includes('fetch') || message.includes('network') || 
          message.includes('http') || message.includes('connection')) {
        if (message.includes('404') || message.includes('not found')) {
          return new FileNotFoundError(modelPath);
        }
        const statusMatch = message.match(/http (\d+)/);
        const statusCode = statusMatch ? parseInt(statusMatch[1]) : undefined;
        return new NetworkError(modelPath, statusCode);
      }
      
      // Parsing errors
      if (message.includes('parse') || message.includes('gltf') || 
          message.includes('json') || message.includes('invalid')) {
        return new ParseError(modelPath, error.message);
      }
      
      // DRACO-specific errors
      if (message.includes('draco') || message.includes('decompression')) {
        return new DRACOError(modelPath, error.message);
      }
      
      // Timeout errors
      if (message.includes('timeout') || message.includes('aborted')) {
        return new TimeoutError(modelPath, this.options.loadTimeoutMs);
      }
      
      // WebGL errors
      if (message.includes('webgl') || message.includes('context') || 
          message.includes('shader') || message.includes('texture')) {
        return new WebGLError(modelPath, error.message);
      }
    }

    // Generic fallback
    return new ModelLoadError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR',
      modelPath,
      true,
      'retry_with_fallback'
    );
  }

  /**
   * Determine if error is retryable and execute recovery strategy
   */
  public async handleError(
    error: unknown,
    modelPath: string,
    vehicleId: string
  ): Promise<RecoveryAction> {
    const modelError = this.analyzeError(error, modelPath);
    this.lastErrors.set(modelPath, modelError);

    const currentAttempts = this.retryAttempts.get(modelPath) || 0;

    console.warn(`🚨 Model loading error for ${modelPath}:`, {
      error: modelError.code,
      message: modelError.message,
      attempt: currentAttempts + 1,
      maxRetries: this.options.maxRetries,
      isRetryable: modelError.isRetryable,
    });

    // Check if we should retry
    if (modelError.isRetryable && currentAttempts < this.options.maxRetries) {
      this.retryAttempts.set(modelPath, currentAttempts + 1);
      
      // Handle specific error types
      switch (modelError.code) {
        case 'DRACO_ERROR':
          if (this.options.enableDRACOFallback) {
            console.log(`🔄 Retrying without DRACO compression: ${modelPath}`);
            return { action: 'retry', options: { disableDRACO: true } };
          }
          break;
          
        case 'TIMEOUT_ERROR':
          console.log(`⏱️ Retrying with longer timeout: ${modelPath}`);
          return { action: 'retry', options: { extendedTimeout: this.options.loadTimeoutMs * 2 } };
          
        case 'NETWORK_ERROR':
          console.log(`🌐 Retrying network request after delay: ${modelPath}`);
          await this.delay(this.options.retryDelayMs * (currentAttempts + 1)); // Exponential backoff
          return { action: 'retry' };
      }

      // Generic retry
      await this.delay(this.options.retryDelayMs);
      return { action: 'retry' };
    }

    // Try fallback model
    const fallbackPath = this.options.fallbackModels[vehicleId];
    if (fallbackPath && fallbackPath !== modelPath) {
      console.log(`🔄 Using fallback model for ${vehicleId}: ${fallbackPath}`);
      return { action: 'fallback', newModelPath: fallbackPath };
    }

    // Final fallback: simple geometry
    if (this.options.enableGeometryFallback) {
      console.log(`📦 Using simple geometry fallback for ${vehicleId}`);
      return { action: 'fallback' }; // Will trigger SimpleCar component
    }

    // Give up
    console.error(`❌ All recovery attempts failed for ${modelPath}`);
    return { action: 'give_up' };
  }

  /**
   * Get error statistics for monitoring
   */
  public getErrorStats(): Record<string, { attempts: number; lastError: string; timestamp: number }> {
    const stats: Record<string, { attempts: number; lastError: string; timestamp: number }> = {};
    
    Array.from(this.retryAttempts.entries()).forEach(([path, attempts]) => {
      const lastError = this.lastErrors.get(path);
      stats[path] = {
        attempts,
        lastError: lastError?.code || 'UNKNOWN',
        timestamp: Date.now(),
      };
    });
    
    return stats;
  }

  /**
   * Reset error tracking for a model
   */
  public resetError(modelPath: string): void {
    this.retryAttempts.delete(modelPath);
    this.lastErrors.delete(modelPath);
  }

  /**
   * Update recovery options
   */
  public updateOptions(newOptions: Partial<ErrorRecoveryOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Utility: delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const errorRecoveryManager = new ErrorRecoveryManager();

// Helper functions for React components
export const handleModelError = (error: unknown, modelPath: string, vehicleId: string) => 
  errorRecoveryManager.handleError(error, modelPath, vehicleId);

export const resetModelError = (modelPath: string) => 
  errorRecoveryManager.resetError(modelPath);

export const getModelErrorStats = () => 
  errorRecoveryManager.getErrorStats();
