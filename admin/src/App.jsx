import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import SectionPage from './components/SectionPage'
import { adminSections, pageData } from './adminData'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          {adminSections.map((section) => (
            <Route
              key={section.key}
              path={section.path}
              element={<SectionPage page={pageData[section.key]} />}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App