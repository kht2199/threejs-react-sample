import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { TextureLoader, CanvasTexture, RepeatWrapping, MeshStandardMaterial } from 'three'

// Canvas로 텍스처 생성하는 함수
function createTexture(color, text, pattern = 'windows') {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // 배경색
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 512, 512)

  if (pattern === 'windows') {
    // 창문 패턴 그리기
    ctx.fillStyle = 'rgba(200, 200, 255, 0.8)'
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        const x = i * 80 + 20
        const y = j * 80 + 20
        ctx.fillRect(x, y, 60, 60)
        ctx.strokeRect(x, y, 60, 60)
        // 창문 구분선
        ctx.beginPath()
        ctx.moveTo(x + 30, y)
        ctx.lineTo(x + 30, y + 60)
        ctx.moveTo(x, y + 30)
        ctx.lineTo(x + 60, y + 30)
        ctx.stroke()
      }
    }
  } else if (pattern === 'bricks') {
    // 벽돌 패턴
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 3
    const brickWidth = 60
    const brickHeight = 30

    for (let i = 0; i < 512 / brickHeight; i++) {
      for (let j = 0; j < 512 / brickWidth + 1; j++) {
        const x = j * brickWidth + (i % 2 === 0 ? 0 : -brickWidth / 2)
        const y = i * brickHeight
        ctx.strokeRect(x, y, brickWidth, brickHeight)
      }
    }
  } else if (pattern === 'door') {
    // 문 그리기
    ctx.fillStyle = '#654321'
    ctx.fillRect(180, 300, 150, 200)
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 5
    ctx.strokeRect(180, 300, 150, 200)

    // 문손잡이
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(280, 400, 8, 0, Math.PI * 2)
    ctx.fill()
  }

  // 텍스트 추가
  if (text) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 40px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 256, 50)
  }

  return new CanvasTexture(canvas)
}

function Building({ position, height, textures, label }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Material 배열 생성
  const materials = useMemo(() =>
    textures.map(texture =>
      new MeshStandardMaterial({
        map: texture,
        metalness: 0.1,
        roughness: 0.8
      })
    ), [textures]
  )

  // Cleanup: 텍스처와 material dispose
  useEffect(() => {
    return () => {
      materials.forEach(material => {
        if (material.map) material.map.dispose()
        material.dispose()
      })
    }
  }, [materials])

  useFrame((state) => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.position.y = height / 2 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      } else {
        meshRef.current.position.y = height / 2
      }
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        material={materials}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={() => {
          alert(`🏢 ${label}\n높이: ${height}m\n위치: (${position[0]}, ${position[2]})`)
        }}
        castShadow
      >
        <boxGeometry args={[1, height, 1]} />
      </mesh>

      {/* 건물 라벨 */}
      {hovered && (
        <Text
          position={[0, height + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  )
}

// 이미지를 사용하는 건물 컴포넌트
function ImageBuilding({ position, height, label, imageUrls }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // 이미지 텍스처 로드
  const textures = useLoader(TextureLoader, imageUrls)

  // Material 배열 생성
  const materials = useMemo(() =>
    textures.map(texture =>
      new MeshStandardMaterial({
        map: texture,
        metalness: 0.2,
        roughness: 0.7
      })
    ), [textures]
  )

  // Cleanup: material dispose (텍스처는 useLoader가 관리)
  useEffect(() => {
    return () => {
      materials.forEach(material => material.dispose())
    }
  }, [materials])

  useFrame((state) => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.position.y = height / 2 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      } else {
        meshRef.current.position.y = height / 2
      }
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        material={materials}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={() => {
          alert(`🖼️ ${label}\n높이: ${height}m\n위치: (${position[0]}, ${position[2]})\n\n이 건물은 실제 이미지를 사용합니다!`)
        }}
        castShadow
      >
        <boxGeometry args={[1, height, 1]} />
      </mesh>

      {/* 건물 라벨 */}
      {hovered && (
        <Text
          position={[0, height + 0.5, 0]}
          fontSize={0.3}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          {label} 🖼️
        </Text>
      )}
    </group>
  )
}

function CityMap() {
  // 지도 텍스처 생성
  const groundTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 2048
    const ctx = canvas.getContext('2d')

    // 도로 그리기
    ctx.fillStyle = '#2c3e50'
    ctx.fillRect(0, 0, 2048, 2048)

    // 격자 도로
    ctx.strokeStyle = '#f39c12'
    ctx.lineWidth = 10

    for (let i = 0; i <= 10; i++) {
      const pos = i * 204.8
      ctx.beginPath()
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, 2048)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, pos)
      ctx.lineTo(2048, pos)
      ctx.stroke()
    }

    // 중앙선
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.setLineDash([20, 20])

    for (let i = 0; i <= 10; i++) {
      const pos = i * 204.8
      ctx.beginPath()
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, 2048)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, pos)
      ctx.lineTo(2048, pos)
      ctx.stroke()
    }

    const texture = new CanvasTexture(canvas)
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    return texture
  }, [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial map={groundTexture} />
    </mesh>
  )
}

