// middleware.ts - 简单的边缘验证
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/verify',
}

export default function middleware(request: NextRequest) {
  // 🌍 获取地理位置和边缘信息
  const country = request.headers.get('x-vercel-ip-country')
  const city = request.headers.get('x-vercel-ip-city')
  const edgeRegion = process.env.VERCEL_REGION
  
  console.log(`🎯 访问 /verify: ${country}/${city} -> 边缘节点: ${edgeRegion}`)
  
  return NextResponse.next()
}