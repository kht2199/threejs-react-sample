import { useState, useEffect, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
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
  const CurrentComponent = examples[currentExample].component

  // WebGPU 지원 체크
  useEffect(() => {
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

  // Canvas props 설정 (v9 방식)
  const canvasProps = useMemo(() => {
    const baseProps = {
      camera: { position: [0, 0, 8] }
    }

    if (renderer === 'webgpu') {
      return {
        ...baseProps,
        gl: async (props) => {  // ✅ v9: canvas가 아니라 props 사용
          const { WebGPURenderer } = await import('three/webgpu')
          const webgpuRenderer = new WebGPURenderer(props)
          await webgpuRenderer.init()
          return webgpuRenderer
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
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <span style={{ color: 'white', fontSize: '14px', lineHeight: '32px' }}>
            렌더러:
          </span>
          <button
            onClick={() => setRenderer('webgl')}
            style={{
              padding: '8px 16px',
              backgroundColor: renderer === 'webgl' ? '#3498db' : '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: renderer === 'webgl' ? 'bold' : 'normal'
            }}
          >
            WebGL
          </button>
          <button
            onClick={() => setRenderer('webgpu')}
            disabled={!webgpuSupported}
            style={{
              padding: '8px 16px',
              backgroundColor: renderer === 'webgpu' ? '#9b59b6' : '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: webgpuSupported ? 'pointer' : 'not-allowed',
              fontSize: '12px',
              fontWeight: renderer === 'webgpu' ? 'bold' : 'normal',
              opacity: webgpuSupported ? 1 : 0.5
            }}
            title={!webgpuSupported ? 'WebGPU is not supported in your browser' : ''}
          >
            WebGPU {!webgpuSupported && '(미지원)'}
          </button>
        </div>

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
