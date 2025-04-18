"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export function MultiLevelCacheVisualization({ simulator, latestAccess }) {
  const [cacheLevels, setCacheLevels] = useState([])
  const levelNames = simulator.getLevelNames()

  useEffect(() => {
    // Get the current cache state for all levels
    if (simulator) {
      const levels = simulator.getLevels().map((level) => ({
        cache: level.getCache(),
        numSets: level.getNumSets(),
        associativity: level.getAssociativity(),
        replacementPolicy: level.getReplacementPolicy(),
      }))

      setCacheLevels(levels)
    }
  }, [simulator, latestAccess])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-medium text-purple-400">Cache Hierarchy</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-white">
            <div className="w-3 h-3 bg-green-800 border border-green-600 rounded-sm mr-1"></div>
            <span>Valid</span>
          </div>
          <div className="flex items-center text-white">
            <div className="w-3 h-3 bg-gray-700 border border-gray-600 rounded-sm mr-1"></div>
            <span>Invalid</span>
          </div>
          <div className="flex items-center text-white">
            <div className="w-3 h-3 bg-yellow-800 border border-yellow-600 rounded-sm mr-1"></div>
            <span>Last Accessed</span>
          </div>
        </div>
      </div>

      {/* Memory hierarchy diagram */}
      <div className="flex flex-col items-center space-y-1 mb-2">
        <div className="w-32 h-10 flex items-center justify-center border rounded-md bg-blue-900 border-blue-700 text-blue-100">
          CPU
        </div>
        <div className="h-3 w-0.5 bg-gray-600"></div>

        {cacheLevels.map((level, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-48 h-12 flex flex-col items-center justify-center border rounded-md 
              ${
                index === 0
                  ? "bg-green-900 border-green-700 text-green-100"
                  : index === 1
                    ? "bg-yellow-900 border-yellow-700 text-yellow-100"
                    : "bg-orange-900 border-orange-700 text-orange-100"
              }`}
            >
              <div>{levelNames[index]}</div>
              <div className="text-xs">
                ({level.numSets} sets, {level.associativity}-way, {level.replacementPolicy})
              </div>
            </div>
            <div className="h-3 w-0.5 bg-gray-600"></div>
          </div>
        ))}

        <div className="w-64 h-10 flex items-center justify-center border rounded-md bg-red-900 border-red-700 text-red-100">
          Main Memory
        </div>
      </div>

      {/* Cache level details */}
      <div className="space-y-2">
        {cacheLevels.map((level, levelIndex) => {
          // Determine how many sets to display (max 8 for readability)
          const numSets = level.numSets
          const displaySets = Math.min(numSets, 8)
          const skipFactor = Math.ceil(numSets / displaySets)

          // Create an array of sets to display
          const displayedSets = []
          for (let i = 0; i < numSets; i += skipFactor) {
            displayedSets.push({ index: i, data: level.cache[i] })
          }

          // Highlight the set that was last accessed
          const highlightSetIndex =
            latestAccess && latestAccess.results && latestAccess.results[levelIndex]
              ? latestAccess.results[levelIndex].setIndex
              : -1

          return (
            <div key={levelIndex} className="border border-gray-700 rounded-md overflow-hidden">
              <div className="bg-gray-700 p-2 font-medium flex justify-between items-center">
                <span className="text-purple-300">{levelNames[levelIndex]} Sample View</span>
                <span className="text-xs text-gray-300">Policy: {level.replacementPolicy}</span>
              </div>

              <div className="grid grid-cols-[80px_1fr] bg-gray-700 border-b border-gray-600">
                <div className="p-1 text-xs font-medium border-r border-gray-600 text-white">Set Index</div>
                <div className="grid" style={{ gridTemplateColumns: `repeat(${level.associativity}, 1fr)` }}>
                  {Array.from({ length: level.associativity }).map((_, i) => (
                    <div
                      key={i}
                      className="p-1 text-xs font-medium text-center text-white border-r border-gray-600 last:border-r-0"
                    >
                      Way {i}
                    </div>
                  ))}
                </div>
              </div>

              <div className="max-h-[200px] overflow-y-auto">
                {displayedSets.map((set) => {
                  const isHighlighted = set.index === highlightSetIndex

                  return (
                    <div
                      key={set.index}
                      className={`grid grid-cols-[80px_1fr] border-b border-gray-600 last:border-b-0 ${isHighlighted ? "bg-yellow-900" : "bg-gray-800"}`}
                    >
                      <div className="p-1 font-mono text-xs text-white border-r border-gray-600 flex items-center">
                        {set.index}
                        {isHighlighted && (
                          <Badge
                            variant="outline"
                            className="ml-1 bg-yellow-800 text-yellow-200 border-yellow-700 text-xs"
                          >
                            ←
                          </Badge>
                        )}
                      </div>
                      <div className="grid" style={{ gridTemplateColumns: `repeat(${level.associativity}, 1fr)` }}>
                        {set.data &&
                          set.data.map((block, wayIndex) => {
                            const isHighlightedWay =
                              isHighlighted &&
                              latestAccess &&
                              latestAccess.results &&
                              latestAccess.results[levelIndex] &&
                              latestAccess.results[levelIndex].wayIndex === wayIndex

                            return (
                              <div
                                key={wayIndex}
                                className={`p-1 text-xs border-r border-gray-600 last:border-r-0 ${
                                  block.valid ? "bg-green-800" : "bg-gray-700"
                                } ${isHighlightedWay ? "bg-yellow-800 border-yellow-600" : ""}`}
                              >
                                {block.valid ? (
                                  <div className="font-mono text-xs">
                                    <div className="truncate">0x{block.tag.toString(16).toUpperCase()}</div>
                                  </div>
                                ) : (
                                  <div className="text-white text-center">Empty</div>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )
                })}

                {numSets > displaySets && (
                  <div className="p-1 text-center text-xs text-white">
                    Showing {displaySets} of {numSets} sets
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {latestAccess && (
        <div className="p-2 border border-gray-700 rounded-md bg-gray-800">
          <h3 className="font-medium mb-1 text-purple-400">Last Memory Access Flow</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-white">Address:</span>{" "}
              <span className="font-mono text-white">0x{latestAccess.address.toString(16).padStart(8, "0").toUpperCase()}</span>
            </p>

            <div className="space-y-1">
              <p className="font-medium text-white">Cache Hierarchy Results:</p>
              <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-gray-600">
                {latestAccess.results.map((result, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-16 font-medium text-white">{latestAccess.levelNames[index]}:</span>
                    <span
                      className={`font-medium px-2 py-0.5 rounded-md ${
                        result.hit ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"
                      }`}
                    >
                      {result.hit ? "HIT" : "MISS"}
                    </span>
                    {!result.hit && index < latestAccess.results.length - 1 && (
                      <span className="text-white ml-2">→ check {latestAccess.levelNames[index + 1]}</span>
                    )}
                    {!result.hit && index === latestAccess.results.length - 1 && (
                      <span className="text-white ml-2">→ fetch from memory</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="font-medium mt-1 p-2 bg-gray-700 rounded-md text-white">
              Final Result:{" "}
              <span className={latestAccess.hitLevel >= 0 ? "text-green-400" : "text-red-400"}>
                {latestAccess.hitLevel >= 0
                  ? `Hit in ${latestAccess.levelNames[latestAccess.hitLevel]}`
                  : "Miss in all levels (memory access)"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
