export function MultiLevelSimulationStats({ simulator }) {
  const levels = simulator.getLevels()
  const levelNames = simulator.getLevelNames()
  const inclusivePolicy = simulator.getInclusivePolicy()

  // Get the total access count
  const totalAccesses = simulator.getAccessCount()

  // Calculate total hits across all levels
  const totalHits = levels.reduce((sum, level) => sum + level.getHitCount(), 0)

  // Calculate global hit rate
  const globalHitRate = totalAccesses > 0 ? (totalHits / totalAccesses) * 100 : 0

  // Calculate AMAT (Average Memory Access Time)
  // Assuming: L1 hit time = 1 cycle, L2 hit time = 10 cycles, L3 hit time = 40 cycles, Memory = 200 cycles
  const hitTimes = [1, 10, 40, 200] // Last one is memory access time

  let amat = 0
  if (totalAccesses > 0) {
    // Calculate hit rates at each level (considering only the accesses that reach that level)
    const levelHitRates = []
    let remainingAccesses = totalAccesses

    for (let i = 0; i < levels.length; i++) {
      const level = levels[i]
      const levelHits = level.getHitCount()
      const levelAccesses = simulator.getLevelAccessCount(i)
      const levelHitRate = levelAccesses > 0 ? levelHits / levelAccesses : 0
      levelHitRates.push(levelHitRate)
      remainingAccesses -= levelHits
    }

    // Calculate AMAT
    amat = hitTimes[0] // Start with L1 hit time
    let missProb = 1.0

    for (let i = 0; i < levels.length; i++) {
      // For each level, we need to consider the probability of missing all previous levels
      // and hitting at this level
      if (i > 0) {
        amat += missProb * levelHitRates[i] * hitTimes[i]
      }
      missProb *= 1 - levelHitRates[i]
    }

    // Add memory access time for misses in all levels
    amat += missProb * hitTimes[hitTimes.length - 1]
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="space-y-0">
          <p className="text-sm font-medium text-purple-400">Total Accesses</p>
          <p className="text-2xl font-bold text-white">{totalAccesses}</p>
        </div>
        <div className="space-y-0">
          <p className="text-sm font-medium text-purple-400">Global Hit Rate</p>
          <p className="text-2xl font-bold text-green-400">{globalHitRate.toFixed(2)}%</p>
        </div>
        <div className="space-y-0">
          <p className="text-sm font-medium text-purple-400">Cache Policy</p>
          <p className="text-2xl font-bold text-white">{inclusivePolicy ? "Inclusive" : "Exclusive"}</p>
        </div>
        <div className="space-y-0">
          <p className="text-sm font-medium text-purple-400">Est. AMAT</p>
          <p className="text-2xl font-bold text-white">{amat.toFixed(2)} cycles</p>
        </div>
        {/* Add memory size to the display */}
        <div className="space-y-0">
          <p className="text-sm font-medium text-purple-400">Memory Size</p>
          <p className="text-2xl font-bold text-white">{(simulator.getMemorySize() / (1024 * 1024)).toFixed(0)} MB</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-purple-400">Cache Level Statistics</h3>

        {levels.map((level, index) => {
          // Get the correct access count for this level
          const levelAccesses = simulator.getLevelAccessCount(index)
          const hits = level.getHitCount()
          const misses = levelAccesses - hits
          const hitRate = levelAccesses > 0 ? (hits / levelAccesses) * 100 : 0

          return (
            <div key={index} className="space-y-1 p-2 border border-gray-700 rounded-md bg-gray-800">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-purple-300">{levelNames[index]}</h4>
                <span className="text-sm text-white">
                  {level.getCacheSize() / 1024} KB, {level.getAssociativity()}-way
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-white">Accesses</p>
                  <p className="font-medium text-white">{levelAccesses}</p>
                </div>
                <div>
                  <p className="text-white">Hits</p>
                  <p className="font-medium text-green-400">{hits}</p>
                </div>
                <div>
                  <p className="text-white">Misses</p>
                  <p className="font-medium text-red-400">{misses}</p>
                </div>
              </div>

              <div className="space-y-0">
                <div className="flex justify-between text-white">
                  <span>Hit Rate</span>
                  <span>{hitRate.toFixed(2)}%</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-700">
                  <div className="h-full bg-purple-500 transition-all" style={{ width: `${hitRate}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-2 border border-gray-700 rounded-md bg-gray-800">
        <h3 className="font-medium mb-1 text-purple-400">Memory Hierarchy Performance</h3>
        <p className="text-sm text-white mb-1">
          Average Memory Access Time (AMAT) estimates the average time to access memory through the cache hierarchy.
          Lower values indicate better performance.
        </p>
        <div className="text-sm text-white">
          <p>
            AMAT = Hit time (L1) + Miss rate (L1) × (Hit time (L2) + Miss rate (L2) × (Hit Time (L3) + Miss rate (L3) + Memory Access Time))
          </p>
          <p className="mt-1">
            Estimated AMAT: <span className="font-medium text-white">{amat.toFixed(2)} cycles</span>
          </p>
        </div>
      </div>
    </div>
  )
}
