import Header from '@/components/Header'
import AccueilPage from './AccueilPage'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main>
        <AccueilPage />
      </main>
    </div>
  )
}