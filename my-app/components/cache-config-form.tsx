// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"

// export function CacheConfigForm({ config, onChange }) {
//   const [localConfig, setLocalConfig] = useState({
//     ...config,
//     replacementPolicy: config.replacementPolicy || "LRU",
//     memorySize: config.memorySize || 4294967296, // Default to 4GB (2^32 bytes)
//   })

//   const handleChange = (field, value) => {
//     const newConfig = { ...localConfig, [field]: value }

//     // Ensure values are valid
//     if (field === "blockSize") {
//       // Block size must be a power of 2
//       const blockSize = Number.parseInt(value)
//       if (blockSize > 0 && (blockSize & (blockSize - 1)) === 0) {
//         newConfig.blockSize = blockSize
//       }
//     } else if (field === "cacheSize") {
//       // Cache size must be a power of 2
//       const cacheSize = Number.parseInt(value)
//       if (cacheSize > 0 && (cacheSize & (cacheSize - 1)) === 0) {
//         newConfig.cacheSize = cacheSize
//       }
//     } else if (field === "associativity") {
//       // Associativity must be a power of 2
//       const associativity = Number.parseInt(value)
//       if (associativity > 0 && (associativity & (associativity - 1)) === 0) {
//         newConfig.associativity = associativity
//       }
//     } else if (field === "replacementPolicy") {
//       newConfig.replacementPolicy = value
//     } else if (field === "memorySize") {
//       // Memory size must be a power of 2
//       const memorySize = Number.parseInt(value)
//       if (memorySize > 0 && (memorySize & (memorySize - 1)) === 0) {
//         newConfig.memorySize = memorySize
//       }
//     }

//     setLocalConfig(newConfig)
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     // Validate configuration
//     const numSets = localConfig.cacheSize / (localConfig.blockSize * localConfig.associativity)

//     if (numSets < 1 || !Number.isInteger(numSets)) {
//       alert("Invalid configuration. Please ensure cache size / (block size * associativity) is a positive integer.")
//       return
//     }

