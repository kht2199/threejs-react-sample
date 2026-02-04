import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function FloatingObject({ geometry, position, color }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3
      meshRef.current.rotation.z += 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.3}
      />
    </mesh>
  )
}

export default function Example5() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ecdc4" />

      {/* 중앙 오브젝트들 */}
      <FloatingObject
        geometry={<torusKnotGeometry args={[1, 0.3, 100, 16]} />}
        position={[0, 0, 0]}
        color="#e74c3c"
      />

      <FloatingObject
        geometry={<boxGeometry args={[1.5, 1.5, 1.5]} />}
        position={[-3, 0, 0]}
        color="#3498db"
      />

      <FloatingObject
        geometry={<coneGeometry args={[0.8, 2, 32]} />}
        position={[3, 0, 0]}
        color="#2ecc71"
      />

      <FloatingObject
        geometry={<torusGeometry args={[0.8, 0.3, 16, 100]} />}
        position={[0, 0, -3]}
        color="#f39c12"
      />

      {/* 수평 회전만 가능한 OrbitControls */}
      <OrbitControls
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        enablePan={false}
        enableZoom={true}
      />

      <gridHelper args={[20, 20]} />
    </>
  )
}
