import {
  createWorkForClient,
  getClientWorkById,
  getClientWorks,
} from "@/utils/firebase-data"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url)
    const clientAddress = url.searchParams.get("clientAddress")
    const workId = url.searchParams.get("workId")
    if (!clientAddress) {
      return NextResponse.json({ error: "Client address is required" })
    }
    if (workId) {
      const work = await getClientWorkById(clientAddress, workId)
      return NextResponse.json(work)
    } else {
      const workSubmissions = await getClientWorks(clientAddress)
      return NextResponse.json(workSubmissions)
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error })
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json()
    const success = await createWorkForClient(body.clientAddress, body.work)
    return NextResponse.json(success)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error })
  }
}
