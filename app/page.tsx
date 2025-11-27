// app/page.tsx - 首页直接显示验证
'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 🚀 页面加载时自动检测位置
  useEffect(() => {
    detectLocation()
  }, [])

  const detectLocation = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/where-am-i')
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({ error: error.message })
    }
    setLoading(false)
  }

  const refreshDetection = () => {
    detectLocation()
  }

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* 标题区域 */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: '#1e293b',
          marginBottom: '1rem'
        }}>
          Edge Functions 边缘位置验证
        </h1>
      </div>

      {/* 主要内容区域 */}
      {loading && !result && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
          <h2>正在检测您的边缘位置...</h2>
          <p>请稍候，我们正在连接到最近的边缘节点</p>
        </div>
      )}

      {result && (
        <>

          {/* 📊 详细信息网格 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            
            {/* 客户端信息卡片 */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#1e293b', fontSize: '1.3rem' }}>
                地理位置
              </h3>
              <div>
                <InfoRow label="国家/地区" value={`${result.client?.country} (${getCountryName(result.client?.country)})`} />
                <InfoRow label="城市" value={result.client?.city || 'Unknown'} />
                <InfoRow label="州/省" value={result.client?.region} />
                <InfoRow label="时区" value={result.client?.timezone} />
                <InfoRow label="大洲" value={result.client?.continent} />
                <InfoRow label="IP地址" value={result.client?.ip} />
              </div>
            </div>

            {/* 边缘节点信息卡片 */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#1e293b', fontSize: '1.3rem' }}>
                边缘节点信息
              </h3>
              <div>
                <InfoRow label="边缘区域" value={result.edge?.region} highlight={true} />
                <InfoRow label="响应时间" value={result.proof?.responseTime} />
                <InfoRow label="执行时间" value={new Date(result.proof?.timestamp).toLocaleString()} />
                <InfoRow label="部署ID" value={`${result.edge?.deploymentId?.substring(0, 16)}...`} />
                <InfoRow label="运行时" value="Edge Runtime" highlight={true} />
                <InfoRow label="函数ID" value={result.edge?.functionId} />
              </div>
            </div>
          </div>

          {/* 🌐 多地区测试提示 */}
          <div style={{ 
            backgroundColor: '#fef3c7', 
            padding: '1.5rem', 
            borderRadius: '12px',
            border: '1px solid #fbbf24'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>🌏 亚洲测试：</strong> 使用日本/新加坡 VPN<br/>
                <small>应看到 hnd1, sin1 等亚洲节点</small>
              </div>
              <div>
                <strong>🌍 欧洲测试：</strong> 使用德国/英国 VPN<br/>
                <small>应看到 fra1, lhr1 等欧洲节点</small>
              </div>
              <div>
                <strong>🌎 美洲测试：</strong> 使用美国/加拿大 VPN<br/>
                <small>应看到 iad1, sfo1 等美洲节点</small>
              </div>
            </div>
          </div>

          {/* 原始数据（可折叠） */}
          <details style={{ marginTop: '2rem' }}>
            <summary style={{ 
              cursor: 'pointer', 
              padding: '1rem', 
              backgroundColor: '#f1f5f9', 
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              📋 查看完整的原始数据
            </summary>
            <pre style={{ 
              backgroundColor: '#0f172a', 
              color: '#e2e8f0', 
              padding: '1rem', 
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.8rem',
              marginTop: '1rem'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </>
      )}

      {/* 错误状态 */}
      {result?.error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          backgroundColor: '#fee2e2', 
          borderRadius: '8px',
          color: '#dc2626'
        }}>
          <h3>❌ 检测失败</h3>
          <p>{result.error}</p>
          <button onClick={detectLocation} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px' }}>
            重试
          </button>
        </div>
      )}
    </div>
  )
}

// 辅助组件：信息行
function InfoRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '0.5rem 0',
      borderBottom: '1px solid #f1f5f9'
    }}>
      <span style={{ color: '#6b7280', fontWeight: '500' }}>{label}:</span>
      <span style={{ 
        fontWeight: '600', 
        color: highlight ? '#3b82f6' : '#1e293b',
        fontFamily: highlight ? 'monospace' : 'inherit'
      }}>
        {value || 'N/A'}
      </span>
    </div>
  )
}

// 辅助函数：获取国家名称
function getCountryName(code: string | null): string {
  const names: Record<string, string> = {
    'US': '美国', 'CN': '中国', 'DE': '德国', 'JP': '日本',
    'GB': '英国', 'FR': '法国', 'CA': '加拿大', 'AU': '澳大利亚',
    'KR': '韩国', 'IN': '印度', 'BR': '巴西', 'MX': '墨西哥'
  }
  return names[code || ''] || '未知'
}