import { query as q } from '../index.ts';
import { lang as groovyConfig } from './groovy.ts';
import { createLang } from './index.ts';

describe('lang/index', () => {
  describe('operator validation', () => {
    const scala = createLang('scala');
    const groovy = createLang('groovy');
    const custom = createLang({
      ...groovyConfig,
      lexer: {
        ...groovyConfig.lexer,
        operators: ['='],
        strings: [
          {
            startsWith: '"',
            escapeChar: '\\',
            templates: [{ type: 'var', startsWith: '$', symbols: /[a-z]+/, operators: ['->'] }],
          },
        ],
      },
    });

    it('accepts known operators', () => {
      expect(scala.query('foo %%% bar', q.sym().op('%%%').sym(), {})).toEqual({});
    });

    it('accepts regex and unspecified operators', () => {
      const query = q
        .sym()
        .op(/^[+-]$/)
        .op();
      expect(() => scala.query('foo + bar', query, {})).not.toThrow();
    });

    it('accepts variable template operators', () => {
      const query = q.str({ match: [q.sym().op('->').sym()] });
      expect(custom.query('"$foo->bar"', query, {})).toEqual({});
    });

    it('throws for template-only operators outside templates', () => {
      expect(() => custom.query('foo -> bar', q.sym().op('->').sym(), {})).toThrow(
        "Unknown operator '->' for this language",
      );
    });

    it('throws for unknown template operators', () => {
      const query = q.str({ match: [q.sym().op('+').sym()] });
      expect(() => custom.query('"$foo"', query, {})).toThrow(
        "Unknown template operator '+' for this language",
      );
    });

    it('throws for unknown operators', () => {
      expect(() => scala.query('foo %%%% bar', q.sym().op('%%%%').sym(), {})).toThrow(
        "Unknown operator '%%%%' for this language",
      );
    });

    it('throws for unknown operators in nested queries', () => {
      const query = q.tree({
        search: q.alt(q.str(), q.str({ match: [q.op('.')] }), q.many(q.op('=>'))),
      });
      expect(() => groovy.query('foo', query, {})).toThrow(
        "Unknown operator '=>' for this language",
      );
    });
  });
});
