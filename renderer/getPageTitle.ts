export { getPageTitle }

import type { PageContext } from 'vike/types'

function getPageTitle(pageContext: PageContext): string {
  const title =
    pageContext.data?.title ||
    pageContext.config.title ||
    'Vike Demo'
  return title
}
