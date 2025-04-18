// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Trash2, Plus } from "lucide-react"
// import type { ReplacementPolicy } from "./cache-simulator"
// import { Input } from "@/components/ui/input"

// export function MultiLevelCacheConfigForm({ config, onChange }) {
//   // Add memory size to the local config
//   const [localConfig, setLocalConfig] = useState({
//     ...config,
//     memorySize: config.memorySize || 4294967296, // Default to 4GB (2^32 bytes)
//     levels: config.levels.map((level) => ({
//       ...level,
//       replacementPolicy: level.replacementPolicy || "LRU",
//     })),
//   })

//   // Update the handleLevelChange function to handle non-power-of-2 values
//   const handleLevelChange = (index, field, value) => {
//     const newLevels = [...localConfig.levels]

//     // Update the value without strict power-of-2 validation
//     if (field === "blockSize" || field === "size" || field === "associativity") {
//       const numValue = Number.parseInt(value)
//       if (numValue > 0) {
//         newLevels[index][field] = numValue
//       }
//     } else {
//       newLevels[index][field] = value
//     }

//     const newConfig = { ...localConfig, levels: newLevels }
//     setLocalConfig(newConfig)
//   }

//   // Update the handleMemorySizeChange function to handle non-power-of-2 values
//   const handleMemorySizeChange = (value) => {
//     // Allow any positive integer for memory size
//     const memorySize = Number.parseInt(value)
//     if (memorySize > 0) {
//       setLocalConfig({ ...localConfig, memorySize })
//     }
//   }

//   const handlePolicyChange = (value) => {
//     setLocalConfig({ ...localConfig, inclusivePolicy: value })
//   }

//   const handleAddLevel = () => {
//     const newLevels = [...localConfig.levels]
//     const lastLevel = newLevels[newLevels.length - 1]

//     // Create a new level with larger size than the last one
//     newLevels.push({
//       name: `L${newLevels.length + 1} Cache`,
//       size: lastLevel.size * 4,
//       blockSize: lastLevel.blockSize,
//       associativity: lastLevel.associativity * 2,
//       replacementPolicy: lastLevel.replacementPolicy,
//     })

//     const newConfig = { ...localConfig, levels: newLevels }
//     setLocalConfig(newConfig)
//   }

//   const handleRemoveLevel = (index) => {
//     if (localConfig.levels.length <= 1) {
//       return // Don't remove the last level
//     }

//     const newLevels = [...localConfig.levels]
//     newLevels.splice(index, 1)

//     // Rename levels to maintain L1, L2, etc. naming
//     newLevels.forEach((level, i) => {
//       level.name = `L${i + 1} Cache`
//     })

//     const newConfig = { ...localConfig, levels: newLevels }
//     setLocalConfig(newConfig)
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     // Validate configuration
//     for (const level of localConfig.levels) {
//       const numSets = level.size / (level.blockSize * level.associativity)
//       if (numSets < 1 || !Number.isInteger(numSets)) {
//         alert(
//           `Invalid configuration for ${level.name}. Please ensure size / (block size * associativity) is a positive integer.`,
//         )
//         return
//       }
//     }

//     onChange(localConfig)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {localConfig.levels.map((level, index) => (
//         <div key={index} className="p-4 border rounded-md space-y-4">
//           <div className="flex items-center justify-between">
//             <h3 className="font-medium">{level.name}</h3>
//             <Button
//               type="button"
//               variant="ghost"
//               size="sm"
//               onClick={() => handleRemoveLevel(index)}
//               disabled={localConfig.levels.length <= 1}
//             >
//               <Trash2 className="w-4 h-4" />
//             </Button>
//           </div>

