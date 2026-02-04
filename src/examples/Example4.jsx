import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'

function InteractiveCube({ position }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state, delta) => {
    if (clicked && meshRef.current) {
      meshRef.current.rotation.x += delta * 2
      meshRef.current.rotation.y += delta * 2
    }
  })

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[1.5, 1.5, 1.5]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
      scale={hovered ? 1.2 : 1}
    >
      <meshStandardMaterial
        color={clicked ? '#ff6b6b' : hovered ? '#4ecdc4' : '#95a5a6'}
        metalness={0.5}
        roughness={0.5}
      />
    </Box>
  )
}

export default function Example4() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

      <InteractiveCube position={[-2, 0, 0]} />
      <InteractiveCube position={[2, 0, 0]} />
      <InteractiveCube position={[0, 2, 0]} />
      <InteractiveCube position={[0, -2, 0]} />

      <gridHelper args={[10, 10]} />
      <OrbitControls />
    </>
  )
}
