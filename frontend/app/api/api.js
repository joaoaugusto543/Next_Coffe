export const baseUrl='http://localhost:5000'

export const imgs=`http://localhost:5000/imgs`

export const fetcher=(url)=>fetch(url).then((res)=>res.json())

