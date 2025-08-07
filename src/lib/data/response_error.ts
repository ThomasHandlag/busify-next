interface ResponseError {
  error: string;
  message: string | string[];
  timestamp: number;
  status: number;
}

const printError = (error: ResponseError | undefined | null): void => {
  if (error) {
    console.error("Error:", error.message);
  }
  else {
    console.error("An unknown error occurred.");
  }
}
export { printError };
export default ResponseError;
