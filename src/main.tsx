import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ExpenseManagementApplication from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExpenseManagementApplication />
  </StrictMode>,
)
