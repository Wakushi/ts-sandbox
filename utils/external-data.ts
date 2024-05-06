import { APPRAISER_REPORT_URI, MW_IMAGE_BASE_URL } from "./constants"
import { Work } from "./types"

export async function getArtistData(artistId: string): Promise<any> {
  console.log(artistId)
  const response = await fetch("https://pricedb.ms.masterworks.io/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "artistDetails",
      variables: {
        artistId: artistId,
      },
      query:
        "query artistDetails($artistId: String, $permalink: String, $artistName: String, $yob: Int) {\n  artist(\n    artistId: $artistId\n    permalink: $permalink\n    artistName: $artistName\n    yob: $yob\n  ) {\n    artistId\n    permalink\n    artistName\n    bio\n    fallbackBio\n    yob\n    yod\n    recordPrice\n    historicalAppreciation\n    worksCount\n    coverImageLink\n    performance {\n      year\n      totalTurnover\n      maxPrice\n      lotsUnsold\n      lotsSold\n      averagePrice\n      __typename\n    }\n    works {\n      permalink\n      workTitle\n      imageLink\n      moic\n      sales {\n        priceUSD\n        date\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",
    }),
  })

  const { data } = await response.json()
  return data.artist
}

export async function getWorkDetails(
  workName: string,
  workId: string
): Promise<any> {
  const url = `${workName.toLowerCase()}-${workId}`
  const response = await fetch("https://pricedb.ms.masterworks.io/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "ArtworkForAdmin",
      variables: {
        url_id: url, // ex: "knotberken-w:038e7b184c25ad9"
      },
      query:
        "query ArtworkForAdmin($url_id: String, $permalink: String) {\n  artwork: work(permalink: $permalink, url_id: $url_id) {\n    permalink\n    artistPermalink\n    workTitle\n    imageLink\n    irr\n    totalReturn\n    notes\n    medium\n    heightCM\n    widthCM\n    spreadsheetId\n    internalNotes\n    sales {\n      date\n      permalink\n      priceUSD\n      lowEstimateUSD\n      highEstimateUSD\n      internalNotes\n      lotNumber\n      notes\n      currency\n      workTitle\n      __typename\n    }\n    moic\n    firstSaleDate\n    lastSaleDate\n    firstSalePrice\n    lastSalePrice\n    __typename\n  }\n}",
    }),
  })

  const { data } = await response.json()
  return data.artwork
}

export async function getArtistSalesData() {
  const response = await fetch("https://pricedb.ms.masterworks.io/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "artworkSalesForArtist",
      variables: {
        permalink: "a:0e9ba2d8c35f528",
        orderBy: {
          field: "moic",
          order: "desc",
        },
        size: 12,
        offset: 0,
      },
      query:
        "query artworkSalesForArtist($permalink: String!, $size: Int, $offset: Int, $orderBy: worksOrder) {\n  artworks: works(\n    permalink: $permalink\n    skip: $offset\n    first: $size\n    orderBy: $orderBy\n  ) {\n    ...ArtworkData\n    __typename\n  }\n}\n\nfragment ArtworkData on Work {\n  permalink\n  url_id\n  workTitle\n  imageLink\n  irr\n  moic\n  firstSaleDate\n  lastSaleDate\n  firstSalePrice\n  lastSalePrice\n  sales {\n    permalink\n    priceUSD\n    lotNumber\n    lowEstimateUSD\n    highEstimateUSD\n    currency\n    date\n    __typename\n  }\n  __typename\n}",
    }),
  })

  const data = await response.json()
  console.log(data)
}

export async function getWorkData(work: Work) {
  const artist = await getArtistData(formatArtistNameMW(work.artist))
  const externalWork = artist.works.find(
    (workMW: any) => workMW.workTitle === work.title
  )
  const { workTitle, permalink } = externalWork
  const marketData = await getWorkDetails(workTitle, permalink)
  return {
    title: marketData.workTitle,
    artist: artist.artistName,
    medium: marketData.medium,
    dimensions: `${marketData.heightCM} x ${marketData.widthCM} cm`,
    firstSaleDate: marketData.firstSaleDate,
    lastSaleDate: marketData.lastSaleDate,
    firstSalePrice: marketData.firstSalePrice,
    lastSalePrice: marketData.lastSalePrice,
    moic: marketData.moic,
    imageURL: `${MW_IMAGE_BASE_URL}${marketData.imageLink}`,
  }
}

/**
 *
 * @returns Appraiser report stored on IPFS
 */
export async function fetchReport(): Promise<any> {
  try {
    const response = await fetch(APPRAISER_REPORT_URI)
    const report = await response.json()
    return report
  } catch (error) {
    console.error(error)
  }
}

export function formatArtistNameMW(artistName: string): string {
  return artistName.split(" ").join("-").toLowerCase()
}
