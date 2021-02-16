import { getPublications } from './index';
import test from 'ava';

test('Calls callback with array if successful', async t => {
  t.plan(1);

  process.env.STATIC_SITE_MAILER_SOURCE = 'example@example.com';
  await getPublications(
    {
      headers: {
        origin: 'https://code-star.github.io',
      },
      body: JSON.stringify({}),
    },
    null,
    (_, result) => {
      //  t.deepEqual(result, {
      //     statusCode: 200,
      // });
      t.is(typeof JSON.parse(result.body), 'object');
    }
  );
});