//     onChange(localConfig)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="cacheSize">Cache Size (bytes)</Label>
//         <Select
//           value={localConfig.cacheSize.toString()}
//           onValueChange={(value) => {
//             if (value === "custom") {
//               // Don't change the value when selecting "custom"
//               return
//             }
//             handleChange("cacheSize", Number.parseInt(value))
//           }}
//         >
//           <SelectTrigger id="cacheSize">
//             <SelectValue placeholder="Select cache size" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="1024">1 KB (1024 bytes)</SelectItem>
//             <SelectItem value="2048">2 KB (2048 bytes)</SelectItem>
//             <SelectItem value="4096">4 KB (4096 bytes)</SelectItem>
//             <SelectItem value="8192">8 KB (8192 bytes)</SelectItem>
//             <SelectItem value="16384">16 KB (16384 bytes)</SelectItem>
//             <SelectItem value="32768">32 KB (32768 bytes)</SelectItem>
//             <SelectItem value="custom">Custom value...</SelectItem>
//           </SelectContent>
//         </Select>
//         {/* Add custom input field that appears when "custom" is selected */}
//         <Input
//           type="number"
//           placeholder="Enter custom cache size (bytes)"
//           className="mt-2"
//           value={localConfig.cacheSize}
//           onChange={(e) => {
//             const value = Number.parseInt(e.target.value)
//             if (!isNaN(value) && value > 0) {
//               handleChange("cacheSize", value)
//             }
//           }}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="blockSize">Block Size (bytes)</Label>
//         <Select
//           value={localConfig.blockSize.toString()}
//           onValueChange={(value) => {
//             if (value === "custom") {
//               // Don't change the value when selecting "custom"
//               return
//             }
//             handleChange("blockSize", Number.parseInt(value))
//           }}
//         >
//           <SelectTrigger id="blockSize">
//             <SelectValue placeholder="Select block size" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="16">16 bytes</SelectItem>
//             <SelectItem value="32">32 bytes</SelectItem>
//             <SelectItem value="64">64 bytes</SelectItem>
//             <SelectItem value="128">128 bytes</SelectItem>
//             <SelectItem value="256">256 bytes</SelectItem>
//             <SelectItem value="custom">Custom value...</SelectItem>
//           </SelectContent>
//         </Select>
//         {/* Add custom input field */}
//         <Input
//           type="number"
//           placeholder="Enter custom block size (bytes)"
//           className="mt-2"
//           value={localConfig.blockSize}
//           onChange={(e) => {
//             const value = Number.parseInt(e.target.value)
//             if (!isNaN(value) && value > 0) {
//               handleChange("blockSize", value)
//             }
//           }}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="associativity">Associativity (ways)</Label>
//         <Select
//           value={localConfig.associativity.toString()}
//           onValueChange={(value) => {
//             if (value === "custom") {
//               // Don't change the value when selecting "custom"
//               return
//             }
//             handleChange("associativity", Number.parseInt(value))
//           }}
//         >
//           <SelectTrigger id="associativity">
//             <SelectValue placeholder="Select associativity" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="1">Direct Mapped (1-way)</SelectItem>
//             <SelectItem value="2">2-way Set Associative</SelectItem>
//             <SelectItem value="4">4-way Set Associative</SelectItem>
//             <SelectItem value="8">8-way Set Associative</SelectItem>
//             <SelectItem value="16">16-way Set Associative</SelectItem>
//             <SelectItem value="custom">Custom value...</SelectItem>
//           </SelectContent>
//         </Select>
//         {/* Add custom input field */}
//         <Input
//           type="number"
//           placeholder="Enter custom associativity"
//           className="mt-2"
//           value={localConfig.associativity}
//           onChange={(e) => {
//             const value = Number.parseInt(e.target.value)
//             if (!isNaN(value) && value > 0) {
//               handleChange("associativity", value)
//             }
//           }}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="replacementPolicy">Replacement Policy</Label>
//         <Select
//           value={localConfig.replacementPolicy}
//           onValueChange={(value) => handleChange("replacementPolicy", value)}
//         >
//           <SelectTrigger id="replacementPolicy">
//             <SelectValue placeholder="Select replacement policy" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="LRU">LRU (Least Recently Used)</SelectItem>
//             <SelectItem value="FIFO">FIFO (First In First Out)</SelectItem>
//             <SelectItem value="RANDOM">Random</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="memorySize">Memory Size (bytes)</Label>
//         <Select
//           value={localConfig.memorySize.toString()}
//           onValueChange={(value) => {
//             if (value === "custom") {
//               // Don't change the value when selecting "custom"
//               return
//             }
//             handleChange("memorySize", Number.parseInt(value))
//           }}
//         >
//           <SelectTrigger id="memorySize">
//             <SelectValue placeholder="Select memory size" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="16777216">16 MB (16,777,216 bytes)</SelectItem>
//             <SelectItem value="33554432">32 MB (33,554,432 bytes)</SelectItem>
//             <SelectItem value="67108864">64 MB (67,108,864 bytes)</SelectItem>
//             <SelectItem value="134217728">128 MB (134,217,728 bytes)</SelectItem>
//             <SelectItem value="268435456">256 MB (268,435,456 bytes)</SelectItem>
//             <SelectItem value="536870912">512 MB (536,870,912 bytes)</SelectItem>
//             <SelectItem value="1073741824">1 GB (1,073,741,824 bytes)</SelectItem>
//             <SelectItem value="2147483648">2 GB (2,147,483,648 bytes)</SelectItem>
//             <SelectItem value="4294967296">4 GB (4,294,967,296 bytes)</SelectItem>
//             <SelectItem value="custom">Custom value...</SelectItem>
//           </SelectContent>
//         </Select>
//         {/* Add custom input field */}
//         <Input
//           type="number"
//           placeholder="Enter custom memory size (bytes)"
//           className="mt-2"
//           value={localConfig.memorySize}
//           onChange={(e) => {
//             const value = Number.parseInt(e.target.value)
//             if (!isNaN(value) && value > 0) {
//               handleChange("memorySize", value)
//             }
//           }}
//         />
//       </div>

