import { configOperators } from '../../lib/lexer/operator.ts';
import { fallbackRule } from '../../lib/lexer/rules.ts';
import type { OperatorOption, StatesMap } from '../../lib/lexer/types.ts';
import { tokenize } from '../../test/test-utils.ts';

describe('lexer/operator', () => {
  it('works', () => {
    const states: StatesMap = {
      $: { unknown: { ...fallbackRule, type: 'unknown' } },
    };
    const bracketOptions: OperatorOption[] = ['+'];
    const rules = configOperators(states, bracketOptions);
    const input = '2+2';
    const res = tokenize(rules, input);
    expect(res).toMatchObject([{ type: '_' }, { type: 'operator' }, { type: '_' }]);
  });
});
