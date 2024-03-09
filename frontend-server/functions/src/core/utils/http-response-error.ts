/**
 * HttpResponseError class extends the built-in Error class in JavaScript.
 * It represents an HTTP response error with a status, code, and description.
 */
export class HttpResponseError extends Error {
  /**
   * @param status - The HTTP status code of the error.
   * @param code - A string representing the error code. Defaults to 'UNKNOWN'.
   * @param description - A string providing more details about the error. Defaults to a string containing the status and code.
   */
  constructor(
    public readonly status: number,
    public readonly code: string = "UNKNOWN",
    public readonly description: string = `An error occurred with status "${status}" and code "${code}"`
  ) {
    super(
      `(HttpResponseError) status: "${status}" code: "${code}" description: "${description}"`
    );
  }
}

/**
 * ErrorResponseBody class represents the body of an HTTP response in case of an error.
 * It contains an error object with status, code, and description properties.
 */
export class ErrorResponseBody {
  /**
   * @param error - An object containing the details of the error.
   * @param error.status - The HTTP status code of the error.
   * @param error.code - A string representing the error code.
   * @param error.description - A string providing more details about the error.
   */
  constructor(
    public error: {
      status: number;
      code: string;
      description: string;
    }
  ) {}
}
