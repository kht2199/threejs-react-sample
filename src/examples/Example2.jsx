import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'

function AnimatedSphere({ position, color }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0}
      />
    </Sphere>
  )
}

export default function Example2() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      <AnimatedSphere position={[-2, 0, 0]} color="#ff6b6b" />
      <AnimatedSphere position={[2, 0, 0]} color="#4ecdc4" />
      <AnimatedSphere position={[0, 0, -2]} color="#ffe66d" />

      <OrbitControls />
    </>
  )
}
