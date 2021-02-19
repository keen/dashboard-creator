import '@testing-library/jest-dom';
import fetch from 'jest-fetch-mock';
import moment from 'moment-timezone';

fetch.enableMocks();

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string) => key,
    };
  },
}));

moment.tz.setDefault('UTC');
