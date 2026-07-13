// ======================================================================================
//? Importing
// ======================================================================================
import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type RawAxiosResponseHeaders,
} from 'axios';

// ===================================================================================

// API client
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  timeout: (10 * 1000), // 10 seconds - abort request if server doesn't respond
});


// --------------------------------------------

//  Handle missing responses by selecting offline/network errors and attaching a default error response
//  when the user device is offline or out of network, it does't return response, that's why we are handling this case here
apiClient.interceptors.response.use(
  (response) => response,


  (error) => {

    // determine whether it's internet or network error
    if (axios.isAxiosError(error) && !error.response) {
      let returnedMessage = 'Network error. Please try again';

      if (error.code === 'ECONNABORTED') {
        returnedMessage = 'Request timed out. Please try again';
      } else if (!navigator.onLine) { // navigator - has info about user's environment(browser provided object)
        returnedMessage = 'No internet connection. Please check your connection and try again';
      }

      // --------------------------------------------------------------------
      // (normalizing) transform Network error to same structure as Http errors

      type ApiErrorResponse = { message: string };

      const axError = error as AxiosError<ApiErrorResponse, unknown>;

      const response: AxiosResponse<ApiErrorResponse, unknown> = {
        data: { message: returnedMessage },
        status: 0,
        statusText: '',
        headers: {} as RawAxiosResponseHeaders,
        config: axError.config ?? ({} as InternalAxiosRequestConfig<unknown>), // axios stores the original request details (method, url, headers) inside error.config  
      };
      // --------------------------------------------------------------------

      axError.response = response;
    }

    return Promise.reject(error);
  }
);
