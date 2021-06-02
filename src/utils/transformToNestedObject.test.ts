import { transformToNestedObject } from './transformToNestedObject';

test('transform dot notation key and value to nested object', () => {
  const key = 'user.device.browser.userAgent';
  const value = 'user-agent';
  expect(transformToNestedObject(key, value)).toMatchInlineSnapshot(`
    Object {
      "user": Object {
        "device": Object {
          "browser": Object {
            "userAgent": "user-agent",
          },
        },
      },
    }
  `);
});
