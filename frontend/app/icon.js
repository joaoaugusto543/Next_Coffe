import { ImageResponse } from 'next/server'
import { imgs } from './api/api'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <img src={`${imgs}/favicon.ico`} alt='favicon' />
    ),
    {
      ...size,
    }
  )
}