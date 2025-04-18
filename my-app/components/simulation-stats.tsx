import { Progress } from "@/components/ui/progress"

export function SimulationStats({ stats, config }) {
  const { accesses, hits, misses, hitRate } = stats

  // Calculate additional metrics
  const missRate = accesses > 0 ? 100 - hitRate : 0
  const numSets = config.cacheSize / (config.blockSize * config.associativity)
  const blockOffsetBits = Math.log2(config.blockSize)
  const setIndexBits = Math.log2(numSets)
  const tagBits = 32 - blockOffsetBits - setIndexBits

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Total Accesses</p>
          <p className="text-2xl font-bold">{accesses}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Hit Rate</p>
          <p className="text-2xl font-bold text-green-600">{hitRate.toFixed(2)}%</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Cache Hits</p>
          <p className="text-2xl font-bold text-green-600">{hits}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Cache Misses</p>
          <p className="text-2xl font-bold text-red-600">{misses}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Hit Rate</span>
          <span>{hitRate.toFixed(2)}%</span>
        </div>
        <Progress value={hitRate} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Miss Rate</span>
          <span>{missRate.toFixed(2)}%</span>
        </div>
        <Progress value={missRate} className="h-2" />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white">
        <div className="p-3 border rounded-md bg-gray-50">
          <p className="font-medium">Address Bits</p>
          <div className="mt-2 space-y-1">
            <p>
              Tag: <span className="font-mono">{tagBits} bits</span>
            </p>
            <p>
              Set Index: <span className="font-mono">{setIndexBits} bits</span>
            </p>
            <p>
              Block Offset: <span className="font-mono">{blockOffsetBits} bits</span>
            </p>
          </div>
        </div>

        <div className="p-3 border rounded-md bg-gray-50">
          <p className="font-medium">Cache Organization</p>
          <div className="mt-2 space-y-1">
            <p>
              Sets: <span className="font-mono">{numSets}</span>
            </p>
            <p>
              Ways: <span className="font-mono">{config.associativity}</span>
            </p>
            <p>
              Blocks: <span className="font-mono">{numSets * config.associativity}</span>
            </p>
          </div>
        </div>

        <div className="p-3 border rounded-md bg-gray-50">
          <p className="font-medium">Cache Configuration</p>
          <div className="mt-2 space-y-1">
            <p>
              Total Size: <span className="font-mono">{config.cacheSize} bytes</span>
            </p>
            <p>
              Block Size: <span className="font-mono">{config.blockSize} bytes</span>
            </p>
            <p>
              Type:{" "}
              <span className="font-mono">
                {config.associativity === 1
                  ? "Direct Mapped"
                  : config.associativity === numSets
                    ? "Fully Associative"
                    : `${config.associativity}-Way Set Associative`}
              </span>
            </p>
            <p>
              Policy: <span className="font-mono">{config.replacementPolicy}</span>
            </p>
            <p>
              Memory Size: <span className="font-mono">{(config.memorySize / (1024 * 1024)).toFixed(0)} MB</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
