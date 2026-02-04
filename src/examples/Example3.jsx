import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Cylinder({ position, color, speed }) {
  const meshRef = useRef()

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * speed
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * speed) * 0.5
  })

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

export default function Example3() {
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0088ff" />

      {colors.map((color, index) => (
        <Cylinder
          key={index}
          position={[
            Math.cos((index / colors.length) * Math.PI * 2) * 3,
            0,
            Math.sin((index / colors.length) * Math.PI * 2) * 3
          ]}
          color={color}
          speed={0.5 + index * 0.2}
        />
      ))}

      <OrbitControls />
    </>
  )
}
