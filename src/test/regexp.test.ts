import * as assert from 'assert';

import {
  matchRegexp,
} from '../extension';

suite('RegExp Test Suite', () => {
  const testCases = [
    {
      input: ' w12p',
    },
    {
      input: ' w12r',
    },
    {
      input: ' w12#5p',
    },
    {
      input: ' w#5p',
    },
  ];

  testCases.forEach(({ input }) => {
    test(`match ${input}`, () => {
      assert.match(input, matchRegexp, `Expected ${input} to match`);
    });
  });
});
