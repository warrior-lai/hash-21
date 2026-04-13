import { useState } from 'react'
import { useNostr } from './hooks/useNostr'
import { useAuctions } from './hooks/useAuctions'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { CTA } from './components/CTA'
import { AuctionList } from './components/AuctionList'
import { CreateAuctionModal } from './components/CreateAuctionModal'
import { AuctionDetailModal } from './components/AuctionDetailModal'
import { Dashboard } from './components/Dashboard'
import './App.css'

function App() {
  const nostr = useNostr()
  const { auctions, loading, showAll, setShowAll, createAuction, placeBid } = useAuctions(nostr)
  const [showCreate, setShowCreate] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState(null)
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <div className="app">
      <Header 
        nostr={nostr} 
        onCreateClick={() => setShowCreate(true)}
        onDashboardClick={() => setShowDashboard(true)}
      />

      <Hero />

      <AuctionList
        id="subastas"
        auctions={auctions}
        loading={loading}
        showAll={showAll}
        onToggleShowAll={() => setShowAll(!showAll)}
        onSelect={setSelectedAuction}
      />

      <HowItWorks />

      <CTA 
        onCreateClick={() => setShowCreate(true)}
        isConnected={!!nostr.user}
      />

      {showCreate && (
        <CreateAuctionModal
          onClose={() => setShowCreate(false)}
          onCreate={createAuction}
        />
      )}

      {selectedAuction && (
        <AuctionDetailModal
          auction={selectedAuction}
          user={nostr.user}
          onClose={() => setSelectedAuction(null)}
          onBid={placeBid}
        />
      )}

      {showDashboard && nostr.user && (
        <Dashboard
          user={nostr.user}
          auctions={auctions}
          onClose={() => setShowDashboard(false)}
          onCreateClick={() => {
            setShowDashboard(false)
            setShowCreate(true)
          }}
          onAuctionClick={(auction) => {
            setShowDashboard(false)
            setSelectedAuction(auction)
          }}
        />
      )}
    </div>
  )
}

export default App
