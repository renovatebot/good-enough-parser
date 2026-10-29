import { AltMatcher } from './matchers/alt-matcher.ts';
import { ManyMatcher } from './matchers/many-matcher.ts';
import { OpMatcher } from './matchers/op-matcher.ts';
import { SeqMatcher } from './matchers/seq-matcher.ts';
import { StrNodeMatcher, StrTplMatcher } from './matchers/str-matcher.ts';
import { TreeMatcher } from './matchers/tree-matcher.ts';
import type { Matcher } from './types.ts';

/**
 * Collects the string values of all operator matchers in a matcher tree.
 */
export function collectOperators<Ctx>(
  matcher: Matcher<Ctx> | null,
  result = new Set<string>(),
): Set<string> {
  if (matcher instanceof OpMatcher) {
    if (typeof matcher.op === 'string') {
      result.add(matcher.op);
    }
  } else if (matcher instanceof AltMatcher) {
    for (const alt of matcher.alts) {
      collectOperators(alt, result);
    }
  } else if (matcher instanceof SeqMatcher) {
    for (const item of matcher.seq) {
      collectOperators(item, result);
    }
  } else if (matcher instanceof ManyMatcher) {
    collectOperators(matcher.manyOf, result);
  } else if (matcher instanceof TreeMatcher || matcher instanceof StrTplMatcher) {
    collectOperators(matcher.matcher, result);
  } else if (matcher instanceof StrNodeMatcher) {
    for (const child of matcher.matchers ?? []) {
      collectOperators(child, result);
    }
  }
  return result;
}
