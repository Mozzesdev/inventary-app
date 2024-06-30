export function getGlobalObject<T extends Record<string, unknown> = never>(
    key: `${string}.ts`,
    defaultValue: T
  ): T {
    const globalObjectsAll = (globalThis[projectKey] = globalThis[projectKey] || {})
    const globalObject = (globalObjectsAll[key] = globalObjectsAll[key] || defaultValue)
    return globalObject
  }
  const projectKey = '_vike_plugin'