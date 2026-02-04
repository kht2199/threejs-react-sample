import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
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
  const CurrentComponent = examples[currentExample].component

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

      <Canvas camera={{ position: [0, 0, 8] }} gl={{ antialias: true }}>
        <Suspense fallback={<Loader />}>
          <CurrentComponent />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
