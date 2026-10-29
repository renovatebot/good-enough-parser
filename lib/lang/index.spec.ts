import { query as q } from '../index.ts';
import { createLang } from './index.ts';

describe('lang/index', () => {
  describe('operator validation', () => {
    const scala = createLang('scala');
    const groovy = createLang('groovy');

    it('accepts known operators', () => {
      expect(scala.query('foo %%% bar', q.sym().op('%%%').sym(), {})).toEqual({});
    });

    it('accepts regex and unspecified operators', () => {
      expect(
        scala.query(
          'foo + bar',
          q
            .sym()
            .op(/^[+-]$/)
            .op(),
          {},
        ),
      ).toBeNull();
    });

    it('accepts variable template operators', () => {
      const query = q.str({ match: [q.sym().op('.').sym()] });
      expect(groovy.query('"$foo.bar"', query, {})).toEqual({});
    });

    it('throws for unknown operators', () => {
      expect(() => scala.query('foo %%%% bar', q.sym().op('%%%%').sym(), {})).toThrow(
        "Unknown operator '%%%%' for this language",
      );
    });

    it('throws for unknown operators in nested queries', () => {
      const query = q.tree({
        search: q.alt(q.many(q.op('+')), q.str(), q.str({ match: [q.op('=>')] })),
      });
      expect(() => groovy.query('foo', query, {})).toThrow(
        "Unknown operator '=>' for this language",
      );
    });
  });
});
