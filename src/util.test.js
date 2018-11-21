import test from 'ava';
import {safeGetHeaders} from './util';

// test('foo', t => {
//   t.pass();
// });
//
// test('bar', async t => {
//   const bar = Promise.resolve('bar');
//   t.is(await bar, 'bar');
// });

// Expects a white-listed origin URL
test('Throw error if not a white-listed origin URL', t => {
  t.throws(() => {
    safeGetHeaders();
  }, 'Not white-listed origin: undefined');
});

test('Returns header with prod origin', t => {
  const headers = safeGetHeaders('https://www.codestar.nl');
  t.deepEqual(headers, {
      'Access-Control-Allow-Origin': 'https://www.codestar.nl',
      'Content-Type': 'application/json',
    }
  );
});