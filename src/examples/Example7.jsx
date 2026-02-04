import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function ClickableObject({ geometry, position, color, name, info }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5

      // 클릭된 오브젝트는 위아래로 움직임
      if (clicked) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3
      } else {
        meshRef.current.position.y = position[1]
      }
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    setClicked(!clicked)

    // Alert 표시
    alert(`🎯 오브젝트 클릭!\n\n이름: ${name}\n색상: ${color}\n정보: ${info}\n위치: (${position[0]}, ${position[1]}, ${position[2]})`)
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      scale={hovered ? 1.2 : clicked ? 1.1 : 1}
    >
      {geometry}
      <meshStandardMaterial
        color={clicked ? '#ffffff' : hovered ? '#ffff00' : color}
        metalness={0.6}
        roughness={0.4}
        emissive={clicked ? color : hovered ? '#ffff00' : '#000000'}
        emissiveIntensity={clicked ? 0.5 : hovered ? 0.3 : 0}
      />
    </mesh>
  )
}

export default function Example7() {
  const objects = [
    {
      geometry: <boxGeometry args={[1.5, 1.5, 1.5]} />,
      position: [-4, 0, 0],
      color: '#e74c3c',
      name: '빨간 큐브',
      info: '정육면체 형태의 기본 도형'
    },
    {
      geometry: <sphereGeometry args={[0.8, 32, 32]} />,
      position: [-2, 0, 0],
      color: '#3498db',
      name: '파란 구체',
      info: '완벽한 구형 오브젝트'
    },
    {
      geometry: <coneGeometry args={[0.8, 1.8, 32]} />,
      position: [0, 0, 0],
      color: '#2ecc71',
      name: '초록 원뿔',
      info: '뾰족한 원뿔 모양'
    },
    {
      geometry: <torusGeometry args={[0.7, 0.3, 16, 100]} />,
      position: [2, 0, 0],
      color: '#f39c12',
      name: '주황 토러스',
      info: '도넛 모양의 링'
    },
    {
      geometry: <octahedronGeometry args={[0.9]} />,
      position: [4, 0, 0],
      color: '#9b59b6',
      name: '보라 옥타헤드론',
      info: '8면체 다이아몬드 형태'
    }
  ]

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <spotLight position={[-10, 10, 5]} angle={0.3} penumbra={1} intensity={1} />

      {/* 안내 텍스트 배경 */}
      <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 1]} />
        <meshBasicMaterial color="#000000" opacity={0.7} transparent />
      </mesh>

      {/* 클릭 가능한 오브젝트들 */}
      {objects.map((obj, index) => (
        <ClickableObject
          key={index}
          geometry={obj.geometry}
          position={obj.position}
          color={obj.color}
          name={obj.name}
          info={obj.info}
        />
      ))}

      {/* 바닥 클릭 영역 */}
      <mesh
        position={[0, -2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => {
          alert('🌍 바닥을 클릭했습니다!\n\n위의 오브젝트들을 클릭해보세요.')
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#34495e"
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>

      <gridHelper args={[20, 20]} position={[0, -1.99, 0]} />
      <OrbitControls />
    </>
  )
}
