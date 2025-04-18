export type ReplacementPolicy = "LRU" | "FIFO" | "RANDOM"

export class CacheSimulator {
  private cacheSize: number
  private blockSize: number
  private associativity: number
  private numSets: number
  private replacementPolicy: ReplacementPolicy
  private cache: Array<
    Array<{
      valid: boolean
      tag: number
      lastUsed: number // Used for LRU
      loadedAt: number // Used for FIFO
    }>
  >
  private accessCount: number
  private hitCount: number
  private missCount: number

  constructor(
    cacheSize: number,
    blockSize: number,
    associativity: number,
    replacementPolicy: ReplacementPolicy = "LRU",
  ) {
    this.cacheSize = cacheSize
    this.blockSize = blockSize
    this.associativity = associativity
    this.replacementPolicy = replacementPolicy

    // Calculate number of sets
    this.numSets = cacheSize / (blockSize * associativity)

    // Initialize cache structure
    this.cache = this.initializeCache()
    this.accessCount = 0
    this.hitCount = 0
    this.missCount = 0
  }

  private initializeCache() {
    return Array(this.numSets)
      .fill(null)
      .map(() =>
        Array(this.associativity)
          .fill(null)
          .map(() => ({
            valid: false,
            tag: 0,
            lastUsed: 0,
            loadedAt: 0,
          })),
      )
  }

  public reset() {
    this.cache = this.initializeCache()
    this.accessCount = 0
    this.hitCount = 0
    this.missCount = 0
  }

  public setReplacementPolicy(policy: ReplacementPolicy) {
    this.replacementPolicy = policy
  }

  public getReplacementPolicy(): ReplacementPolicy {
    return this.replacementPolicy
  }

  private findBlockToReplace(set: Array<{ valid: boolean; tag: number; lastUsed: number; loadedAt: number }>): number {
    // First, check for any invalid blocks
    for (let i = 0; i < this.associativity; i++) {
      if (!set[i].valid) {
        return i
      }
    }

    // All blocks are valid, use the specified replacement policy
    switch (this.replacementPolicy) {
      case "LRU": {
        // Find the least recently used block
        let lruWay = 0
        let lruCounter = set[0].lastUsed

        for (let i = 1; i < this.associativity; i++) {
          if (set[i].lastUsed < lruCounter) {
            lruCounter = set[i].lastUsed
            lruWay = i
          }
        }
        return lruWay
      }

      case "FIFO": {
        // Find the block that was loaded first
        let fifoWay = 0
        let fifoCounter = set[0].loadedAt

        for (let i = 1; i < this.associativity; i++) {
          if (set[i].loadedAt < fifoCounter) {
            fifoCounter = set[i].loadedAt
            fifoWay = i
          }
        }
        return fifoWay
      }

      case "RANDOM": {
        // Choose a random way
        return Math.floor(Math.random() * this.associativity)
      }

      default:
        // Default to LRU if policy is not recognized
        console.warn(`Unknown replacement policy: ${this.replacementPolicy}, defaulting to LRU`)
        let lruWay = 0
        let lruCounter = set[0].lastUsed

        for (let i = 1; i < this.associativity; i++) {
          if (set[i].lastUsed < lruCounter) {
            lruCounter = set[i].lastUsed
            lruWay = i
          }
        }
        return lruWay
    }
  }

  public accessMemory(address: number, updateCache = true) {
    this.accessCount++

    // Calculate block offset, set index, and tag
    const blockOffsetBits = Math.log2(this.blockSize)
    const setIndexBits = Math.log2(this.numSets)

    const blockOffset = address & ((1 << blockOffsetBits) - 1)
    const setIndex = (address >> blockOffsetBits) & ((1 << setIndexBits) - 1)
    const tag = address >> (blockOffsetBits + setIndexBits)

    // Check if the address is in the cache
    const set = this.cache[setIndex]
    let hit = false
    let wayIndex = -1

    // Look for the tag in the set
    for (let i = 0; i < this.associativity; i++) {
      if (set[i].valid && set[i].tag === tag) {
        hit = true
        wayIndex = i
        break
      }
    }

    if (hit) {
      this.hitCount++
      // Update LRU counter if we're updating the cache and using LRU policy
      if (updateCache && this.replacementPolicy === "LRU") {
        set[wayIndex].lastUsed = this.accessCount
      }
    } else {
      this.missCount++
      if (updateCache) {
        // Find a way to replace based on the replacement policy
        wayIndex = this.findBlockToReplace(set)

        // Replace the block
        set[wayIndex].valid = true
        set[wayIndex].tag = tag

        // Update metadata based on policy
        if (this.replacementPolicy === "LRU" || this.replacementPolicy === "RANDOM") {
          set[wayIndex].lastUsed = this.accessCount
        }

        // Always update loadedAt for FIFO
        set[wayIndex].loadedAt = this.accessCount
      }
    }

    return {
      hit,
      setIndex,
      tag,
      blockOffset,
      wayIndex,
      replacementPolicy: this.replacementPolicy,
    }
  }

  public getCache() {
    return this.cache
  }

  public getNumSets() {
    return this.numSets
  }

  public getAssociativity() {
    return this.associativity
  }

  public getBlockSize() {
    return this.blockSize
  }

  public getCacheSize() {
    return this.cacheSize
  }

  public getBlockOffsetBits() {
    return Math.log2(this.blockSize)
  }

  public getSetIndexBits() {
    return Math.log2(this.numSets)
  }

  public getTagBits() {
    return 32 - this.getBlockOffsetBits() - this.getSetIndexBits()
  }

  public getAccessCount() {
    return this.accessCount
  }

  public getHitCount() {
    return this.hitCount
  }

  public getMissCount() {
    return this.missCount
  }

  public getHitRate() {
    return this.accessCount > 0 ? (this.hitCount / this.accessCount) * 100 : 0
  }

  public getMissRate() {
    return this.accessCount > 0 ? (this.missCount / this.accessCount) * 100 : 0
  }
}
