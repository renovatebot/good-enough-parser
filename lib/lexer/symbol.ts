import type { StatesMap, SymbolOption } from './types.ts';

export function configSymbols(states: StatesMap, { match }: SymbolOption): StatesMap {
  return {
    ...states,
    $: {
      ...states.$,
      symbol: {
        t: 'regex',
        type: 'symbol',
        match,
        chunk: null,
      },
    },
  };
}
