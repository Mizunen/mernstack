import { useState, useRef, useEffect, useCallback } from "react";
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      const httpAbortCtrl = new AbortController();
      activeRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeRequests.current = activeRequests.current.filter(
          // removes request after completing
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        return responseData;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    }
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeRequests.current.forEach((activeRequest) => {
        activeRequest.abort();
      });
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
