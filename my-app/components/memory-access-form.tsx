// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// export function MemoryAccessForm({ onAccess, onRandomAccesses, onReset }) {
//   const [address, setAddress] = useState("")
//   const [addressFormat, setAddressFormat] = useState("hex")
//   const [randomCount, setRandomCount] = useState(10)
//   const [accessResult, setAccessResult] = useState(null)

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     try {
//       // Parse address based on format
//       let parsedAddress
//       if (addressFormat === "hex") {
//         parsedAddress = Number.parseInt(address, 16)
//       } else {
//         parsedAddress = Number.parseInt(address, 10)
//       }

//       if (isNaN(parsedAddress)) {
//         throw new Error("Invalid address format")
//       }

//       // Perform memory access
//       const result = onAccess(parsedAddress)
//       setAccessResult(result)

//       // Clear input
//       setAddress("")
//     } catch (error) {
//       alert(`Error: ${error.message}`)
//     }
//   }

//   const handleRandomAccess = () => {
//     onRandomAccesses(randomCount)
//   }

//   return (
//     <div className="space-y-4">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="flex space-x-2">
//           <div className="flex-1 space-y-2 text-white">
//             <Label htmlFor="address">Memory Address</Label>
//             <Input
//               id="address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               placeholder={addressFormat === "hex" ? "0x1234ABCD" : "305441741"}
//               className="font-mono"
//             />
//           </div>
//           <div className="w-24 space-y-2">
//             <Label htmlFor="format" className = "text-white">Format</Label>
//             <Select value={addressFormat} onValueChange={setAddressFormat}>
//               <SelectTrigger id="format">
//                 <SelectValue placeholder="Format" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="hex">Hex</SelectItem>
//                 <SelectItem value="dec">Dec</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <Button type="submit" className="w-full">
//           Access Memory
//         </Button>
//       </form>

//       <div className="space-y-2">
//         <Label htmlFor="randomCount" className="text-white">Random Accesses</Label>
//         <div className="flex space-x-2">
//           <Select
//             value={randomCount.toString()}
//             onValueChange={(value) => {
//               if (value === "custom") {
//                 // Don't change the value when selecting "custom"
//                 return
//               }
//               setRandomCount(Number.parseInt(value))
//             }}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Number of accesses" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="10">10 accesses</SelectItem>
//               <SelectItem value="50">50 accesses</SelectItem>
//               <SelectItem value="100">100 accesses</SelectItem>
//               <SelectItem value="500">500 accesses</SelectItem>
//               <SelectItem value="1000">1000 accesses</SelectItem>
//               <SelectItem value="custom">Custom value...</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button onClick={handleRandomAccess}>Generate</Button>
//         </div>
//         {/* Add custom input field */}
//         <Input
//           id="customRandomCount"
//           type="number"
//           min="1"
//           max="10000"
//           placeholder="Enter custom number of accesses"
//           className="mt-2"
//           value={randomCount}
//           onChange={(e) => {
//             const value = Number.parseInt(e.target.value)
//             if (!isNaN(value) && value > 0) {
//               setRandomCount(value)
//             }
//           }}
//         />
//       </div>

//       <Button variant="outline" onClick={onReset} className="w-full">
//         Reset Simulation
//       </Button>

//       {accessResult && (
//         <div className="mt-4 p-3 border rounded-md bg-gray-50">
//           <h3 className="font-semibold mb-2">Last Access Result:</h3>
//           <div className="grid grid-cols-2 gap-2 text-sm">
//             <div>
//               <span className="font-medium">Address:</span>{" "}
//               <span className="font-mono">0x{accessResult.address.toString(16).padStart(8, "0").toUpperCase()}</span>
//             </div>
//             <div>
//               <span className="font-medium">Result:</span>{" "}
//               <span className={accessResult.hit ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
//                 {accessResult.hit ? "HIT" : "MISS"}
//               </span>
//             </div>
//             <div>
//               <span className="font-medium">Set Index:</span> <span className="font-mono">{accessResult.setIndex}</span>
//             </div>
//             <div>
//               <span className="font-medium">Tag:</span>{" "}
//               <span className="font-mono">0x{accessResult.tag.toString(16).toUpperCase()}</span>
//             </div>
//             <div>
//               <span className="font-medium">Block Offset:</span>{" "}
//               <span className="font-mono">{accessResult.blockOffset}</span>
//             </div>
//             <div>
//               <span className="font-medium">Way:</span>{" "}
//               <span className="font-mono">{accessResult.wayIndex !== undefined ? accessResult.wayIndex : "N/A"}</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function MemoryAccessForm({ onAccess, onRandomAccesses, onReset }) {
  const [address, setAddress] = useState("")
  const [addressFormat, setAddressFormat] = useState("hex")
  const [randomCount, setRandomCount] = useState(10)
  const [accessResult, setAccessResult] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    try {
      let parsedAddress
      if (addressFormat === "hex") {
        parsedAddress = Number.parseInt(address, 16)
      } else {
        parsedAddress = Number.parseInt(address, 10)
      }

      if (isNaN(parsedAddress)) {
        throw new Error("Invalid address format")
      }

      const result = onAccess(parsedAddress)
      console.log("Memory Access Result:", result)
      setAccessResult(result)
      setAddress("")
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const handleRandomAccess = () => {
    onRandomAccesses(randomCount)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1 space-y-2 text-white">
            <Label htmlFor="address">Memory Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={
                addressFormat === "hex" ? "0x1234ABCD" : "305441741"
              }
              className="font-mono"
            />
          </div>
          <div className="w-24 space-y-2">
            <Label htmlFor="format" className="text-white">
              Format
            </Label>
            <Select value={addressFormat} onValueChange={setAddressFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hex">Hex</SelectItem>
                <SelectItem value="dec">Dec</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Access Memory
        </Button>
      </form>

      <div className="space-y-2">
        <Label htmlFor="randomCount" className="text-white">
          Random Accesses
        </Label>
        <div className="flex space-x-2">
          <Select
            value={randomCount.toString()}
            onValueChange={(value) => {
              if (value === "custom") return
              setRandomCount(Number.parseInt(value))
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Number of accesses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 accesses</SelectItem>
              <SelectItem value="50">50 accesses</SelectItem>
              <SelectItem value="100">100 accesses</SelectItem>
              <SelectItem value="500">500 accesses</SelectItem>
              <SelectItem value="1000">1000 accesses</SelectItem>
              <SelectItem value="custom">Custom value...</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRandomAccess}>Generate</Button>
        </div>
        <Input
          id="customRandomCount"
          type="number"
          min="1"
          max="10000"
          placeholder="Enter custom number of accesses"
          className="mt-2"
          value={randomCount}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            if (!isNaN(value) && value > 0) {
              setRandomCount(value)
            }
          }}
        />
      </div>

      <Button variant="outline" onClick={onReset} className="w-full">
        Reset Simulation
      </Button>
    </div>
  )
}
