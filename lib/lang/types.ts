import type { LexerConfig } from '../lexer/types.ts';
import type { ParserConfig } from '../parser/types.ts';

export interface LanguageConfig {
  lexer: LexerConfig;
  parser: ParserConfig;
}
