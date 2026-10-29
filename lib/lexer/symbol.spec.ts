import { fallbackRule } from '../../lib/lexer/rules.ts';
import { configSymbols } from '../../lib/lexer/symbol.ts';
import type { StatesMap, SymbolOption } from '../../lib/lexer/types.ts';
import { tokenize } from '../../test/test-utils.ts';

describe('lexer/symbol', () => {
  it('works', () => {
    const states: StatesMap = {
      $: { unknown: { ...fallbackRule, type: 'unknown' } },
    };
    const symbolOption: SymbolOption = { match: /[a-z]+/ };
    const rules = configSymbols(states, symbolOption);
    const input = 'foo+bar';
    const res = tokenize(rules, input);
    expect(res).toMatchObject([
      { type: 'symbol', value: 'foo' },
      { type: '_' },
      { type: 'symbol', value: 'bar' },
    ]);
  });
});
