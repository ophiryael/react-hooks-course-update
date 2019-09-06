import { useReducer, useCallback } from 'react';

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null, data: null, extra: null, identifier: action.identifier };
    case 'RESPONSE':
      return { ...currentHttpState, loading: false, data: action.responseData, extra: action.extra };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...currentHttpState, error: null };
    default:
      throw new Error('Should not get here!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
  });

  const sendRequest = useCallback(async (url, method, body, reqExtra, reqIdentifier) => {
    dispatchHttp({ type: 'SEND', identifier: reqIdentifier });

    try {
      const response = await fetch(url, { method, body, headers: { 'Content-Type': 'application/json' } });
      const responseData = await response.json();
      dispatchHttp({ type: 'RESPONSE', responseData, extra: reqExtra });
    } catch (error) {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
    }
  }, []);

  return {
    sendRequest,
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier
  };
};

export default useHttp;
