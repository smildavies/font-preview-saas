'use client'

import { useState } from 'react'

interface ShareViewProps {
  collection: {
    id: string
    name: string
    fonts: string[]
  }
}

interface VoteCounts {
  [fontName: string]: { up: number; down: number; voted?: 'up' | 'down' }
}

export default function ShareView({ collection }: ShareViewProps) {
  const [voterName, setVoterName] = useState('')
  const [votes, setVotes] = useState<VoteCounts>({})
  const [voting, setVoting] = useState<string | null>(null)

  const handleVote = async (fontName: string, vote: 1 | -1) => {
    const direction = vote === 1 ? 'up' : 'down'
    const current = votes[fontName]

    // Prevent double-voting same direction
    if (current?.voted === direction) return

    setVoting(fontName)

    try {
      const res = await fetch('/api/share/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId: collection.id,
          fontName,
          vote,
          voterName: voterName.trim() || undefined,
        }),
      })

      if (res.ok) {
        setVotes(prev => {
          const existing = prev[fontName] ?? { up: 0, down: 0 }
          // If switching vote, undo previous
          const wasUp = existing.voted === 'up'
          const wasDown = existing.voted === 'down'

          return {
            ...prev,
            [fontName]: {
              up: existing.up + (vote === 1 ? 1 : 0) - (wasUp && vote === -1 ? 1 : 0),
              down: existing.down + (vote === -1 ? 1 : 0) - (wasDown && vote === 1 ? 1 : 0),
              voted: direction,
            },
          }
        })
      }
    } catch {
      // silently fail
    }

    setVoting(null)
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-100">{collection.name}</h1>
          </div>
          <p className="text-sm text-zinc-500">
            {collection.fonts.length} font{collection.fonts.length !== 1 ? 's' : ''} to review.
            Vote on your favorites below.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Voter Name */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Your name (optional)
          </label>
          <input
            type="text"
            value={voterName}
            onChange={e => setVoterName(e.target.value)}
            placeholder="Enter your name"
            className="w-full max-w-xs rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 transition"
          />
        </div>

        {/* Font Cards */}
        <div className="space-y-4">
          {collection.fonts.map(fontName => {
            const fontVotes = votes[fontName]
            const isVoting = voting === fontName

            return (
              <div
                key={fontName}
                className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-700 transition"
              >
                {/* Font name */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
                  <span className="text-sm font-semibold text-violet-400">{fontName}</span>
                  {fontVotes?.voted && (
                    <span className="text-xs text-zinc-500">
                      {fontVotes.up} up / {fontVotes.down} down
                    </span>
                  )}
                </div>

                {/* Preview */}
                <div
                  className="px-5 py-8"
                  style={{ fontFamily: `"${fontName}", sans-serif` }}
                >
                  <p className="text-3xl text-zinc-100 mb-3">
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <p className="text-lg text-zinc-400">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
                  </p>
                </div>

                {/* Vote buttons */}
                <div className="flex items-center gap-3 px-5 py-3 border-t border-zinc-800">
                  <button
                    onClick={() => handleVote(fontName, 1)}
                    disabled={isVoting}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                      fontVotes?.voted === 'up'
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                        : 'border border-zinc-700 text-zinc-400 hover:text-emerald-400 hover:border-emerald-600/30 hover:bg-emerald-600/10'
                    } disabled:opacity-50`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48a4.53 4.53 0 01-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                    {fontVotes?.voted ? fontVotes.up : 'Like'}
                  </button>
                  <button
                    onClick={() => handleVote(fontName, -1)}
                    disabled={isVoting}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                      fontVotes?.voted === 'down'
                        ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                        : 'border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-600/30 hover:bg-red-600/10'
                    } disabled:opacity-50`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 001.302-4.665c0-1.194-.232-2.333-.654-3.375M15 12a9 9 0 00-2.861-2.4c-.723-.384-1.35-.956-1.653-1.715A4.498 4.498 0 0110.164 6.2V3a.75.75 0 00-.75-.75A2.25 2.25 0 007.164 4.5c0 1.152.26 2.243.723 3.218.266.558-.107 1.282-.725 1.282H4.036c-1.026 0-1.945.694-2.054 1.715A12.137 12.137 0 001.914 12c0 2.685.882 5.165 2.372 7.168.388.521.987.832 1.605.832H9.52a4.5 4.5 0 001.423-.23l3.114-1.04a4.5 4.5 0 011.423-.23h.952" />
                    </svg>
                    {fontVotes?.voted ? fontVotes.down : 'Dislike'}
                  </button>
                  {isVoting && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-zinc-600">
            Shared via My Font Preview
          </p>
        </div>
      </div>
    </div>
  )
}
