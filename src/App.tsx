import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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
import { OrderReviewPage } from './pages/OrderReviewPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { AccountPage } from './pages/AccountPage'
import { LoginPage } from './pages/LoginPage'
import { StartPage } from './pages/StartPage'
import { TodayPage } from './pages/TodayPage'
import { WebsitesPage } from './pages/WebsitesPage'

export default function App() {
  const ui = useModalState()

  return (
    <BrowserRouter>
      <LocaleProvider>
      <AuthProvider>
      <CatalogProvider>
      <UiProvider onQuote={ui.openQuote} onReview={ui.openReview}>
        <ScrollToTop />
        <div className="flex min-h-svh flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
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
              <Route
                path="/start"
                element={
                  <RequireAuth>
                    <StartPage />
                  </RequireAuth>
                }
              />
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
                path="/order/:token/pay"
                element={
                  <RequireAuth>
                    <OrderPayPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminPage />
                  </RequireAuth>
                }
              />
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
          <Footer />
        </div>
        <QuoteModal open={ui.quoteOpen} onClose={ui.closeQuote} />
        <ReviewModal open={ui.reviewOpen} onClose={ui.closeReview} />
        <CookieBanner />
      </UiProvider>
      </CatalogProvider>
      </AuthProvider>
      </LocaleProvider>
    </BrowserRouter>
  )
}
