import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Menu, X, BrainCircuit } from 'lucide-react'
import { useLocalStorage } from './hooks/use-local-storage'
import { cn } from './lib/utils'
import { Button } from './components/ui/button'
import { AnagramSolver, type AnagramData } from './components/AnagramSolver'
import { ThemeToggle } from './components/theme-toggle'

function App() {
  const [anagrams, setAnagrams] = useLocalStorage<AnagramData[]>('anagram-helper-data', [])
  // Initialize state based on URL and storage
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search)
    const nameFromUrl = params.get('name')
    if (nameFromUrl) {
      const found = anagrams.find(a => a.name === nameFromUrl)
      return found ? found.id : null
    }
    return null
  })

  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    if (window.innerWidth < 768) {
      // On mobile, if we have a selected ID (from URL), start closed
      const params = new URLSearchParams(window.location.search)
      const nameFromUrl = params.get('name')
      const found = anagrams.find(a => a.name === nameFromUrl)
      return !found // Open if not found, Closed if found
    }
    return true // Always open on desktop (or default)
  })

  // Handle URL "Not Found" case on mount if needed, or just let the render handle it.
  // We still need to listen to popstate if we supported back/forward properly, but for now just sync state->URL.

  /* 
     Effect to clear URL if selectedId becomes null (e.g. deleted or deselected manually) 
     or update it if it changes.
  */
  useEffect(() => {
    // ... existing sync logic ...
  }, [selectedId, anagrams])

  // Update URL when selection or name changes
  useEffect(() => {
    const selected = anagrams.find(a => a.id === selectedId)
    const url = new URL(window.location.href)

    if (selected) {
      url.searchParams.set('name', selected.name)
      window.history.replaceState({}, '', url)
    } else {
      url.searchParams.delete('name')
      window.history.replaceState({}, '', url)
    }
  }, [selectedId, anagrams])

  const createNewAnagram = () => {
    const newAnagram: AnagramData = {
      id: crypto.randomUUID(),
      name: `Anagram ${anagrams.length + 1}`,
      length: 5,
      knownLetters: {}, // Map<index, char>
      pool: '',
      createdAt: Date.now()
    }
    setAnagrams([...anagrams, newAnagram])
    setSelectedId(newAnagram.id)
    // On mobile, close sidebar after creating use effect will handle URL loop? 
    // Actually the logic above for window.history.replaceState is fine.
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  const deleteAnagram = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const newAnagrams = anagrams.filter(a => a.id !== id)
    setAnagrams(newAnagrams)
    if (selectedId === id) {
      // If deleting the selected one, clear selection (which clears URL via effect)
      setSelectedId(null)
      setSidebarOpen(true)
    }
  }

  const updateCurrentAnagram = (updates: Partial<AnagramData>) => {
    setAnagrams(anagrams.map(a =>
      a.id === selectedId ? { ...a, ...updates } : a
    ))
  }

  const selectedAnagram = anagrams.find(a => a.id === selectedId)

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card/50 backdrop-blur-xl border-r border-white/5 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-3 px-2 mb-8 mt-2">
            <div className="p-2 bg-primary/20 rounded-xl">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Anagram<span className="text-primary">Helper</span></h1>
          </div>

          <Button onClick={createNewAnagram} className="w-full mb-6 bg-gradient-to-r from-primary to-purple-600 border-0">
            <Plus className="w-4 h-4 mr-2" /> New Anagram
          </Button>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {anagrams.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-10">
                No saved anagrams.<br />Create one to get started!
              </div>
            )}
            {anagrams.map(anagram => (
              <div
                key={anagram.id}
                onClick={() => setSelectedId(anagram.id)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border",
                  selectedId === anagram.id
                    ? "bg-primary/20 border-primary/50 shadow-[0_0_15px_-5px_var(--primary)]"
                    : "border-transparent hover:bg-white/10 hover:border-white/10"
                )}
              >
                <div className="flex flex-col truncate flex-1 min-w-0 mr-3">
                  <span className={cn("font-medium truncate transition-colors", selectedId === anagram.id ? "text-primary-foreground font-bold" : "text-foreground/80")}>
                    {anagram.name}
                  </span>
                  <span className={cn("text-xs transition-colors", selectedId === anagram.id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {Object.keys(anagram.knownLetters || {}).length} known • {anagram.length} letters
                  </span>
                </div>

                {selectedId === anagram.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground mr-2 animate-pulse" />
                )}

                <button
                  onClick={(e) => deleteAnagram(e, anagram.id)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    selectedId === anagram.id
                      ? "text-primary-foreground/70 hover:bg-black/20 hover:text-white"
                      : "opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive text-muted-foreground"
                  )}
                  title="Delete Anagram"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto w-full">
            {selectedAnagram ? (
              <AnagramSolver
                key={selectedAnagram.id} // Reset state on switch
                data={selectedAnagram}
                onUpdate={updateCurrentAnagram}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4">
                <BrainCircuit className="w-24 h-24" />
                <p className="text-xl">Select or create an anagram to begin</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
