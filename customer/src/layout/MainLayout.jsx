import Header from '../components/Header/Header'

function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main>{children}</main>
    </div>
  )
}

export default MainLayout
