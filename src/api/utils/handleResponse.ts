import { OK } from 'http-status-codes';

import APIError from '../APIError';

const handleResponse = (response: Response) => {
  const { status } = response;
  if (status === OK) return response.json();
  throw new APIError('APIError', status);
};

export default handleResponse;
