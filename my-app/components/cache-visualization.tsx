// "use client"

// import { useEffect, useState } from "react"
// import { Badge } from "@/components/ui/badge"

// export function CacheVisualization({ simulator, config, latestAccess }) {
//   const [cache, setCache] = useState([])

//   useEffect(() => {
//     // Get the current cache state
//     if (simulator) {
//       setCache(simulator.getCache())
//     }
//   }, [simulator, latestAccess])

//   // Determine how many sets to display (max 16 for readability)
//   const numSets = simulator.getNumSets()
//   const displaySets = Math.min(numSets, 16)
//   const skipFactor = Math.ceil(numSets / displaySets)

//   // Create an array of sets to display
//   const displayedSets = []
//   for (let i = 0; i < numSets; i += skipFactor) {
//     displayedSets.push({ index: i, data: cache[i] })
//   }

//   // Highlight the set that was last accessed
//   const highlightSetIndex = latestAccess ? latestAccess.setIndex : -1

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between mb-2">
//         <h3 className="font-medium">Cache Structure ({config.replacementPolicy} Policy)</h3>
//         <div className="flex items-center space-x-4 text-sm">
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm mr-1"></div>
//             <span>Valid</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm mr-1"></div>
//             <span>Invalid</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-sm mr-1"></div>
//             <span>Last Accessed</span>
//           </div>
//         </div>
//       </div>

//       {latestAccess && (
//         <div className="mb-4 p-3 border rounded-md bg-gray-50">
//           <h3 className="font-medium mb-2">Last Access Result</h3>
//           <div className="grid grid-cols-2 gap-2 text-sm">
//             <div>
//               <span className="font-medium">Address:</span>{" "}
//               <span className="font-mono">0x{latestAccess.address.toString(16).padStart(8, "0").toUpperCase()}</span>
//             </div>
//             <div>
//               <span className="font-medium">Result:</span>{" "}
//               <span className={latestAccess.hit ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
//                 {latestAccess.hit ? "HIT" : "MISS"}
//               </span>
//             </div>
//             <div>
//               <span className="font-medium">Set Index:</span> <span className="font-mono">{latestAccess.setIndex}</span>
//             </div>
//             <div>
//               <span className="font-medium">Tag:</span>{" "}
//               <span className="font-mono">0x{latestAccess.tag.toString(16).toUpperCase()}</span>
//             </div>
//             <div>
//               <span className="font-medium">Block Offset:</span>{" "}
//               <span className="font-mono">{latestAccess.blockOffset}</span>
//             </div>
//             <div>
//               <span className="font-medium">Way:</span>{" "}
//               <span className="font-mono">{latestAccess.wayIndex !== undefined ? latestAccess.wayIndex : "N/A"}</span>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="border rounded-md overflow-hidden">
//         <div className="grid grid-cols-[100px_1fr] bg-gray-100 border-b">
//           <div className="p-2 font-medium text-sm border-r">Set Index</div>
//           <div className="grid" style={{ gridTemplateColumns: `repeat(${config.associativity}, 1fr)` }}>
//             {Array.from({ length: config.associativity }).map((_, i) => (
//               <div key={i} className="p-2 font-medium text-sm text-center border-r last:border-r-0">
//                 Way {i}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="max-h-[400px] overflow-y-auto">
//           {displayedSets.map((set) => {
//             const isHighlighted = set.index === highlightSetIndex

//             return (
//               <div
//                 key={set.index}
//                 className={`grid grid-cols-[100px_1fr] border-b last:border-b-0 ${isHighlighted ? "bg-yellow-50" : ""}`}
//               >
//                 <div className="p-2 font-mono text-sm border-r flex items-center">
//                   {set.index}
//                   {isHighlighted && (
//                     <Badge variant="outline" className="ml-1 bg-yellow-100 text-yellow-800 border-yellow-300">
//                       ←
//                     </Badge>
//                   )}
//                 </div>
//                 <div className="grid" style={{ gridTemplateColumns: `repeat(${config.associativity}, 1fr)` }}>
//                   {set.data &&
//                     set.data.map((block, wayIndex) => {
//                       const isHighlightedWay = isHighlighted && latestAccess && latestAccess.wayIndex === wayIndex

//                       return (
//                         <div
//                           key={wayIndex}
//                           className={`p-2 text-sm border-r last:border-r-0 ${
//                             block.valid ? "bg-green-50" : "bg-gray-50"
//                           } ${isHighlightedWay ? "bg-yellow-100 border-yellow-300" : ""}`}
//                         >
//                           {block.valid ? (
//                             <div className="font-mono text-xs">
//                               <div>Tag: 0x{block.tag.toString(16).toUpperCase()}</div>
//                             </div>
//                           ) : (
//                             <div className="text-white text-center">Empty</div>
//                           )}
//                         </div>
//                       )
//                     })}
//                 </div>
//               </div>
//             )
//           })}

