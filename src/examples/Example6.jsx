import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function NestedObject({ outerGeometry, innerGeometry, position, outerColor, innerColor, label }) {
  const outerRef = useRef()
  const innerRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    // 외부 오브젝트 회전
    outerRef.current.rotation.y += delta * 0.3
    // 내부 오브젝트 반대 방향 회전
    innerRef.current.rotation.x += delta * 0.5
    innerRef.current.rotation.y -= delta * 0.5
  })

  return (
    <group position={position}>
      {/* 외부 오브젝트 */}
      <mesh
        ref={outerRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {outerGeometry}
        <meshStandardMaterial
          color={outerColor}
          transparent={true}
          opacity={hovered ? 0.3 : 0.9}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* 내부 오브젝트 */}
      <mesh ref={innerRef}>
        {innerGeometry}
        <meshStandardMaterial
          color={innerColor}
          metalness={0.8}
          roughness={0.2}
          emissive={innerColor}
          emissiveIntensity={hovered ? 0.5 : 0.1}
        />
      </mesh>

      {/* 라벨 (호버 시 표시) */}
      {hovered && (
        <mesh position={[0, 2.5, 0]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="#000000" opacity={0.7} transparent />
        </mesh>
      )}
    </group>
  )
}

export default function Example6() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={1} />

      {/* 구체 안에 큐브 */}
      <NestedObject
        outerGeometry={<sphereGeometry args={[1.5, 32, 32]} />}
        innerGeometry={<boxGeometry args={[1.2, 1.2, 1.2]} />}
        position={[-3.5, 0, 0]}
        outerColor="#3498db"
        innerColor="#e74c3c"
        label="Sphere + Cube"
      />

      {/* 큐브 안에 토러스 */}
      <NestedObject
        outerGeometry={<boxGeometry args={[2, 2, 2]} />}
        innerGeometry={<torusGeometry args={[0.5, 0.2, 16, 100]} />}
        position={[0, 0, 0]}
        outerColor="#2ecc71"
        innerColor="#f39c12"
        label="Box + Torus"
      />

      {/* 토러스 안에 옥타헤드론 */}
      <NestedObject
        outerGeometry={<torusGeometry args={[1.2, 0.4, 16, 100]} />}
        innerGeometry={<octahedronGeometry args={[0.8]} />}
        position={[3.5, 0, 0]}
        outerColor="#9b59b6"
        innerColor="#1abc9c"
        label="Torus + Octahedron"
      />

      {/* 옥타헤드론 안에 구체 */}
      <NestedObject
        outerGeometry={<octahedronGeometry args={[1.5]} />}
        innerGeometry={<sphereGeometry args={[0.7, 32, 32]} />}
        position={[0, -2.5, -2]}
        outerColor="#e67e22"
        innerColor="#8e44ad"
        label="Octahedron + Sphere"
      />

      <OrbitControls />
      <gridHelper args={[15, 15]} />

      {/* 안내 텍스트 */}
      <mesh position={[0, 3.5, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[8, 0.8]} />
        <meshBasicMaterial color="#000000" opacity={0.6} transparent />
      </mesh>
    </>
  )
}
