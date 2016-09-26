/* eslint import/no-extraneous-dependencies:0 */
import test from 'ava';

import VERSION from '../src/VERSION';
import pkg from '../package.json';

test('it\'s VERSION matches version regex', (t) => {
  t.regex(VERSION, /^\d+\.\d+\.\d+$/);
});

test('has VERSION from package.json', (t) => {
  t.is(VERSION, pkg.version);
});
