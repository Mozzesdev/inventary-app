export { PageContextProvider };
import type { PageContext } from 'vike/types'
import { getGlobalObject } from '../utils/getGlobalObject'
import React from 'react';

const globalObject = getGlobalObject('PageContextProvider.ts', {
  reactContext: React.createContext<PageContext>(undefined as never)
})

function PageContextProvider({
  pageContext,
  children,
}: {
  pageContext: PageContext;
  children: React.ReactNode;
}) {
  const { reactContext } = globalObject;
  return (
    <reactContext.Provider value={pageContext}>
      {children}
    </reactContext.Provider>
  );
}
