export type Client = {
  address: string // Wallet address
  name: string // Name of the client
  email: string // Email of the client
}

export type Work = {
  clientAddress: string
  status: "pending" | "approved" | "rejected"
  createdAt: number
  approvedAt: number
  type: string
  title: string
  artist: string
  year: number
  price: number
}