export default function Example8() {
  // 건물 데이터
  const buildings = useMemo(() => [
    {
      position: [-4, 0, -4],
      height: 3,
      label: '오피스 빌딩',
      colors: ['#3498db', '#3498db', '#3498db', '#2980b9', '#3498db', '#3498db']
    },
    {
      position: [-4, 0, 0],
      height: 2,
      label: '상업 건물',
      colors: ['#e74c3c', '#e74c3c', '#c0392b', '#e74c3c', '#e74c3c', '#e74c3c']
    },
    {
      position: [-4, 0, 4],
      height: 4,
      label: '주상복합',
      colors: ['#2ecc71', '#2ecc71', '#27ae60', '#2ecc71', '#2ecc71', '#2ecc71']
    },
    {
      position: [0, 0, -4],
      height: 2.5,
      label: '은행',
      colors: ['#f39c12', '#f39c12', '#d68910', '#f39c12', '#f39c12', '#f39c12']
    },
    {
      position: [0, 0, 0],
      height: 5,
      label: '타워',
      colors: ['#9b59b6', '#9b59b6', '#8e44ad', '#9b59b6', '#9b59b6', '#9b59b6']
    },
    {
      position: [0, 0, 4],
      height: 1.5,
      label: '카페',
      colors: ['#1abc9c', '#1abc9c', '#16a085', '#1abc9c', '#1abc9c', '#1abc9c']
    },
    {
      position: [4, 0, -4],
      height: 3.5,
      label: '호텔',
      colors: ['#34495e', '#34495e', '#2c3e50', '#34495e', '#34495e', '#34495e']
    },
    {
      position: [4, 0, 0],
      height: 2.8,
      label: '병원',
      colors: ['#e67e22', '#e67e22', '#d35400', '#e67e22', '#e67e22', '#e67e22']
    },
    {
      position: [4, 0, 4],
      height: 4.5,
      label: '아파트',
      colors: ['#95a5a6', '#95a5a6', '#7f8c8d', '#95a5a6', '#95a5a6', '#95a5a6']
    }
  ], [])

  // 각 건물의 텍스처 생성
  const buildingsWithTextures = useMemo(() =>
    buildings.map((building, idx) => {
      const textures = building.colors.map((color, faceIdx) => {
        // 0: right, 1: left, 2: top, 3: bottom, 4: front, 5: back
        let pattern = 'windows'
        let text = ''

        if (faceIdx === 2) { // top
          pattern = 'bricks'
          text = '옥상'
        } else if (faceIdx === 3) { // bottom
          pattern = 'bricks'
        } else if (faceIdx === 4) { // front
          pattern = 'door'
          text = building.label
        }

        return createTexture(color, text, pattern)
      })

      return {
        ...building,
        textures
      }
    }),
    [buildings]
  )

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#3498db" />

      {/* 지도 지면 */}
      <CityMap />

      {/* 건물들 */}
      {buildingsWithTextures.map((building, index) => (
        <Building
          key={index}
          position={building.position}
          height={building.height}
          textures={building.textures}
          label={building.label}
        />
      ))}

      {/* 이미지를 사용하는 특별한 건물 */}
      <ImageBuilding
        position={[-2, 0, -2]}
        height={3.8}
        label="갤러리"
        imageUrls={[
          'https://picsum.photos/seed/right/512/512',
          'https://picsum.photos/seed/left/512/512',
          'https://picsum.photos/seed/top/512/512',
          'https://picsum.photos/seed/bottom/512/512',
          'https://picsum.photos/seed/front/512/512',
          'https://picsum.photos/seed/back/512/512'
        ]}
      />

      <OrbitControls
        maxPolarAngle={Math.PI / 2.5}
        minDistance={5}
        maxDistance={25}
      />

      {/* 하늘 배경 */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#87CEEB" side={2} />
      </mesh>
    </>
  )
}
