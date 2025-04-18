import { CacheSimulator, type ReplacementPolicy } from "./cache-simulator"

export class MultiLevelCacheSimulator {
  private levels: CacheSimulator[]
  private levelNames: string[]
  private inclusivePolicy: boolean
  private accessCount: number
  // Add memory size property
  private memorySize: number

  // Update constructor to accept memory size
  constructor(
    configs: Array<{
      size: number
      blockSize: number
      associativity: number
      name: string
      replacementPolicy?: ReplacementPolicy
    }>,
    inclusive = true,
    memorySize = 4294967296, // Default to 4GB
  ) {
    this.levels = configs.map(
      (config) =>
        new CacheSimulator(config.size, config.blockSize, config.associativity, config.replacementPolicy || "LRU"),
    )
    this.levelNames = configs.map((config) => config.name)
    this.inclusivePolicy = inclusive
    this.accessCount = 0
    this.memorySize = memorySize
  }

  // Fix the accessMemory method to properly track access counts for each level
  // and ensure L1 is accessed first, then L2, then L3
  public accessMemory(address: number) {
    this.accessCount++

    const results = []
    let hitLevel = -1 // -1 means miss in all levels (memory access)

    // Try to find the address in each cache level
    // L1 is accessed first (index 0), then L2 (index 1), then L3 (index 2)
    for (let i = 0; i < this.levels.length; i++) {
      // Check if the address is in this cache level
      // We'll manually track the access in the result without updating the cache yet
      const result = this.levels[i].accessMemory(address, false) // Don't update cache yet

      // Store the result
      results.push(result)

      if (result.hit) {
        hitLevel = i
        break // Stop checking further levels if we got a hit
      }
    }

    // Update caches based on the result
    if (hitLevel === -1) {
      // Miss in all levels, fetch from memory
      // Update all cache levels (for inclusive policy) or just the last level (for exclusive)
      const startLevel = this.inclusivePolicy ? 0 : this.levels.length - 1

      for (let i = this.levels.length - 1; i >= startLevel; i--) {
        this.levels[i].accessMemory(address, true) // Update cache
      }
    } else {
      // Hit in some level, update all higher levels for inclusive policy
      if (this.inclusivePolicy) {
        for (let i = 0; i < hitLevel; i++) {
          this.levels[i].accessMemory(address, true) // Update cache
        }
      }
    }

    return {
      address,
      results,
      hitLevel,
      levelNames: this.levelNames,
    }
  }

  public getLevel(index: number) {
    return this.levels[index]
  }

  public getLevels() {
    return this.levels
  }

  public getLevelNames() {
    return this.levelNames
  }

  public getLevelCount() {
    return this.levels.length
  }

  public getInclusivePolicy() {
    return this.inclusivePolicy
  }

  public setInclusivePolicy(inclusive: boolean) {
    this.inclusivePolicy = inclusive
  }

  public getAccessCount() {
    return this.accessCount
  }

  public setReplacementPolicy(levelIndex: number, policy: ReplacementPolicy) {
    if (levelIndex >= 0 && levelIndex < this.levels.length) {
      this.levels[levelIndex].setReplacementPolicy(policy)
    }
  }

  public reset() {
    this.levels.forEach((level) => level.reset())
    this.accessCount = 0
  }

  // Add getter for memory size
  public getMemorySize(): number {
    return this.memorySize
  }

  // Add a method to get the correct access count for each level
  public getLevelAccessCount(levelIndex: number): number {
    if (levelIndex < 0 || levelIndex >= this.levels.length) {
      return 0
    }

    // For L1 (index 0), all memory accesses go through it
    if (levelIndex === 0) {
      return this.accessCount
    }

    // For L2, L3, etc., only accesses that miss in the previous level go through it
    let accessCount = this.accessCount
    for (let i = 0; i < levelIndex; i++) {
      accessCount -= this.levels[i].getHitCount()
    }

    return accessCount
  }
}
