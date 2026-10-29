import { createLexer } from '../lexer/index.ts';
import type { Lexer } from '../lexer/types.ts';
import { createCursor, createTree } from '../parser/index.ts';
import type { Cursor, Node } from '../parser/types.ts';
import { buildRoot } from '../query/index.ts';
import { collectOperators } from '../query/operators.ts';
import type { Matcher, QueryBuilder } from '../query/types.ts';
import { clone } from '../util/clone.ts';
import { lang as groovy } from './groovy.ts';
import { lang as python } from './python.ts';
import { lang as scala } from './scala.ts';
import { lang as starlark } from './starlark.ts';
import type { LanguageConfig } from './types.ts';

export * from './types.ts';

export class Language {
  private lexer: Lexer;
  private readonly operators: Set<string>;
  private readonly templateOperators: Set<string>;

  constructor(readonly config: LanguageConfig) {
    this.lexer = createLexer(config.lexer);
    this.operators = new Set(config.lexer.operators);
    this.templateOperators = new Set(config.lexer.operators);
    for (const { templates = [] } of config.lexer.strings) {
      for (const tpl of templates) {
        if (tpl.type === 'var') {
          for (const op of tpl.operators ?? []) {
            this.templateOperators.add(op);
          }
        }
      }
    }
  }

  private validate<Ctx>(matcher: Matcher<Ctx>): void {
    const { code, template } = collectOperators(matcher);
    for (const op of code) {
      if (!this.operators.has(op)) {
        throw new Error(`Unknown operator '${op}' for this language`);
      }
    }
    for (const op of template) {
      if (!this.templateOperators.has(op)) {
        throw new Error(`Unknown template operator '${op}' for this language`);
      }
    }
  }

  parse(input: string): Cursor {
    this.lexer.reset(input);
    const root = createTree(this.lexer, this.config.parser);
    return createCursor(root);
  }

  query<Ctx, T extends Node>(
    input: string | Cursor,
    q: QueryBuilder<Ctx, T>,
    context: Ctx,
  ): Ctx | null {
    const matcher = buildRoot(q);
    this.validate(matcher);
    const cursor = typeof input === 'string' ? this.parse(input) : input;
    const checkpoint = matcher.match({ cursor, context });
    const result = checkpoint?.context;
    return result ? clone(result) : null;
  }
}

const languagePresets = {
  groovy,
  python,
  scala,
  starlark,
};

type LanguagePreset = keyof typeof languagePresets;

export function createLang(key: LanguagePreset): Language;
export function createLang(config: LanguageConfig): Language;
export function createLang(arg1: LanguagePreset | LanguageConfig): Language {
  const config = typeof arg1 === 'string' ? languagePresets[arg1] : arg1;
  return new Language(config);
}
