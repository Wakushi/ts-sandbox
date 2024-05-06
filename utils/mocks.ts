import { Client, Work } from "./types"

const clientMock: Client = {
  address: "0x35E34708C7361F99041a9b046C72Ea3Fcb29134c",
  name: "Gallery Rambault",
  email: "gallery-rambault@yopmail.com",
}

const workMock: Work = {
  clientAddress: "0x35E34708C7361F99041a9b046C72Ea3Fcb29134c",
  status: "pending",
  createdAt: 1625750400000,
  approvedAt: 1625750400000,
  type: "painting",
  title: "Fleurs dans un verre",
  artist: "Vincent van Gogh",
  year: 1889,
  price: 1000000,
}

export { clientMock, workMock }
