import { convertMilisecondsToMinutes } from './convertMilisecondsToMinutes';

test('should return correct value', () => {
  const result = convertMilisecondsToMinutes(14000);

  expect(result).toEqual(3.888888888888889);
});
