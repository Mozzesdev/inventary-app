import React, { useContext } from "react"
import { getGlobalObject } from "../utils/getGlobalObject"
import { PageContext } from "vike/types"

export { usePageContext }

const globalObject = getGlobalObject('PageContextProvider.ts', {
  reactContext: React.createContext<PageContext>(undefined as never)
})

function usePageContext(): PageContext {
  const { reactContext } = globalObject
  const pageContext = useContext(reactContext)
  return pageContext
}