//           {numSets > displaySets && (
//             <div className="p-2 text-center text-sm text-gray-500 border-t">
//               Showing {displaySets} of {numSets} sets. Configure a smaller cache to see all sets.
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="text-sm text-gray-500 mt-2">
//         <p>
//           Address Breakdown: Tag ({simulator.getTagBits()} bits) | Set Index ({simulator.getSetIndexBits()} bits) |
//           Block Offset ({simulator.getBlockOffsetBits()} bits)
//         </p>
//         <p>Replacement Policy: {config.replacementPolicy}</p>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export function CacheVisualization({ simulator, config, latestAccess }) {
  const [cache, setCache] = useState([])

  useEffect(() => {
    if (simulator) {
      setCache(simulator.getCache())
    }
  }, [simulator, latestAccess])

  const numSets = simulator.getNumSets()
  const displaySets = Math.min(numSets, 16)
  const skipFactor = Math.ceil(numSets / displaySets)

  const displayedSets = []
  for (let i = 0; i < numSets; i += skipFactor) {
    displayedSets.push({ index: i, data: cache[i] })
  }

  const highlightSetIndex = latestAccess ? latestAccess.setIndex : -1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-white">Cache Structure ({config.replacementPolicy} Policy)</h3>
        <div className="flex items-center space-x-4 text-sm text-white">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm mr-1"></div>
            <span>Valid</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm mr-1"></div>
            <span>Invalid</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-sm mr-1"></div>
            <span>Last Accessed</span>
          </div>
        </div>
      </div>

      {latestAccess && (
        <div className="mb-4 p-3 border rounded-md bg-gray-50 text-white">
          <h3 className="font-medium mb-2">Last Access Result</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Address:</span>{" "}
              <span className="font-mono">0x{latestAccess.address.toString(16).padStart(8, "0").toUpperCase()}</span>
            </div>
            <div>
              <span className="font-medium">Result:</span>{" "}
              <span className={latestAccess.hit ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {latestAccess.hit ? "HIT" : "MISS"}
              </span>
            </div>
            <div>
              <span className="font-medium">Set Index:</span> <span className="font-mono">{latestAccess.setIndex}</span>
            </div>
            <div>
              <span className="font-medium">Tag:</span>{" "}
              <span className="font-mono">0x{latestAccess.tag.toString(16).toUpperCase()}</span>
            </div>
            <div>
              <span className="font-medium">Block Offset:</span>{" "}
              <span className="font-mono">{latestAccess.blockOffset}</span>
            </div>
            <div>
              <span className="font-medium">Way:</span>{" "}
              <span className="font-mono">{latestAccess.wayIndex !== undefined ? latestAccess.wayIndex : "N/A"}</span>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-md overflow-hidden text-white">
        <div className="grid grid-cols-[100px_1fr] bg-gray-100 border-b text-white">
          <div className="p-2 font-medium text-sm border-r">Set Index</div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${config.associativity}, 1fr)` }}>
            {Array.from({ length: config.associativity }).map((_, i) => (
              <div key={i} className="p-2 font-medium text-sm text-center border-r last:border-r-0">
                Way {i}
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {displayedSets.map((set) => {
            const isHighlighted = set.index === highlightSetIndex

            return (
              <div
                key={set.index}
                className={`grid grid-cols-[100px_1fr] border-b last:border-b-0 ${isHighlighted ? "bg-yellow-50" : ""}`}
              >
                <div className="p-2 font-mono text-sm border-r flex items-center text-white">
                  {set.index}
                  {isHighlighted && (
                    <Badge variant="outline" className="ml-1 bg-yellow-100 text-yellow-800 border-yellow-300">
                      ←
                    </Badge>
                  )}
                </div>
                <div className="grid" style={{ gridTemplateColumns: `repeat(${config.associativity}, 1fr)` }}>
                  {set.data &&
                    set.data.map((block, wayIndex) => {
                      const isHighlightedWay = isHighlighted && latestAccess && latestAccess.wayIndex === wayIndex

                      return (
                        <div
                          key={wayIndex}
                          className={`p-2 text-sm border-r last:border-r-0 ${
                            block.valid ? "bg-green-50" : "bg-gray-50"
                          } ${isHighlightedWay ? "bg-yellow-100 border-yellow-300" : ""} text-white`}
                        >
                          {block.valid ? (
                            <div className="font-mono text-xs">
                              <div>Tag: 0x{block.tag.toString(16).toUpperCase()}</div>
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
            <div className="p-2 text-center text-sm text-white border-t">
              Showing {displaySets} of {numSets} sets. Configure a smaller cache to see all sets.
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-white mt-2">
        <p>
          Address Breakdown: Tag ({simulator.getTagBits()} bits) | Set Index ({simulator.getSetIndexBits()} bits) |
          Block Offset ({simulator.getBlockOffsetBits()} bits)
        </p>
        <p>Replacement Policy: {config.replacementPolicy}</p>
      </div>
    </div>
  )
}
