import { AltMatcher } from './matchers/alt-matcher.ts';
import { ManyMatcher } from './matchers/many-matcher.ts';
import { OpMatcher } from './matchers/op-matcher.ts';
import { SeqMatcher } from './matchers/seq-matcher.ts';
import { StrNodeMatcher, StrTplMatcher } from './matchers/str-matcher.ts';
import { TreeMatcher } from './matchers/tree-matcher.ts';
import type { Matcher } from './types.ts';

export interface QueryOperators {
  /** Operators matched in code. */
  code: Set<string>;
  /** Operators matched inside string templates. */
  template: Set<string>;
}

/**
 * Collects the string values of all operator matchers in a matcher tree,
 * split by whether they match in code or inside string templates.
 */
export function collectOperators<Ctx>(
  matcher: Matcher<Ctx> | null,
  result: QueryOperators = { code: new Set(), template: new Set() },
  inTemplate = false,
): QueryOperators {
  if (matcher instanceof OpMatcher) {
    if (typeof matcher.op === 'string') {
      (inTemplate ? result.template : result.code).add(matcher.op);
    }
  } else if (matcher instanceof AltMatcher) {
    for (const alt of matcher.alts) {
      collectOperators(alt, result, inTemplate);
    }
  } else if (matcher instanceof SeqMatcher) {
    for (const item of matcher.seq) {
      collectOperators(item, result, inTemplate);
    }
  } else if (matcher instanceof ManyMatcher) {
    collectOperators(matcher.manyOf, result, inTemplate);
  } else if (matcher instanceof TreeMatcher) {
    collectOperators(matcher.matcher, result, inTemplate);
  } else if (matcher instanceof StrTplMatcher) {
    collectOperators(matcher.matcher, result, true);
  } else if (matcher instanceof StrNodeMatcher) {
    for (const child of matcher.matchers ?? []) {
      collectOperators(child, result, inTemplate);
    }
  }
  return result;
}
