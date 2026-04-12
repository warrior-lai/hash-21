import { useState } from 'react'
import { useNostr } from './hooks/useNostr'
import { useAuctions } from './hooks/useAuctions'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { AuctionList } from './components/AuctionList'
import { CreateAuctionModal } from './components/CreateAuctionModal'
import { AuctionDetailModal } from './components/AuctionDetailModal'
import './App.css'

function App() {
  const nostr = useNostr()
  const { auctions, loading, showAll, setShowAll, createAuction, placeBid } = useAuctions(nostr)
  const [showCreate, setShowCreate] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState(null)

  return (
    <div className="app">
      <Header 
        nostr={nostr} 
        onCreateClick={() => setShowCreate(true)} 
      />

      <Hero 
        onCreateClick={() => setShowCreate(true)}
        isConnected={!!nostr.user}
      />

      <HowItWorks />

      <AuctionList
        id="subastas"
        auctions={auctions}
        loading={loading}
        showAll={showAll}
        onToggleShowAll={() => setShowAll(!showAll)}
        onSelect={setSelectedAuction}
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
    </div>
  )
}

export default App