//           {/* Add custom input field */}
//           <div className="space-y-2">
//             <Label htmlFor={`${index}-size`}>Cache Size (bytes)</Label>
//             <Select
//               value={level.size.toString()}
//               onValueChange={(value) => {
//                 if (value === "custom") {
//                   // Don't change the value when selecting "custom"
//                   return
//                 }
//                 handleLevelChange(index, "size", Number.parseInt(value))
//               }}
//             >
//               <SelectTrigger id={`${index}-size`}>
//                 <SelectValue placeholder="Select cache size" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="8192">8 KB (8192 bytes)</SelectItem>
//                 <SelectItem value="16384">16 KB (16384 bytes)</SelectItem>
//                 <SelectItem value="32768">32 KB (32768 bytes)</SelectItem>
//                 <SelectItem value="65536">64 KB (65536 bytes)</SelectItem>
//                 <SelectItem value="131072">128 KB (131072 bytes)</SelectItem>
//                 <SelectItem value="262144">256 KB (262144 bytes)</SelectItem>
//                 <SelectItem value="524288">512 KB (524288 bytes)</SelectItem>
//                 <SelectItem value="1048576">1 MB (1048576 bytes)</SelectItem>
//                 <SelectItem value="2097152">2 MB (2097152 bytes)</SelectItem>
//                 <SelectItem value="4194304">4 MB (4194304 bytes)</SelectItem>
//                 <SelectItem value="8388608">8 MB (8388608 bytes)</SelectItem>
//                 <SelectItem value="custom">Custom value...</SelectItem>
//               </SelectContent>
//             </Select>
//             {/* Add custom input field */}
//             <Input
//               type="number"
//               placeholder="Enter custom cache size (bytes)"
//               className="mt-2"
//               value={level.size}
//               onChange={(e) => {
//                 const value = Number.parseInt(e.target.value)
//                 if (!isNaN(value) && value > 0) {
//                   handleLevelChange(index, "size", value)
//                 }
//               }}
//             />
//           </div>

//           {/* Update the blockSize Select component */}
//           <div className="space-y-2">
//             <Label htmlFor={`${index}-blockSize`}>Block Size (bytes)</Label>
//             <Select
//               value={level.blockSize.toString()}
//               onValueChange={(value) => {
//                 if (value === "custom") {
//                   // Don't change the value when selecting "custom"
//                   return
//                 }
//                 handleLevelChange(index, "blockSize", Number.parseInt(value))
//               }}
//             >
//               <SelectTrigger id={`${index}-blockSize`}>
//                 <SelectValue placeholder="Select block size" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="32">32 bytes</SelectItem>
//                 <SelectItem value="64">64 bytes</SelectItem>
//                 <SelectItem value="128">128 bytes</SelectItem>
//                 <SelectItem value="256">256 bytes</SelectItem>
//                 <SelectItem value="custom">Custom value...</SelectItem>
//               </SelectContent>
//             </Select>
//             {/* Add custom input field */}
//             <Input
//               type="number"
//               placeholder="Enter custom block size (bytes)"
//               className="mt-2"
//               value={level.blockSize}
//               onChange={(e) => {
//                 const value = Number.parseInt(e.target.value)
//                 if (!isNaN(value) && value > 0) {
//                   handleLevelChange(index, "blockSize", value)
//                 }
//               }}
//             />
//           </div>

