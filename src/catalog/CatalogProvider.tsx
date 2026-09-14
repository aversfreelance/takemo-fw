import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fallbackCatalog, type Catalog } from '.'

const CatalogContext = createContext<Catalog>(fallbackCatalog)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState(fallbackCatalog)

  useEffect(() => {
    fetch('/api/catalog')
      .then((response) => (response.ok ? response.json() : fallbackCatalog))
      .then((data: Catalog) => setCatalog(data))
      .catch(() => setCatalog(fallbackCatalog))

    function onUpdate(event: Event) {
      setCatalog((event as CustomEvent<Catalog>).detail)
    }
    window.addEventListener('takemo-catalog', onUpdate)
    return () => window.removeEventListener('takemo-catalog', onUpdate)
  }, [])

  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  return useContext(CatalogContext)
}

export function publishCatalog(next: Catalog) {
  window.dispatchEvent(new CustomEvent('takemo-catalog', { detail: next }))
}
