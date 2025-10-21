/**
 * Mock Vehicle Data for Development
 * TODO: Replace with real API calls when backend is ready
 */

export const mockVehicles = [
  {
    id: 1,
    model: "Tesla Model 3",
    type: "sedan",
    price: 45000,
    batteryCapacity: 75,
    range: 350,
    description: "Premium electric sedan with autopilot capabilities",
    stockQuantity: 12,
    dealerId: "dealer1",
    dealerName: "Tesla Center HCMC",
    images: [
      "/src/assets/img/car1.png",
      "/src/assets/img/car2.png",
      "/src/assets/img/car3.png"
    ],
    colorVariants: [
      { id: 1, name: "Pearl White", hex: "#FFFFFF", stock: 5 },
      { id: 2, name: "Midnight Silver", hex: "#2C2C2C", stock: 4 },
      { id: 3, name: "Deep Blue", hex: "#1E3A8A", stock: 3 }
    ],
    specifications: {
      acceleration: "3.1s 0-60mph",
      topSpeed: "162 mph",
      charging: "250 kW Supercharging",
      warranty: "4 years/50,000 miles",
      seats: 5,
      cargo: "15 cu ft"
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z"
  },
  {
    id: 2,
    model: "Tesla Model Y",
    type: "suv",
    price: 55000,
    batteryCapacity: 75,
    range: 330,
    description: "Versatile electric SUV perfect for families",
    stockQuantity: 8,
    dealerId: "dealer1",
    dealerName: "Tesla Center HCMC",
    images: [
      "/src/assets/img/car2.png",
      "/src/assets/img/car3.png",
      "/src/assets/img/car4.png"
    ],
    colorVariants: [
      { id: 4, name: "Pearl White", hex: "#FFFFFF", stock: 3 },
      { id: 5, name: "Midnight Silver", hex: "#2C2C2C", stock: 3 },
      { id: 6, name: "Red Multi-Coat", hex: "#DC2626", stock: 2 }
    ],
    specifications: {
      acceleration: "3.5s 0-60mph",
      topSpeed: "155 mph",
      charging: "250 kW Supercharging",
      warranty: "4 years/50,000 miles",
      seats: 7,
      cargo: "76 cu ft"
    },
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-18T16:20:00Z"
  },
  {
    id: 3,
    model: "BMW i4",
    type: "sedan",
    price: 52000,
    batteryCapacity: 83.9,
    range: 300,
    description: "Luxury electric sedan with BMW's signature driving dynamics",
    stockQuantity: 6,
    dealerId: "dealer2",
    dealerName: "BMW Center District 1",
    images: [
      "/src/assets/img/car3.png",
      "/src/assets/img/car4.png"
    ],
    colorVariants: [
      { id: 7, name: "Alpine White", hex: "#FFFFFF", stock: 2 },
      { id: 8, name: "Jet Black", hex: "#000000", stock: 2 },
      { id: 9, name: "Mineral Grey", hex: "#6B7280", stock: 2 }
    ],
    specifications: {
      acceleration: "5.7s 0-60mph",
      topSpeed: "118 mph",
      charging: "200 kW DC Fast Charging",
      warranty: "4 years/50,000 miles",
      seats: 5,
      cargo: "17 cu ft"
    },
    createdAt: "2024-01-12T11:45:00Z",
    updatedAt: "2024-01-19T13:30:00Z"
  },
  {
    id: 4,
    model: "Audi e-tron GT",
    type: "sedan",
    price: 105000,
    batteryCapacity: 93.4,
    range: 238,
    description: "High-performance electric grand tourer",
    stockQuantity: 3,
    dealerId: "dealer3",
    dealerName: "Audi Center District 2",
    images: [
      "/src/assets/img/car4.png",
      "/src/assets/img/car1.png"
    ],
    colorVariants: [
      { id: 10, name: "Florett Silver", hex: "#C0C0C0", stock: 1 },
      { id: 11, name: "Mythos Black", hex: "#1F2937", stock: 1 },
      { id: 12, name: "Tango Red", hex: "#DC2626", stock: 1 }
    ],
    specifications: {
      acceleration: "3.1s 0-60mph",
      topSpeed: "152 mph",
      charging: "270 kW DC Fast Charging",
      warranty: "4 years/50,000 miles",
      seats: 4,
      cargo: "12 cu ft"
    },
    createdAt: "2024-01-08T14:20:00Z",
    updatedAt: "2024-01-17T10:15:00Z"
  },
  {
    id: 5,
    model: "Mercedes EQS",
    type: "sedan",
    price: 120000,
    batteryCapacity: 107.8,
    range: 350,
    description: "Ultra-luxury electric sedan with cutting-edge technology",
    stockQuantity: 2,
    dealerId: "dealer4",
    dealerName: "Mercedes-Benz Center District 3",
    images: [
      "/src/assets/img/car1.png",
      "/src/assets/img/car2.png"
    ],
    colorVariants: [
      { id: 13, name: "Obsidian Black", hex: "#000000", stock: 1 },
      { id: 14, name: "Diamond White", hex: "#FFFFFF", stock: 1 }
    ],
    specifications: {
      acceleration: "4.3s 0-60mph",
      topSpeed: "130 mph",
      charging: "200 kW DC Fast Charging",
      warranty: "4 years/50,000 miles",
      seats: 5,
      cargo: "22 cu ft"
    },
    createdAt: "2024-01-05T16:30:00Z",
    updatedAt: "2024-01-16T12:45:00Z"
  }
]

export const mockDealers = [
  {
    id: "dealer1",
    name: "Tesla Center HCMC",
    region: "Ho Chi Minh City",
    contact: "0901234567",
    email: "hcmc@tesla.com",
    address: "123 Nguyen Hue, District 1, HCMC"
  },
  {
    id: "dealer2", 
    name: "BMW Center District 1",
    region: "Ho Chi Minh City",
    contact: "0902345678",
    email: "district1@bmw.com",
    address: "456 Le Loi, District 1, HCMC"
  },
  {
    id: "dealer3",
    name: "Audi Center District 2", 
    region: "Ho Chi Minh City",
    contact: "0903456789",
    email: "district2@audi.com",
    address: "789 Dong Khoi, District 2, HCMC"
  },
  {
    id: "dealer4",
    name: "Mercedes-Benz Center District 3",
    region: "Ho Chi Minh City", 
    contact: "0904567890",
    email: "district3@mercedes.com",
    address: "321 Nguyen Van Cu, District 3, HCMC"
  }
]

export const mockVehicleTypes = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "hatchback", label: "Hatchback" },
  { value: "coupe", label: "Coupe" },
  { value: "convertible", label: "Convertible" },
  { value: "truck", label: "Truck" }
]

export const mockVehicleStats = {
  totalVehicles: 31,
  totalValue: 1850000,
  lowStockVehicles: 3,
  topSellingModel: "Tesla Model 3",
  averagePrice: 59677,
  vehiclesByType: {
    sedan: 15,
    suv: 10,
    hatchback: 4,
    coupe: 2
  }
}
