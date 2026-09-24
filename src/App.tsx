import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CookieBanner } from './components/CookieBanner'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { QuoteModal } from './components/QuoteModal'
import { ReviewModal } from './components/ReviewModal'
import { ScrollToTop } from './components/ScrollToTop'
import { UiProvider, useModalState } from './context/ui'
import { CatalogProvider } from './catalog/CatalogProvider'
import { RequireAuth } from './components/RequireAuth'
import { LocaleProvider } from './i18n/locale'
import { AuthProvider } from './lib/auth'
import { AdminPage } from './pages/AdminPage'
import { BannerEmbedPage } from './pages/BannerEmbedPage'
import { BannerPage } from './pages/BannerPage'
import { BannerReelPage } from './pages/BannerReelPage'
import { BookingPage } from './pages/BookingPage'
import { ContactPage } from './pages/ContactPage'
import { EasyPage } from './pages/EasyPage'
import { HelpPage } from './pages/HelpPage'
import { Home } from './pages/Home'
import { InsightsPage } from './pages/InsightsPage'
import { MaintenancePage } from './pages/MaintenancePage'
import { ManagementPage } from './pages/ManagementPage'
import { ModulesPage } from './pages/ModulesPage'
import { OrderDetailsPage } from './pages/OrderDetailsPage'
import { OrderHubPage } from './pages/OrderHubPage'
import { OrderModulesPage } from './pages/OrderModulesPage'
import { OrderPayPage } from './pages/OrderPayPage'
import { OrderPreviewPage } from './pages/OrderPreviewPage'
import { OrderReviewPage } from './pages/OrderReviewPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { AccountPage } from './pages/AccountPage'
import { LoginPage } from './pages/LoginPage'
import { StartPage } from './pages/StartPage'
import { TodayPage } from './pages/TodayPage'
import { WebsitesPage } from './pages/WebsitesPage'

function Shell() {
  const ui = useModalState()
  const path = useLocation().pathname
  const embed = path.startsWith('/banner/embed') || path === '/banner/reel'

  return (
    <LocaleProvider>
      <AuthProvider>
      <CatalogProvider>
      <UiProvider onQuote={ui.openQuote} onReview={ui.openReview}>
        <ScrollToTop />
        <div className={embed ? 'banner-embed-root' : 'flex min-h-svh flex-col'}>
          {embed ? null : <Header />}
          <main className={embed ? 'banner-embed-main' : 'flex-1'}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/banner" element={<BannerPage />} />
              <Route path="/banner/reel" element={<BannerReelPage />} />
              <Route path="/banner/embed/:size" element={<BannerEmbedPage />} />
              <Route path="/today" element={<TodayPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/easy" element={<EasyPage />} />
              <Route path="/what-we-do" element={<HelpPage />} />
              <Route path="/what-we-do/:slug" element={<HelpPage />} />
              <Route path="/websites" element={<WebsitesPage />} />
              <Route path="/web-design" element={<Navigate to="/websites" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/account"
                element={
                  <RequireAuth>
                    <AccountPage />
                  </RequireAuth>
                }
              />
              <Route path="/start" element={<StartPage />} />
              <Route
                path="/order/:token"
                element={
                  <RequireAuth>
                    <OrderHubPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/order/:token/details"
                element={
                  <RequireAuth>
                    <OrderDetailsPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/order/:token/modules"
                element={
                  <RequireAuth>
                    <OrderModulesPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/order/:token/review"
                element={
                  <RequireAuth>
                    <OrderReviewPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/order/:token/preview"
                element={
                  <RequireAuth>
                    <OrderPreviewPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/order/:token/pay"
                element={
                  <RequireAuth>
                    <OrderPayPage />
                  </RequireAuth>
                }
              />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/quote" element={<Navigate to="/start" replace />} />
              <Route path="/management" element={<ManagementPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/szolgaltatasok" element={<Navigate to="/what-we-do" replace />} />
              <Route path="/idopontfoglalas" element={<Navigate to="/book" replace />} />
              <Route path="/ajanlatkeres" element={<Navigate to="/quote" replace />} />
              <Route path="/kapcsolat" element={<Navigate to="/contact" replace />} />
              <Route path="/adatkezeles" element={<Navigate to="/privacy" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          {embed ? null : <Footer />}
        </div>
        {embed ? null : (
          <>
            <QuoteModal open={ui.quoteOpen} onClose={ui.closeQuote} />
            <ReviewModal open={ui.reviewOpen} onClose={ui.closeReview} />
            <CookieBanner />
          </>
        )}
      </UiProvider>
      </CatalogProvider>
      </AuthProvider>
    </LocaleProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
