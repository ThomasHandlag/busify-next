interface ResponseError {
  error: string;
  message: string | undefined;
  timestamp: number;
  status: number;
  code: number;
}

export type AsyncCallback = (message: string) => void;

export interface AsyncLocaleCallback {
  localeMessage: string;
  callbackFn: AsyncCallback;
}

export async function AsyncCallBoundary<T>(
  fn: () => Promise<T>,
  callback: AsyncLocaleCallback
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorResponse = error as any;
    callback.callbackFn(callback.localeMessage ?? errorResponse.message);
    return undefined;
  }
}

const printError = (error: ResponseError | undefined | null): void => {
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.error("An unknown error occurred.");
  }
};
export { printError };
export default ResponseError;
