import { adminDb } from "@/firebase-admin"
import { Client, Work } from "./types"

export async function createClient(client: Client): Promise<boolean> {
  try {
    const docRef = adminDb.doc(`clients/${client.address}`)
    await docRef.set({
      address: client.address,
      name: client.name,
      email: client.email,
    })
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function getClientByAddress(
  clientAddress: string
): Promise<Client | null> {
  const docRef = adminDb.doc(`clients/${clientAddress}`)
  const docSnap = await docRef.get()
  if (docSnap.exists) {
    return docSnap.data() as Client
  }
  return null
}

export async function getClientWorks(clientAddress: string): Promise<Work[]> {
  try {
    const querySnapshot = await adminDb
      .collection(`clients/${clientAddress}/workSubmissions`)
      .get()
    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Work),
    }))
  } catch (error) {
    console.error("Error fetching client works: ", error)
    return []
  }
}

export async function getClientWorkById(
  clientAddress: string,
  workId: string
): Promise<Work | null> {
  try {
    const docRef = adminDb.doc(
      `clients/${clientAddress}/workSubmissions/${workId}`
    )
    const docSnap = await docRef.get()
    if (docSnap.exists) {
      return docSnap.data() as Work
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching client work: ", error)
    return null
  }
}

export async function createWorkForClient(
  clientAddress: string,
  work: Work
): Promise<boolean> {
  try {
    await adminDb
      .collection(`clients/${clientAddress}/workSubmissions`)
      .add(work)
    return true
  } catch (error) {
    console.error("Error creating work for client: ", error)
    return false
  }
}
