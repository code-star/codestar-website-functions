import test from 'ava';
import {safeGetHeaders} from './util';

test('Throw error if not a white-listed origin URL', t => {
  t.throws(() => {
    safeGetHeaders('http://localhost:3000');
  }, 'Not white-listed origin: http://localhost:3000');
});

test('Should bail on CI', t => {
  safeGetHeaders('http://localhost:3000');
});


test('Returns header with debug origin', t => {
  process.env.DEBUG = 'true';
  const headers = safeGetHeaders('http://localhost:3000');
  t.deepEqual(headers, {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Content-Type': 'application/json',
    }
  );
  delete process.env.DEBUG;
});

test('Returns header with prod origin', t => {
  const headers = safeGetHeaders('https://www.codestar.nl');
  t.deepEqual(headers, {
      'Access-Control-Allow-Origin': 'https://www.codestar.nl',
      'Content-Type': 'application/json',
    }
  );
});