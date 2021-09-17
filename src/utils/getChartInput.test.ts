import getChartInput from './getChartInput';

test('should return data', () => {
  const data = {
    result: 36,
  };
  const result = getChartInput(data);

  expect(result).toEqual({
    result: 36,
  });
});

test('should return query, steps and result', () => {
  const data = {
    query_name: 'name',
    result: {
      a: 1,
    },
    steps: [],
  };
  const result = getChartInput(data);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "query_name": "name",
      "result": Object {
        "a": 1,
      },
      "steps": Array [],
    }
  `);
});
