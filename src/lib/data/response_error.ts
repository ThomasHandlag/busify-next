interface ResponseError {
  error: string;
  message: string | undefined;
  timestamp: number;
  status: number;
  code: number;
}

export type AsyncCallback = (message: string) => void;

const printError = (error: ResponseError | undefined | null): void => {
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.error("An unknown error occurred.");
  }
};
export { printError };
export default ResponseError;
