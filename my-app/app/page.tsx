"use client"

import { useState, useEffect } from "react"
import { MultiLevelCacheSimulator } from "@/components/multi-level-cache-simulator"
import { MultiLevelCacheConfigForm } from "@/components/multi-level-cache-config-form"
import { MemoryAccessForm } from "@/components/memory-access-form"
import { MultiLevelSimulationStats } from "@/components/multi-level-simulation-stats"
import { MultiLevelCacheVisualization } from "@/components/multi-level-cache-visualization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReplacementPolicyComparison } from "@/components/replacement-policy-comparison"
import type { ReplacementPolicy } from "./cache-simulator"

export default function CacheSimulatorPage() {
  // Multi-level cache state
  const [multiCacheConfig, setMultiCacheConfig] = useState({
    levels: [
      { name: "L1 Cache", size: 32768, blockSize: 64, associativity: 8, replacementPolicy: "LRU" as ReplacementPolicy },
      {
        name: "L2 Cache",
        size: 262144,
        blockSize: 64,
        associativity: 8,
        replacementPolicy: "LRU" as ReplacementPolicy,
      },
      {
        name: "L3 Cache",
        size: 8388608,
        blockSize: 64,
        associativity: 16,
        replacementPolicy: "LRU" as ReplacementPolicy,
      },
    ],
    inclusivePolicy: true,
    memorySize: 4294967296, // 4GB (2^32 bytes)
  })
  const [multiSimulator, setMultiSimulator] = useState(null)
  const [multiAccessHistory, setMultiAccessHistory] = useState([])

  // Initialize simulator when config changes
  useEffect(() => {
    // Initialize multi-level simulator
    const multiSim = new MultiLevelCacheSimulator(
      multiCacheConfig.levels,
      multiCacheConfig.inclusivePolicy,
      multiCacheConfig.memorySize,
    )
    setMultiSimulator(multiSim)
    setMultiAccessHistory([])
  }, [multiCacheConfig])

  const handleMultiMemoryAccess = (address) => {
    if (!multiSimulator) return

    const result = multiSimulator.accessMemory(address)

    // Add to history
    setMultiAccessHistory(
      [
        {
          address,
          results: result.results,
          hitLevel: result.hitLevel,
          levelNames: result.levelNames,
          timestamp: new Date().toISOString(),
        },
        ...multiAccessHistory,
      ].slice(0, 1000),
    ) // Keep last 1000 accesses

    return result
  }

  const handleMultiRandomAccesses = (count) => {
    const newAccesses = []

    for (let i = 0; i < count; i++) {
      // Generate random address within the configured memory size
      const randomAddress = Math.floor(Math.random() * multiCacheConfig.memorySize)
      const result = multiSimulator.accessMemory(randomAddress)

      // Add to new accesses array
      newAccesses.push({
        address: randomAddress,
        results: result.results,
        hitLevel: result.hitLevel,
        levelNames: result.levelNames,
        timestamp: new Date().toISOString(),
      })
    }

    // Update history with all new accesses
    setMultiAccessHistory([...newAccesses, ...multiAccessHistory].slice(0, 1000)) // Keep last 1000 accesses
  }

  const handleMultiReset = () => {
    if (!multiSimulator) return

    multiSimulator.reset()
    setMultiAccessHistory([])
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto py-4 px-2">
        <h1 className="text-3xl font-bold mb-4 text-center text-purple-400">Cache Memory Simulator</h1>

        <div className="space-y-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400">Cache Hierarchy Configuration</CardTitle>
                <CardDescription className="text-white">Set parameters for each cache level</CardDescription>
              </CardHeader>
              <CardContent>
                <MultiLevelCacheConfigForm config={multiCacheConfig} onChange={setMultiCacheConfig} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400">Hierarchy Statistics</CardTitle>
                <CardDescription className="text-white">Performance metrics for each level</CardDescription>
              </CardHeader>
              <CardContent>{multiSimulator && <MultiLevelSimulationStats simulator={multiSimulator} />}</CardContent>
              <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400">Cache Hierarchy Visualization</CardTitle>
                <CardDescription className="text-white">Visual representation of cache levels</CardDescription>
              </CardHeader>
              <CardContent>
                {multiSimulator && (
                  <MultiLevelCacheVisualization simulator={multiSimulator} latestAccess={multiAccessHistory[0]} />
                )}
              </CardContent>
            </Card>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400">Memory Access</CardTitle>
                <CardDescription className="text-white">Simulate memory operations</CardDescription>
              </CardHeader>
              <CardContent>
                <MemoryAccessForm
                  onAccess={handleMultiMemoryAccess}
                  onRandomAccesses={handleMultiRandomAccesses}
                  onReset={handleMultiReset}
                />
              </CardContent>
            </Card>

            
            <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400">Multi-Level Access History</CardTitle>
              <CardDescription className="text-white">Recent memory accesses through the hierarchy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto text-white">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-gray-800 z-10">
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-4">Address (Hex)</th>
                      <th className="text-left py-2 px-4">Result</th>
                      <th className="text-left py-2 px-4">Hit Level</th>
                      <th className="text-left py-2 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {multiAccessHistory.map((access, index) => {
                      const hitLevelName = access.hitLevel >= 0 ? access.levelNames[access.hitLevel] : "Memory"

                      // Determine background color based on hit level
                      let bgColor = "bg-red-900" // Memory access (miss in all levels)
                      if (access.hitLevel === 0)
                        bgColor = "bg-green-900" // L1 hit
                      else if (access.hitLevel === 1)
                        bgColor = "bg-yellow-900" // L2 hit
                      else if (access.hitLevel === 2) bgColor = "bg-orange-900" // L3 hit

                      return (
                        <tr key={index} className={`border-b border-gray-700 ${bgColor}`}>
                          <td className="py-2 px-4 font-mono">
                            0x{access.address.toString(16).padStart(8, "0").toUpperCase()}
                          </td>
                          <td className="py-2 px-4 font-semibold">{access.hitLevel >= 0 ? "HIT" : "MISS"}</td>
                          <td className="py-2 px-4 font-semibold">{hitLevelName}</td>
                          <td className="py-2 px-4 text-sm text-white">
                            {new Date(access.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      )
                    })}
                    {multiAccessHistory.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-white">
                          No memory accesses yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
           
          </div>

          
        </div>
      </div>
    </div>
  )
}
