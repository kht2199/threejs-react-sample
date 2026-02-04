import { useState, useEffect, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { WebGLRenderer } from 'three'
import { Html } from '@react-three/drei'
import Example1 from './examples/Example1'
import Example2 from './examples/Example2'
import Example3 from './examples/Example3'
import Example4 from './examples/Example4'
import Example5 from './examples/Example5'
import Example6 from './examples/Example6'
import Example7 from './examples/Example7'
import Example8 from './examples/Example8'
import './App.css'

// 로딩 컴포넌트
function Loader() {
  return (
    <Html center>
      <div style={{
        color: 'white',
        fontSize: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '10px'
      }}>
        ⏳ 로딩 중...
      </div>
    </Html>
  )
}

const examples = [
  { id: 1, name: '회전하는 큐브 & 토러스', component: Example1 },
  { id: 2, name: '애니메이션 구체', component: Example2 },
  { id: 3, name: '회전하는 실린더들', component: Example3 },
  { id: 4, name: '인터랙티브 큐브', component: Example4 },
  { id: 5, name: '수평 회전만 가능', component: Example5 },
  { id: 6, name: '중첩 오브젝트 (반투명)', component: Example6 },
  { id: 7, name: '클릭 이벤트 & Alert', component: Example7 },
  { id: 8, name: '3D 도시 지도', component: Example8 }
]

function App() {
  const [currentExample, setCurrentExample] = useState(0)
  const [renderer, setRenderer] = useState('webgl')
  const [webgpuSupported, setWebgpuSupported] = useState(false)
  const [actualRenderer, setActualRenderer] = useState('webgl')
  const [isLoading, setIsLoading] = useState(false)
  const [fallbackMessage, setFallbackMessage] = useState(null)
  const CurrentComponent = examples[currentExample].component

  useEffect(() => {
    // Check WebGPU support
    const checkWebGPU = async () => {
      if ('gpu' in navigator) {
        try {
          const adapter = await navigator.gpu.requestAdapter()
          setWebgpuSupported(!!adapter)
        } catch (e) {
          setWebgpuSupported(false)
        }
      } else {
        setWebgpuSupported(false)
      }
    }
    checkWebGPU()
  }, [])

  useEffect(() => {
    // Clear fallback message when renderer changes
    setFallbackMessage(null)
    // Set actual renderer for WebGL mode
    if (renderer === 'webgl') {
      setActualRenderer('webgl')
    }
  }, [renderer])

  useEffect(() => {
    // Example 8 (3D 도시 지도)에서 WebGPU 사용 시 자동으로 WebGL로 전환
    // WebGPU는 CanvasTexture를 완전히 지원하지 않음
    if (currentExample === 7 && renderer === 'webgpu') {
      setRenderer('webgl')
      setFallbackMessage('Example 8은 WebGL 모드에서만 지원됩니다. 자동으로 전환되었습니다.')
      setTimeout(() => setFallbackMessage(null), 5000)
    }
  }, [currentExample, renderer])

  const canvasProps = useMemo(() => {
    const baseProps = {
      camera: { position: [0, 0, 8] }
    }

    if (renderer === 'webgpu') {
      return {
        ...baseProps,
        gl: async (canvas) => {
          setIsLoading(true)
          try {
            // Dynamic import for WebGPU renderer
            const { WebGPURenderer } = await import('three/webgpu')
            const webgpuRenderer = new WebGPURenderer({ canvas, antialias: true })
            await webgpuRenderer.init()
            setActualRenderer('webgpu')
            setIsLoading(false)
            setFallbackMessage(null)
            return webgpuRenderer
          } catch (e) {
            console.warn('WebGPU not available, falling back to WebGL:', e)
            setActualRenderer('webgl')
            setIsLoading(false)
            setFallbackMessage('WebGPU 초기화 실패. WebGL로 전환되었습니다.')
            setTimeout(() => setFallbackMessage(null), 5000)
            return new WebGLRenderer({ canvas, antialias: true })
          }
        }
      }
    }

    return {
      ...baseProps,
      gl: { antialias: true }
    }
  }, [renderer])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
        maxWidth: '90%'
      }}>
        {/* Renderer selector */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>
              렌더러:
            </span>
            <button
              onClick={() => setRenderer('webgl')}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: renderer === 'webgl' ? '#3498db' : '#34495e',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: renderer === 'webgl' ? 'bold' : 'normal',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              WebGL
            </button>
            <button
              onClick={() => setRenderer('webgpu')}
              disabled={!webgpuSupported || isLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: renderer === 'webgpu' ? '#9b59b6' : '#34495e',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: (webgpuSupported && !isLoading) ? 'pointer' : 'not-allowed',
                fontSize: '12px',
                fontWeight: renderer === 'webgpu' ? 'bold' : 'normal',
                opacity: (webgpuSupported && !isLoading) ? 1 : 0.5
              }}
              title={!webgpuSupported ? 'WebGPU is not supported in your browser' : ''}
            >
              WebGPU {!webgpuSupported && '(미지원)'}
            </button>
          </div>

          {/* Status display */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            fontSize: '11px',
            color: '#ecf0f1',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '8px'
          }}>
            {isLoading ? (
              <>
                <span style={{ color: '#f39c12' }}>⏳ 로딩 중...</span>
              </>
            ) : (
              <>
                <span>현재 렌더러:</span>
                <span style={{
                  fontWeight: 'bold',
                  color: actualRenderer === 'webgpu' ? '#9b59b6' : '#3498db',
                  textTransform: 'uppercase'
                }}>
                  {actualRenderer}
                </span>
                {renderer === 'webgpu' && actualRenderer === 'webgl' && (
                  <span style={{ color: '#e74c3c', fontSize: '10px' }}>
                    (Fallback)
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Fallback message */}
        {fallbackMessage && (
          <div style={{
            backgroundColor: 'rgba(231, 76, 60, 0.9)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '5px',
            fontSize: '12px',
            maxWidth: '300px',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            ⚠️ {fallbackMessage}
          </div>
        )}

        {/* Example selector */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {examples.map((example, index) => (
            <button
              key={example.id}
              onClick={() => setCurrentExample(index)}
              style={{
                padding: '10px 20px',
                backgroundColor: currentExample === index ? '#4ecdc4' : '#2c3e50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: currentExample === index ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>

      <Canvas key={renderer} {...canvasProps}>
        <Suspense fallback={<Loader />}>
          <CurrentComponent />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
