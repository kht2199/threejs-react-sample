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

## 기능

- 4가지 다른 Three.js 예제
- 예제 간 실시간 전환
- **렌더러 선택**: WebGL / WebGPU
- WebGPU 지원 여부 자동 감지
- 마우스로 조작 가능한 OrbitControls
- 반응형 디자인

## 렌더러 정보

### WebGL (기본)
- 모든 브라우저에서 지원
- 안정적이고 호환성이 높음

### WebGPU (실험적)
- 최신 브라우저에서만 지원 (Chrome 113+, Edge 113+)
- 더 나은 성능과 현대적인 그래픽 API
- 지원하지 않는 브라우저에서는 자동으로 WebGL로 폴백

**WebGPU를 사용하려면**:
- Chrome 또는 Edge 113 이상 버전 필요
- `chrome://flags`에서 "Unsafe WebGPU" 활성화 (필요시)
