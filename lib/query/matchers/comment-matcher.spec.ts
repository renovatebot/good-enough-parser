import { createLang } from '../../lang/index.ts';
import { lang as pythonLang } from '../../lang/python.ts';
import type { Token } from '../../lexer/types.ts';
import * as q from '../builder.ts';

const lang = createLang(pythonLang);

type Ctx = string[];

const handler = (ctx: Ctx, token: Token) => [...ctx, token.value];

const input = `
foo # bar
baz
`;

describe('query/matchers/comment-matcher', () => {
  it('handles explicit comments', () => {
    const query = q.sym(handler).comment(handler).sym(handler);
    const res = lang.query(input, query, []);
    expect(res).toEqual(['foo', '# bar', 'baz']);
  });

  it('skips comments by default', () => {
    const query = q.sym(handler).sym(handler);
    const res = lang.query(input, query, []);
    expect(res).toEqual(['foo', 'baz']);
  });
});