//           {/* Update the associativity Select component */}
//           <div className="space-y-2">
//             <Label htmlFor={`${index}-associativity`}>Associativity (ways)</Label>
//             <Select
//               value={level.associativity.toString()}
//               onValueChange={(value) => {
//                 if (value === "custom") {
//                   // Don't change the value when selecting "custom"
//                   return
//                 }
//                 handleLevelChange(index, "associativity", Number.parseInt(value))
//               }}
//             >
//               <SelectTrigger id={`${index}-associativity`}>
//                 <SelectValue placeholder="Select associativity" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="1">Direct Mapped (1-way)</SelectItem>
//                 <SelectItem value="2">2-way Set Associative</SelectItem>
//                 <SelectItem value="4">4-way Set Associative</SelectItem>
//                 <SelectItem value="8">8-way Set Associative</SelectItem>
//                 <SelectItem value="16">16-way Set Associative</SelectItem>
//                 <SelectItem value="32">32-way Set Associative</SelectItem>
//                 <SelectItem value="custom">Custom value...</SelectItem>
//               </SelectContent>
//             </Select>
//             {/* Add custom input field */}
//             <Input
//               type="number"
//               placeholder="Enter custom associativity"
//               className="mt-2"
//               value={level.associativity}
//               onChange={(e) => {
//                 const value = Number.parseInt(e.target.value)
//                 if (!isNaN(value) && value > 0) {
//                   handleLevelChange(index, "associativity", value)
//                 }
//               }}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor={`${index}-replacementPolicy`}>Replacement Policy</Label>
//             <Select
//               value={level.replacementPolicy || "LRU"}
//               onValueChange={(value) => handleLevelChange(index, "replacementPolicy", value as ReplacementPolicy)}
//             >
//               <SelectTrigger id={`${index}-replacementPolicy`}>
//                 <SelectValue placeholder="Select replacement policy" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="LRU">LRU (Least Recently Used)</SelectItem>
//                 <SelectItem value="FIFO">FIFO (First In First Out)</SelectItem>
//                 <SelectItem value="RANDOM">Random</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="text-sm text-white">
//             <p>Number of Sets: {level.size / (level.blockSize * level.associativity)}</p>
//           </div>
//         </div>
//       ))}

//       <Button type="button" variant="outline" className="w-full" onClick={handleAddLevel}>
//         <Plus className="w-4 h-4 mr-2" /> Add Cache Level
//       </Button>

//       {/* Update the memory size Select component */}
//       <div className="space-y-2 mt-4">
//         <Label htmlFor="memorySize">Memory Size (bytes)</Label>
//         <Select
//           value={localConfig.memorySize.toString()}
//           onValueChange={(value) => {
//             if (value === "custom") {
//               // Don't change the value when selecting "custom"
//               return
//             }
//             handleMemorySizeChange(value)
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
//               handleMemorySizeChange(value)
//             }
//           }}
//         />
//       </div>

//       <div className="flex items-center space-x-2">
//         <Switch id="inclusive-policy" checked={localConfig.inclusivePolicy} onCheckedChange={handlePolicyChange} />
//         <Label htmlFor="inclusive-policy">Inclusive Cache Policy</Label>
//       </div>

//       <div className="text-sm text-white">
//         <p>
//           <strong>Inclusive Policy:</strong> When enabled, all data in lower-level caches (L2, L3) will also be present
//           in higher-level caches (L1). When disabled, each cache level stores unique data (exclusive policy).
//         </p>
//       </div>

//       <div className="pt-2">
//         <Button type="submit" className="w-full">
//           Apply Configuration
//         </Button>
//       </div>
//     </form>
//   )
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus } from "lucide-react"
import type { ReplacementPolicy } from "./cache-simulator"
import { Input } from "@/components/ui/input"

