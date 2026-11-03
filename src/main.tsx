import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme'
import { NavigationProvider } from './contexts/navigation'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavigationProvider>
        <RouterProvider router={router} />
      </NavigationProvider>
    </ThemeProvider>
  </StrictMode>,
)
