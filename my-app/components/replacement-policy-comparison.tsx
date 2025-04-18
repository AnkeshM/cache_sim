"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CacheSimulator } from "./cache-simulator"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function ReplacementPolicyComparison({ config }) {
  const [comparing, setComparing] = useState(false)
  const [results, setResults] = useState(null)
  const [progress, setProgress] = useState(0)

  const runComparison = async () => {
    setComparing(true)
    setProgress(0)

    // Create simulators with different replacement policies but same configuration
    const lruSimulator = new CacheSimulator(config.cacheSize, config.blockSize, config.associativity, "LRU")
    const fifoSimulator = new CacheSimulator(config.cacheSize, config.blockSize, config.associativity, "FIFO")
    const randomSimulator = new CacheSimulator(config.cacheSize, config.blockSize, config.associativity, "RANDOM")

    // Number of memory accesses to simulate
    const totalAccesses = 10000

    // Generate memory access patterns
    // 1. Sequential access
    const sequentialAddresses = Array.from(
      { length: totalAccesses },
      (_, i) => (i * config.blockSize) % config.memorySize,
    )

    // 2. Random access
    const randomAddresses = Array.from({ length: totalAccesses }, () => Math.floor(Math.random() * config.memorySize))

    // 3. Repeated access (locality of reference)
    const repeatedAddresses = []
    const workingSetSize = 1000
    const workingSet = Array.from({ length: workingSetSize }, () => Math.floor(Math.random() * config.memorySize))

    for (let i = 0; i < totalAccesses; i++) {
      // 80% chance to access from working set, 20% chance for a new address
      if (Math.random() < 0.8) {
        repeatedAddresses.push(workingSet[Math.floor(Math.random() * workingSetSize)])
      } else {
        const newAddr = Math.floor(Math.random() * config.memorySize)
        repeatedAddresses.push(newAddr)
        // Replace a random address in the working set
        workingSet[Math.floor(Math.random() * workingSetSize)] = newAddr
      }
    }

    // Run the simulations
    const results = {
      sequential: await runSimulation([lruSimulator, fifoSimulator, randomSimulator], sequentialAddresses, 0, 33),
      random: await runSimulation([lruSimulator, fifoSimulator, randomSimulator], randomAddresses, 33, 66),
      repeated: await runSimulation([lruSimulator, fifoSimulator, randomSimulator], repeatedAddresses, 66, 100),
    }

    // Format results for display
    const formattedResults = [
      {
        name: "Sequential Access",
        LRU: results.sequential[0].hitRate,
        FIFO: results.sequential[1].hitRate,
        RANDOM: results.sequential[2].hitRate,
      },
      {
        name: "Random Access",
        LRU: results.random[0].hitRate,
        FIFO: results.random[1].hitRate,
        RANDOM: results.random[2].hitRate,
      },
      {
        name: "Repeated Access",
        LRU: results.repeated[0].hitRate,
        FIFO: results.repeated[1].hitRate,
        RANDOM: results.repeated[2].hitRate,
      },
    ]

    setResults(formattedResults)
    setComparing(false)
  }

  const runSimulation = async (simulators, addresses, startProgress, endProgress) => {
    // Reset simulators
    simulators.forEach((sim) => sim.reset())

    const results = []
    const batchSize = 500
    const totalBatches = Math.ceil(addresses.length / batchSize)

    for (let batch = 0; batch < totalBatches; batch++) {
      const start = batch * batchSize
      const end = Math.min(start + batchSize, addresses.length)

      // Process this batch of addresses
      for (let i = start; i < end; i++) {
        simulators.forEach((sim) => sim.accessMemory(addresses[i]))
      }

      // Update progress
      const batchProgress = batch / totalBatches
      const overallProgress = startProgress + (endProgress - startProgress) * batchProgress
      setProgress(overallProgress)

      // Allow UI to update
      await new Promise((resolve) => setTimeout(resolve, 0))
    }

    // Collect results
    simulators.forEach((sim) => {
      results.push({
        hitCount: sim.getHitCount(),
        missCount: sim.getMissCount(),
        hitRate: sim.getHitRate(),
        policy: sim.getReplacementPolicy(),
      })
    })

    return results
  }

  return (
    <div className="space-y-4">
      {!comparing && !results && (
        <div className="text-center text-white">
          <p className="mb-4">
            Run a comparison of different replacement policies (LRU, FIFO, Random) using various memory access patterns.
          </p>
          <Button onClick={runComparison}>Start Comparison</Button>
        </div>
      )}

      {comparing && (
        <div className="space-y-2">
          <p className="text-center">Running comparison... This may take a moment.</p>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {results && (
        <div className="space-y-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "Hit Rate (%)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, "Hit Rate"]} />
                <Legend />
                <Bar dataKey="LRU" fill="#8884d8" name="LRU Policy" />
                <Bar dataKey="FIFO" fill="#82ca9d" name="FIFO Policy" />
                <Bar dataKey="RANDOM" fill="#ffc658" name="Random Policy" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Analysis</h3>

            <div className="space-y-2">
              <h4 className="font-medium">Sequential Access</h4>
              <p className="text-sm text-white">
                Sequential access patterns typically show similar performance across all policies because they don't
                benefit from temporal locality.
                {results[0].LRU > results[0].FIFO &&
                  results[0].LRU > results[0].RANDOM &&
                  " However, LRU still performs slightly better in this case."}
                {results[0].FIFO > results[0].LRU &&
                  results[0].FIFO > results[0].RANDOM &&
                  " Interestingly, FIFO performs best here, likely because sequential access naturally works well with first-in-first-out replacement."}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Random Access</h4>
              <p className="text-sm text-white">
                Random access patterns typically show poor performance across all policies due to lack of locality.
                {results[1].LRU > results[1].FIFO &&
                  results[1].LRU > results[1].RANDOM &&
                  " LRU still manages to perform better than other policies even with random access."}
                {Math.abs(results[1].LRU - results[1].FIFO) < 1 &&
                  Math.abs(results[1].LRU - results[1].RANDOM) < 1 &&
                  " All policies perform similarly with random access since there's no locality to exploit."}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Repeated Access (Temporal Locality)</h4>
              <p className="text-sm text-white">
                Repeated access patterns with temporal locality typically favor LRU, which is designed to keep recently
                used items in cache.
                {results[2].LRU > results[2].FIFO &&
                  results[2].LRU > results[2].RANDOM &&
                  " As expected, LRU performs best here because it's designed to exploit temporal locality."}
                {results[2].FIFO > results[2].LRU &&
                  " Surprisingly, FIFO outperforms LRU in this test, which is unusual for workloads with temporal locality."}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Overall Conclusion</h4>
              <p className="text-sm text-white">
                {results[0].LRU + results[1].LRU + results[2].LRU >
                  results[0].FIFO + results[1].FIFO + results[2].FIFO &&
                results[0].LRU + results[1].LRU + results[2].LRU >
                  results[0].RANDOM + results[1].RANDOM + results[2].RANDOM
                  ? "LRU generally provides the best overall performance across different access patterns, which is why it's commonly used in real-world cache implementations."
                  : "Interestingly, in this specific configuration, LRU doesn't show the clear advantage it typically has in real-world scenarios. This might be due to the specific access patterns or cache configuration used in the simulation."}
                {
                  " The Random policy generally performs worst, as expected, since it doesn't consider any usage patterns when making replacement decisions."
                }
              </p>
            </div>
          </div>

          <Button onClick={runComparison}>Run Comparison Again</Button>
        </div>
      )}
    </div>
  )
}
