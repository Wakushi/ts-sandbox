import { createClient, getClientByAddress } from "@/utils/firebase-data"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url)
    const clientAddress = url.searchParams.get("clientAddress")
    if (!clientAddress) {
      return NextResponse.json({ error: "Client address is required" })
    }
    const client = await getClientByAddress(clientAddress)
    return NextResponse.json(client)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error })
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json()
    const success = await createClient(body)
    return NextResponse.json(success)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error })
  }
}
