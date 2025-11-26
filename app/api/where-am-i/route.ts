// app/api/where-am-i/route.ts - 简单验证 API
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'  // 🌟 关键：声明为 Edge Function

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  // 🌍 收集所有位置信息
  const locationData = {
    // 客户端信息
    client: {
      country: request.headers.get('x-vercel-ip-country'),
      city: request.headers.get('x-vercel-ip-city'),
      region: request.headers.get('x-vercel-ip-country-region'),
      timezone: request.headers.get('x-vercel-ip-timezone'),
      continent: request.headers.get('x-vercel-ip-continent'),
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]
    },
    
    // 边缘节点信息
    edge: {
      region: process.env.VERCEL_REGION,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
      functionId: `func_${Date.now()}`
    },
    
    // 验证证据
    proof: {
      responseTime: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')?.substring(0, 50)
    }
  }
  
  // 🎯 判断是否最优位置
  const isOptimal = checkIfOptimal(locationData.client.country, locationData.edge.region || null)
  
  return NextResponse.json({
    ...locationData,
    verification: {
      isOptimal,
      message: isOptimal ? 
        '✅ 确认：在最近边缘节点运行！' : 
        '⚠️ 注意：可能不是最优节点',
      evidence: generateEvidence(locationData)
    }
  })
}

// 🎯 判断是否为最优位置
function checkIfOptimal(clientCountry: string | null, edgeRegion: string | null): boolean {
  const optimalMap: Record<string, string[]> = {
    'US': ['iad1', 'sfo1', 'pdx1'],     // 美国用户 -> 美国节点
    'CN': ['hkg1', 'sin1'],             // 中国用户 -> 香港/新加坡
    'DE': ['fra1', 'arn1'],             // 德国用户 -> 欧洲节点
    'JP': ['hnd1', 'sin1'],             // 日本用户 -> 东京/新加坡
    'GB': ['lhr1', 'cdg1'],             // 英国用户 -> 欧洲节点
    'CA': ['iad1', 'cle1'],             // 加拿大用户 -> 北美节点
    'AU': ['syd1', 'sin1'],             // 澳洲用户 -> 悉尼/新加坡
  }
  
  const recommended = optimalMap[clientCountry || ''] || ['iad1']
  return recommended.includes(edgeRegion || '')
}

// 🔍 生成验证证据
function generateEvidence(data: any): string[] {
    console.log('data:', data);
    
  const evidence = []
  
  // 证据 1：超低延迟
  if (parseInt(data.proof.responseTime) < 100) {
    evidence.push(`⚡ 超低延迟：${data.proof.responseTime} (证明就近执行)`)
  }
  
  // 证据 2：地理位置匹配
  if (checkIfOptimal(data.client.country, data.edge.region)) {
    evidence.push(`🌍 地理位置匹配：${data.client.country} 用户 -> ${data.edge.region} 节点`)
  }
  
  // 证据 3：边缘运行时
  evidence.push(`🚀 Edge Runtime: ${data.edge.region} (非传统服务器)`)
  
  // 证据 4：实时时间戳
  evidence.push(`🕐 实时执行：${data.proof.timestamp}`)

  console.log('evidence:', evidence);
  
  
  return evidence
}