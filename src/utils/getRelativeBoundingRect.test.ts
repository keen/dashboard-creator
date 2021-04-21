import { getRelativeBoundingRect } from './getRelativeBoundingRect';

test('calculates correctly HTML rectangle', () => {
  const parentElement: any = {
    getBoundingClientRect: jest.fn().mockReturnValue({
      top: 100,
      bottom: 40,
      right: 20,
      left: 30,
    }),
  };

  const childElement: any = {
    getBoundingClientRect: jest.fn().mockReturnValue({
      top: 120,
      bottom: 50,
      right: 30,
      left: 50,
    }),
  };

  expect(getRelativeBoundingRect(parentElement, childElement))
    .toMatchInlineSnapshot(`
    Object {
      "bottom": 10,
      "left": 20,
      "right": 10,
      "top": 20,
    }
  `);
});
