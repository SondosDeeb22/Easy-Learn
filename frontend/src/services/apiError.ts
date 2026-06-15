// ======================================================================================================
// import
// ======================================================================================================
import axios from 'axios';

type ApiErrorResponse = {
  code: string,
  message: string
}
// ======================================================================================================
// function to return error message key if exists, else return fallBackKey (from upper calling func)

export function getApiErrorMessage(error: unknown, fallbackKey: string = "Internal Server Error"): string {

  if (error instanceof Error) {
    if (!axios.isAxiosError<ApiErrorResponse>(error)) {
      return error.message;
    }
  } else if (!axios.isAxiosError<ApiErrorResponse>(error)) {// if the error is not axios error we reaturn default fallback error

    return fallbackKey;
  }
  // ---------------

  const messageKey = error.response?.data?.message as string | undefined;
  if (typeof messageKey !== 'string') return fallbackKey;

  const trimmed = messageKey.trim();
  return trimmed.length > 0 ? trimmed : fallbackKey;
}

// ------------------------------------------
