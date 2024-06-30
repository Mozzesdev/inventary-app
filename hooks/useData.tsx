export { useData }

import { usePageContext } from "./usePageContext"

function useData<Data>(): Data {
  const { data } = usePageContext() as any
  return data
}