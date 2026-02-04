import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { WebGLRenderer } from 'three'
import Example1 from './examples/Example1'
import Example2 from './examples/Example2'
import Example3 from './examples/Example3'
import Example4 from './examples/Example4'
import './App.css'

const examples = [
  { id: 1, name: '회전하는 큐브 & 토러스', component: Example1 },
  { id: 2, name: '애니메이션 구체', component: Example2 },
  { id: 3, name: '회전하는 실린더들', component: Example3 },
  { id: 4, name: '인터랙티브 큐브', component: Example4 }
]

function App() {
  const [currentExample, setCurrentExample] = useState(0)
  const [renderer, setRenderer] = useState('webgl')
  const [webgpuSupported, setWebgpuSupported] = useState(false)
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

  const getCanvasProps = () => {
    const baseProps = {
      camera: { position: [0, 0, 8] }
    }

    if (renderer === 'webgpu') {
      return {
        ...baseProps,
        gl: async (canvas) => {
          try {
            // Dynamic import for WebGPU renderer
            const { WebGPURenderer } = await import('three/webgpu')
            const webgpuRenderer = new WebGPURenderer({ canvas, antialias: true })
            await webgpuRenderer.init()
            return webgpuRenderer
          } catch (e) {
            console.warn('WebGPU not available, falling back to WebGL:', e)
            return new WebGLRenderer({ canvas, antialias: true })
          }
        }
      }
    }

    return {
      ...baseProps,
      gl: { antialias: true }
    }
  }

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
          gap: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <span style={{ color: 'white', alignSelf: 'center', fontSize: '14px' }}>
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

      <Canvas key={renderer} {...getCanvasProps()}>
        <CurrentComponent />
      </Canvas>
    </div>
  )
}

export default App
