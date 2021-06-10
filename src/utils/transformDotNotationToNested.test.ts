import { transformDotNotationToNested } from './transformDotNotationToNested';

test('transform object with dot notation keys to nested object', () => {
  const obj = {
    'user.device.browser.userAgent': 'user-agent',
    'user.device.browser.version': 'version',
    'keen.id': 'keen-id',
  };

  expect(transformDotNotationToNested(obj)).toMatchInlineSnapshot(`
    Object {
      "keen": Object {
        "id": "keen-id",
      },
      "user": Object {
        "device": Object {
          "browser": Object {
            "userAgent": "user-agent",
            "version": "version",
          },
        },
      },
    }
  `);
});
