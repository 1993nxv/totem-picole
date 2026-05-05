import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ProductsService } from './services/central'
import { useStore } from './store/useStore'
import { Mascot } from './components/Mascot'
import { IdleTimer } from './components/IdleTimer'
import { Home } from './pages/Home'
import { Payment } from './pages/Payment'
import { Success } from './pages/Success'
import { AdminDashboard } from './pages/Admin'

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
      <IdleTimer />
      <Outlet />
      <Mascot />
    </div>
  ),
})

// Child Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pagamento',
  component: Payment,
})

const successRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sucesso',
  component: Success,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gerir',
  component: AdminDashboard,
})

const routeTree = rootRoute.addChildren([indexRoute, paymentRoute, successRoute, adminRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  const theme = useStore((state) => state.theme)

  useEffect(() => {
    ProductsService.initializeMockData().catch(console.error)
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return <RouterProvider router={router} />
}