//       <div className="pt-2">
//         <Button type="submit" className="w-full">
//           Apply Configuration
//         </Button>
//       </div>

//       <div className="text-sm text-white mt-4">
//         <p>Number of Sets: {localConfig.cacheSize / (localConfig.blockSize * localConfig.associativity)}</p>
//         <p>Total Cache Size: {localConfig.cacheSize} bytes</p>
//         <p>Memory Size: {(localConfig.memorySize / (1024 * 1024)).toFixed(0)} MB</p>
//         <p>Replacement Policy: {localConfig.replacementPolicy}</p>
//       </div>
//     </form>
//   )
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export function CacheConfigForm({ config, onChange }) {
  const [localConfig, setLocalConfig] = useState({
    ...config,
    replacementPolicy: config.replacementPolicy || "LRU",
    memorySize: config.memorySize || 4294967296, // Default to 4GB (2^32 bytes)
  })

  const handleChange = (field, value) => {
    const newConfig = { ...localConfig, [field]: value }

    // Ensure values are valid
    if (field === "blockSize") {
      const blockSize = Number.parseInt(value)
      if (blockSize > 0 && (blockSize & (blockSize - 1)) === 0) {
        newConfig.blockSize = blockSize
      }
    } else if (field === "cacheSize") {
      const cacheSize = Number.parseInt(value)
      if (cacheSize > 0 && (cacheSize & (cacheSize - 1)) === 0) {
        newConfig.cacheSize = cacheSize
      }
    } else if (field === "associativity") {
      const associativity = Number.parseInt(value)
      if (associativity > 0 && (associativity & (associativity - 1)) === 0) {
        newConfig.associativity = associativity
      }
    } else if (field === "replacementPolicy") {
      newConfig.replacementPolicy = value
    } else if (field === "memorySize") {
      const memorySize = Number.parseInt(value)
      if (memorySize > 0 && (memorySize & (memorySize - 1)) === 0) {
        newConfig.memorySize = memorySize
      }
    }

    setLocalConfig(newConfig)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const numSets = localConfig.cacheSize / (localConfig.blockSize * localConfig.associativity)
    if (numSets < 1 || !Number.isInteger(numSets)) {
      alert("Invalid configuration. Please ensure cache size / (block size * associativity) is a positive integer.")
      return
    }

    onChange(localConfig)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div className="space-y-2">
        <Label htmlFor="cacheSize" className="text-white">Cache Size (bytes)</Label>
        <Select
          value={localConfig.cacheSize.toString()}
          onValueChange={(value) => {
            if (value === "custom") return
            handleChange("cacheSize", Number.parseInt(value))
          }}
        >
          <SelectTrigger id="cacheSize" className="text-white">
            <SelectValue placeholder="Select cache size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1024">1 KB (1024 bytes)</SelectItem>
            <SelectItem value="2048">2 KB (2048 bytes)</SelectItem>
            <SelectItem value="4096">4 KB (4096 bytes)</SelectItem>
            <SelectItem value="8192">8 KB (8192 bytes)</SelectItem>
            <SelectItem value="16384">16 KB (16384 bytes)</SelectItem>
            <SelectItem value="32768">32 KB (32768 bytes)</SelectItem>
            <SelectItem value="custom">Custom value...</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Enter custom cache size (bytes)"
          className="mt-2 text-white"
          value={localConfig.cacheSize}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            if (!isNaN(value) && value > 0) {
              handleChange("cacheSize", value)
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blockSize" className="text-white">Block Size (bytes)</Label>
        <Select
          value={localConfig.blockSize.toString()}
          onValueChange={(value) => {
            if (value === "custom") return
            handleChange("blockSize", Number.parseInt(value))
          }}
        >
          <SelectTrigger id="blockSize" className="text-white">
            <SelectValue placeholder="Select block size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="16">16 bytes</SelectItem>
            <SelectItem value="32">32 bytes</SelectItem>
            <SelectItem value="64">64 bytes</SelectItem>
            <SelectItem value="128">128 bytes</SelectItem>
            <SelectItem value="256">256 bytes</SelectItem>
            <SelectItem value="custom">Custom value...</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Enter custom block size (bytes)"
          className="mt-2 text-white"
          value={localConfig.blockSize}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            if (!isNaN(value) && value > 0) {
              handleChange("blockSize", value)
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="associativity" className="text-white">Associativity (ways)</Label>
        <Select
          value={localConfig.associativity.toString()}
          onValueChange={(value) => {
            if (value === "custom") return
            handleChange("associativity", Number.parseInt(value))
          }}
        >
          <SelectTrigger id="associativity" className="text-white">
            <SelectValue placeholder="Select associativity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Direct Mapped (1-way)</SelectItem>
            <SelectItem value="2">2-way Set Associative</SelectItem>
            <SelectItem value="4">4-way Set Associative</SelectItem>
            <SelectItem value="8">8-way Set Associative</SelectItem>
            <SelectItem value="16">16-way Set Associative</SelectItem>
            <SelectItem value="custom">Custom value...</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Enter custom associativity"
          className="mt-2 text-white"
          value={localConfig.associativity}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            if (!isNaN(value) && value > 0) {
              handleChange("associativity", value)
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="replacementPolicy" className="text-white">Replacement Policy</Label>
        <Select
          value={localConfig.replacementPolicy}
          onValueChange={(value) => handleChange("replacementPolicy", value)}
        >
          <SelectTrigger id="replacementPolicy" className="text-white">
            <SelectValue placeholder="Select replacement policy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LRU">LRU (Least Recently Used)</SelectItem>
            <SelectItem value="FIFO">FIFO (First In First Out)</SelectItem>
            <SelectItem value="RANDOM">Random</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="memorySize" className="text-white">Memory Size (bytes)</Label>
        <Select
          value={localConfig.memorySize.toString()}
          onValueChange={(value) => {
            if (value === "custom") return
            handleChange("memorySize", Number.parseInt(value))
          }}
        >
          <SelectTrigger id="memorySize" className="text-white">
            <SelectValue placeholder="Select memory size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="16777216">16 MB</SelectItem>
            <SelectItem value="33554432">32 MB</SelectItem>
            <SelectItem value="67108864">64 MB</SelectItem>
            <SelectItem value="134217728">128 MB</SelectItem>
            <SelectItem value="268435456">256 MB</SelectItem>
            <SelectItem value="536870912">512 MB</SelectItem>
            <SelectItem value="1073741824">1 GB</SelectItem>
            <SelectItem value="2147483648">2 GB</SelectItem>
            <SelectItem value="4294967296">4 GB</SelectItem>
            <SelectItem value="custom">Custom value...</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Enter custom memory size (bytes)"
          className="mt-2 text-white"
          value={localConfig.memorySize}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            if (!isNaN(value) && value > 0) {
              handleChange("memorySize", value)
            }
          }}
        />
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full">
          Apply Configuration
        </Button>
      </div>

      <div className="text-sm text-white mt-4">
        <p>Number of Sets: {localConfig.cacheSize / (localConfig.blockSize * localConfig.associativity)}</p>
        <p>Total Cache Size: {localConfig.cacheSize} bytes</p>
        <p>Memory Size: {(localConfig.memorySize / (1024 * 1024)).toFixed(0)} MB</p>
        <p>Replacement Policy: {localConfig.replacementPolicy}</p>
      </div>
    </form>
  )
}
