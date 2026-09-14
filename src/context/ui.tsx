import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type UiContextValue = {
  openQuote: () => void
  openReview: () => void
}

const UiContext = createContext<UiContextValue | null>(null)

export function UiProvider({
  children,
  onQuote,
  onReview,
}: {
  children: ReactNode
  onQuote: () => void
  onReview: () => void
}) {
  const value = useMemo(() => ({ openQuote: onQuote, openReview: onReview }), [onQuote, onReview])
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi() {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi must be used within UiProvider')
  return ctx
}

export function useModalState() {
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  return {
    quoteOpen,
    reviewOpen,
    openQuote: () => setQuoteOpen(true),
    closeQuote: () => setQuoteOpen(false),
    openReview: () => setReviewOpen(true),
    closeReview: () => setReviewOpen(false),
  }
}