export function MultiLevelCacheConfigForm({ config, onChange }) {
  const [localConfig, setLocalConfig] = useState({
    ...config,
    memorySize: config.memorySize || 4294967296,
    levels: config.levels.map((level) => ({
      ...level,
      replacementPolicy: level.replacementPolicy || "LRU",
    })),
  })

  const handleLevelChange = (index, field, value) => {
    const newLevels = [...localConfig.levels]
    if (field === "blockSize" || field === "size" || field === "associativity") {
      const numValue = Number.parseInt(value)
      if (numValue > 0) {
        newLevels[index][field] = numValue
      }
    } else {
      newLevels[index][field] = value
    }

    const newConfig = { ...localConfig, levels: newLevels }
    setLocalConfig(newConfig)
  }

  const handleMemorySizeChange = (value) => {
    const memorySize = Number.parseInt(value)
    if (memorySize > 0) {
      setLocalConfig({ ...localConfig, memorySize })
    }
  }

  const handlePolicyChange = (value) => {
    setLocalConfig({ ...localConfig, inclusivePolicy: value })
  }

  const handleAddLevel = () => {
    const newLevels = [...localConfig.levels]
    const lastLevel = newLevels[newLevels.length - 1]
    newLevels.push({
      name: `L${newLevels.length + 1} Cache`,
      size: lastLevel.size * 4,
      blockSize: lastLevel.blockSize,
      associativity: lastLevel.associativity * 2,
      replacementPolicy: lastLevel.replacementPolicy,
    })
    const newConfig = { ...localConfig, levels: newLevels }
    setLocalConfig(newConfig)
  }

  const handleRemoveLevel = (index) => {
    if (localConfig.levels.length <= 1) return
    const newLevels = [...localConfig.levels]
    newLevels.splice(index, 1)
    newLevels.forEach((level, i) => {
      level.name = `L${i + 1} Cache`
    })
    const newConfig = { ...localConfig, levels: newLevels }
    setLocalConfig(newConfig)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    for (const level of localConfig.levels) {
      const numSets = level.size / (level.blockSize * level.associativity)
      if (numSets < 1 || !Number.isInteger(numSets)) {
        alert(
          `Invalid configuration for ${level.name}. Please ensure size / (block size * associativity) is a positive integer.`,
        )
        return
      }
    }
    onChange(localConfig)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      {localConfig.levels.map((level, index) => (
        <div key={index} className="p-4 border rounded-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white">{level.name}</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveLevel(index)}
              disabled={localConfig.levels.length <= 1}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${index}-size`} className="text-white">Cache Size (bytes)</Label>
            <Select
              value={level.size.toString()}
              onValueChange={(value) => {
                if (value !== "custom") {
                  handleLevelChange(index, "size", Number.parseInt(value))
                }
              }}
            >
              <SelectTrigger id={`${index}-size`} className="text-black">
                <SelectValue placeholder="Select cache size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8192">8 KB (8192 bytes)</SelectItem>
                <SelectItem value="16384">16 KB (16384 bytes)</SelectItem>
                <SelectItem value="32768">32 KB (32768 bytes)</SelectItem>
                <SelectItem value="65536">64 KB (65536 bytes)</SelectItem>
                <SelectItem value="131072">128 KB (131072 bytes)</SelectItem>
                <SelectItem value="262144">256 KB (262144 bytes)</SelectItem>
                <SelectItem value="524288">512 KB (524288 bytes)</SelectItem>
                <SelectItem value="1048576">1 MB (1048576 bytes)</SelectItem>
                <SelectItem value="2097152">2 MB (2097152 bytes)</SelectItem>
                <SelectItem value="4194304">4 MB (4194304 bytes)</SelectItem>
                <SelectItem value="8388608">8 MB (8388608 bytes)</SelectItem>
                <SelectItem value="custom">Custom value...</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Enter custom cache size (bytes)"
              className="mt-2 text-black"
              value={level.size}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value)
                if (!isNaN(value) && value > 0) {
                  handleLevelChange(index, "size", value)
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${index}-blockSize`} className="text-white">Block Size (bytes)</Label>
            <Select
              value={level.blockSize.toString()}
              onValueChange={(value) => {
                if (value !== "custom") {
                  handleLevelChange(index, "blockSize", Number.parseInt(value))
                }
              }}
            >
              <SelectTrigger id={`${index}-blockSize`} className="text-black">
                <SelectValue placeholder="Select block size" />
              </SelectTrigger>
              <SelectContent>
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
              className="mt-2 text-black"
              value={level.blockSize}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value)
                if (!isNaN(value) && value > 0) {
                  handleLevelChange(index, "blockSize", value)
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${index}-associativity`} className="text-white">Associativity (ways)</Label>
            <Select
              value={level.associativity.toString()}
              onValueChange={(value) => {
                if (value !== "custom") {
                  handleLevelChange(index, "associativity", Number.parseInt(value))
                }
              }}
            >
              <SelectTrigger id={`${index}-associativity`} className="text-black">
                <SelectValue placeholder="Select associativity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Direct Mapped (1-way)</SelectItem>
                <SelectItem value="2">2-way Set Associative</SelectItem>
                <SelectItem value="4">4-way Set Associative</SelectItem>
                <SelectItem value="8">8-way Set Associative</SelectItem>
                <SelectItem value="16">16-way Set Associative</SelectItem>
                <SelectItem value="32">32-way Set Associative</SelectItem>
                <SelectItem value="custom">Custom value...</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Enter custom associativity"
              className="mt-2 text-black"
              value={level.associativity}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value)
                if (!isNaN(value) && value > 0) {
                  handleLevelChange(index, "associativity", value)
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${index}-replacementPolicy`} className="text-white">Replacement Policy</Label>
            <Select
              value={level.replacementPolicy || "LRU"}
              onValueChange={(value) => handleLevelChange(index, "replacementPolicy", value as ReplacementPolicy)}
            >
              <SelectTrigger id={`${index}-replacementPolicy`} className="text-black">
                <SelectValue placeholder="Select replacement policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LRU">LRU (Least Recently Used)</SelectItem>
                <SelectItem value="FIFO">FIFO (First In First Out)</SelectItem>
                <SelectItem value="RANDOM">Random</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-white">
            <p>Number of Sets: {level.size / (level.blockSize * level.associativity)}</p>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" className="w-full text-black" onClick={handleAddLevel}>
        <Plus className="w-4 h-4 mr-2 text-black" /> Add Cache Level
      </Button>

      <div className="space-y-2 mt-4">
        <Label htmlFor="memorySize" className="text-white">Memory Size (bytes)</Label>
        <Select
          value={localConfig.memorySize.toString()}
          onValueChange={(value) => {
            if (value !== "custom") {
              handleMemorySizeChange(value)
            }
          }}
        >
          <SelectTrigger id="memorySize" className="text-black">
            <SelectValue placeholder="Select memory size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="16777216">16 MB (16,777,216 bytes)</SelectItem>
            <SelectItem value="33554432">32 MB (33,554,432 bytes)</SelectItem>
            <SelectItem value="67108864">64 MB (67,108,864 bytes)</SelectItem>
            <SelectItem value="134217728">128 MB (134,217,728 bytes)</SelectItem>
            <SelectItem value="268435456">256 MB (268,435,456 bytes)</SelectItem>
            <SelectItem value="536870912">512 MB (536,870,912 bytes)</SelectItem>
            <SelectItem value="1073741824">1 GB (1,073,741,824 bytes)</SelectItem>
            <SelectItem value="2147483648">2 GB (2,147,483,648 bytes)</SelectItem>
            <SelectItem value="4294967296">4 GB (4,294,967,296 bytes)</SelectItem>
            <SelectItem value="custom">Custom value...</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Enter custom memory size (bytes)"
          className="mt-2 text-black"
          value={localConfig.memorySize}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            if (!isNaN(value) && value > 0) {
              handleMemorySizeChange(value)
            }
          }}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="inclusive-policy" checked={localConfig.inclusivePolicy} onCheckedChange={handlePolicyChange} />
        <Label htmlFor="inclusive-policy" className="text-white">Inclusive Cache Policy</Label>
      </div>

      <div className="text-sm text-white">
        <p>
          <strong>Inclusive Policy:</strong> When enabled, all data in lower-level caches (L2, L3) will also be present
          in higher-level caches (L1). When disabled, each cache level stores unique data (exclusive policy).
        </p>
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full">
          Apply Configuration
        </Button>
      </div>
    </form>
  )
}
