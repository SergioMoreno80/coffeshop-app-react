import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles.css'
import { CafeteriaApp } from './CafeteriaApp'
// import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider>
        <CafeteriaApp />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
