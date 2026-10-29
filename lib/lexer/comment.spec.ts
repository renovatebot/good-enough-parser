/* oxlint-disable typescript/no-unsafe-argument */
import { loadInputTxt, loadOutputJson, tokenize } from '../../test/test-utils.ts';
import { configComments } from './comment.ts';
import { fallbackRule } from './rules.ts';
import type { CommentOption, StatesMap } from './types.ts';

describe('lexer/comment', () => {
  const states: StatesMap = {
    $: { unknown: { ...fallbackRule, type: 'unknown' } },
  };

  const opts: CommentOption[] = [
    { type: 'line-comment', startsWith: '//' },
    { type: 'multiline-comment', startsWith: '/*', endsWith: '*/' },
  ];

  test.each`
    sampleName
    ${'comment/line-comment'}
    ${'comment/multiline-comment'}
  `('$sampleName', ({ sampleName }) => {
    const input = loadInputTxt(sampleName);
    const rules = configComments(states, opts);
    const res = tokenize(rules, input);
    const expectedRes = loadOutputJson(sampleName, res);
    expect(res).toEqual(expectedRes);
  });
});
