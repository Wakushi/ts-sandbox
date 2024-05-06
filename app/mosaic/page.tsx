"use client"
import Image from "next/image"
import LoaderSmall from "@/components/ui/loader/loader-small"
import { fetchReport, getWorkData } from "@/utils/external-data"
import { clientMock, workMock } from "@/utils/mocks"
import { Client, Work } from "@/utils/types"
import { useState } from "react"

export default function Data() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userInput, setUserInput] = useState<string>("")
  const [workImage, setWorkImage] = useState<string>("")

  async function createClient() {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/client` ?? "",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...clientMock }),
        }
      )
      const success = await response.json()
      if (!success) {
        console.error("Failed to create client")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function createWork() {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/work` ?? "",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientAddress: clientMock.address,
            work: { ...workMock },
          }),
        }
      )
      const data = await response.json()
      console.log("Data: ", data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   *
   * @param clientAddress Ethereum address of the client
   * @returns Client object stored on Firebase
   */
  async function fetchClient(clientAddress: string): Promise<Client | null> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/client?clientAddress=${clientAddress}` ??
          "",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const client = await response.json()
      return client
    } catch (error) {
      console.error(error)
      return null
    }
  }

  /**
   *
   * @param clientAddress Ethereum address of the client
   * @returns Collection of works submitted by a client, stored on Firebase
   */
  async function fetchClientWork(clientAddress: string): Promise<Work[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/work?clientAddress=${clientAddress}` ??
          "",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const works = await response.json()
      return works
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async function fetchAggregateData() {
    setIsLoading(true)
    try {
      const client = await fetchClient(clientMock.address)
      const clientWorks = await fetchClientWork(clientMock.address)
      const clientWork = clientWorks[0]
      const report = await fetchReport()
      const workMarketData = await getWorkData(clientWork)

      // CLIENT DATA
      console.log("Client: ", client)

      // 3 DIFFERENT SOURCES FOR THIS ARTWORK :

      // CLIENT SUBMISSION DATA
      console.log("Client submission: ", clientWork)
      // EXTERNAL MARKET DATA API (Masterworks) DATA
      console.log("workMarketData: ", workMarketData)
      // APPRAISER REPORT
      console.log("Report: ", report)

      setWorkImage(workMarketData.imageURL)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 flex flex-col gap-4 max-w-[600px] m-auto">
      <h1 className="text-3xl mb-4">MOSAIC</h1>
      <h2>Data aggregator algorithm</h2>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="border border-gray-300 text-slate-900 p-2 w-full rounded"
      />
      {isLoading ? (
        <LoaderSmall />
      ) : (
        <div className="flex flex-col gap-4">
          <button
            className="rounded px-6 py-2 bg-cyan-800 text-white font-bold"
            onClick={fetchAggregateData}
          >
            FETCH DATA
          </button>
        </div>
      )}
      {!!workImage && (
        <div>
          <Image
            src={workImage}
            alt="Work Image"
            width={400}
            height={400}
            layout="responsive"
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  )
}
