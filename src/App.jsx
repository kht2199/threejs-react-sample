import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
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
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '90%'
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

      <Canvas camera={{ position: [0, 0, 8] }}>
        <CurrentComponent />
      </Canvas>
    </div>
  )
}

export default App
