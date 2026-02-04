# Three.js React Sample App

React + Three.js 샘플 애플리케이션입니다. 회전하는 3D 오브젝트와 인터랙티브한 컨트롤을 제공합니다.

## 기술 스택

- React
- Three.js
- @react-three/fiber (React용 Three.js 렌더러)
- @react-three/drei (유용한 Three.js 헬퍼)
- Vite

## 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

## 예제 목록

### 1. 회전하는 큐브 & 토러스
- 기본적인 3D 오브젝트 회전 애니메이션
- 별이 있는 배경
- OrbitControls를 사용한 카메라 조작

### 2. 애니메이션 구체
- MeshDistortMaterial을 사용한 왜곡 효과
- 여러 색상의 구체들
- 상하로 움직이는 애니메이션

### 3. 회전하는 실린더들
- 원형으로 배치된 실린더들
- 각각 다른 속도로 회전
- 메탈릭 재질 효과

### 4. 인터랙티브 큐브
- 마우스 호버 시 크기 변경
- 클릭 시 회전 애니메이션
- 상태에 따른 색상 변경
- GridHelper를 사용한 바닥 격자

### 5. 수평 회전만 가능
- **수평(좌우) 회전만 가능한 OrbitControls**
- 수직(상하) 회전 제한 (고정된 높이에서만 관찰)
- 상하로 떠다니는 여러 3D 오브젝트
- TorusKnot, Box, Cone, Torus 등 다양한 geometry
- 메탈릭 재질과 멀티 라이팅

### 6. 중첩 오브젝트 (반투명)
- **오브젝트 안에 오브젝트가 있는 중첩 구조**
- 마우스 호버 시 외부 오브젝트가 반투명해짐 (opacity: 0.9 → 0.3)
- 호버 시 내부 오브젝트가 빛남 (emissive 효과 증가)
- 4가지 조합:
  - Sphere 안에 Cube
  - Box 안에 Torus
  - Torus 안에 Octahedron
  - Octahedron 안에 Sphere
- 외부/내부 오브젝트가 서로 반대 방향으로 회전

### 7. 클릭 이벤트 & Alert
- **오브젝트 클릭 시 Alert 창 표시**
- 5가지 클릭 가능한 오브젝트:
  - 빨간 큐브
  - 파란 구체
  - 초록 원뿔
  - 주황 토러스
  - 보라 옥타헤드론
- 클릭 시 오브젝트 정보 alert 표시 (이름, 색상, 정보, 위치)
- 호버 시 노란색으로 변경 및 크기 증가
- 클릭 시 흰색 발광 + 위아래 움직임
- 커서 변경 (pointer)
- 바닥 클릭 이벤트도 포함

### 8. 3D 도시 지도
- **큐브의 6면에 각각 다른 텍스처 적용**
- 두 가지 텍스처 방식:
  1. **Canvas API**: 프로그래매틱하게 생성 (9개 건물)
  2. **실제 이미지**: TextureLoader로 외부 이미지 로드 (갤러리 건물)
- 10개의 건물:
  - 오피스 빌딩, 상업 건물, 주상복합, 은행, 타워
  - 카페, 호텔, 병원, 아파트
  - **갤러리** (실제 이미지 사용, 6면 각각 다른 이미지)
- 각 건물마다 다른 높이와 색상
- Canvas 텍스처 패턴:
  - 창문 패턴 (격자 무늬)
  - 벽돌 패턴
  - 문 (정면)
  - 옥상 텍스트
- 이미지 텍스처:
  - picsum.photos API 사용
  - 6면 각각 다른 랜덤 이미지
- 지도 스타일 지면:
  - 격자 도로
  - 노란색 도로선
  - 흰색 중앙선
- 호버 시 건물 라벨 표시 및 위아래 움직임
- 클릭 시 건물 정보 Alert
- 하늘 배경 (파란 구체)
- 그림자 효과

## 기능

- 8가지 다른 Three.js 예제
- 예제 간 실시간 전환
- **렌더러 선택**: WebGL / WebGPU (React Three Fiber v9 지원)
- WebGPU 지원 여부 자동 감지
- 다양한 OrbitControls 설정 (전방향, 단방향 회전)
- 인터랙티브 요소 (호버, 클릭, 반투명 효과, Alert 이벤트)
- Canvas API를 사용한 프로그래매틱 텍스처 생성
- 멀티 텍스처 매핑 (큐브 6면)
- 반응형 디자인

## 렌더러 정보

### WebGL (기본)
- 모든 브라우저에서 지원
- 안정적이고 호환성이 높음
- Canvas API 텍스처 완벽 지원

### WebGPU (v9 지원)
- React Three Fiber v9에서 공식 지원
- 최신 브라우저에서만 지원 (Chrome 113+, Edge 113+)
- 더 나은 성능과 현대적인 그래픽 API
- 비동기 렌더러 초기화 지원

**WebGPU를 사용하려면**:
- Chrome 또는 Edge 113 이상 버전 필요
- `chrome://flags`에서 "Unsafe WebGPU" 활성화 (필요시)
- 브라우저가 WebGPU를 지원하지 않으면 버튼이 비활성화됨

### React Three Fiber v9 기능
```javascript
// WebGPU 비동기 렌더러 초기화
gl={async (props) => {
  const renderer = new THREE.WebGPURenderer(props)
  await renderer.init()
  return renderer
}}
```
