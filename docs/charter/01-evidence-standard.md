# KOLMO 증거표준 (Evidence Standard)

**버전** v0.2 · **상위문서** 00-magna-carta.md · **범위** KVU 스키마, 인식층 표기, 증거등급, 상태표시, 집계규칙

## 1. KVU (KOLMO Verification Unit)

KOLMO가 사실·추론·결정을 주장할 수 있는 최소 단위. KVU가 없는 주장은 정식 판단이 아니라 **비등록 의견**으로 표시한다. 결론·경보·정책변경은 반드시 구성 KVU_ID를 역추적할 수 있어야 한다.

### 필수 필드

| 필드 | 설명 |
|---|---|
| `kvu_id` | 전역 유일 식별자 |
| `object_key` | 관측대상의 재현 가능한 키 (아래 규칙) |
| `claim_layer` | `O` / `I` / `N-v` / `N-h` / `A` |
| `proposition` | 주장 내용 (한 문장) |
| `evidence_class` | `A` / `B` / `C` / `D` (아래 등급) |
| `status` | `●` / `◐` / `∅` / `○obs` / `○struct` / `H` |
| `source_and_provenance` | 원천, 수집경로, 원자료 보존 위치 |
| `jurisdiction` | 관할 (해당 시) |
| `observed_at` | 관측 시각 (벽시계 + 게임시계, 해당 시) |
| `validity_window` | 유효 관측창 |
| `confidence_or_uncertainty` | 보정된 확률 또는 불확실성 서술 |
| `trust_vector` | 아래 2절의 4계수 |
| `counterevidence` | 알려진 반대증거 |
| `falsifier` | 이 주장을 기각시키는 조건 (필수 — 반증 불가능한 주장은 I층 이상으로 승격 불가) |
| `authority` | 판단 책임자/역할 |
| `closure_condition` | 검증 종결조건 |
| `next_gate` | 다음 검증관문 |
| `model_version` / `policy_version` | 판단에 사용된 버전 |

### object_key 규칙

- 경기상태: `provider + match_id + event_time + schema_version`
- 상품화 센서: `aggregator + regional_slug + fixturePath + jurisdiction + observed_at`
- 같은 slug라도 aggregator 또는 관할이 다르면 **별개의 센서**로 취급한다.

## 2. 증거등급과 신뢰 벡터

### 등급 (직접성 축)

| 등급 | 정의 |
|---|---|
| **A** | 허용 관할의 로컬 UI, GRID·Riot 직접필드 등 직접 관측 |
| **B** | 지역 slug와 활성 API·feed로 확인된 구조적 자료 |
| **C** | 글로벌 feed·catalog에서 발견된 존재 가능성 |
| **D** | 약관·마케팅·규칙 페이지의 범주 설명 |

### 신뢰 벡터 (직접성과 독립인 4계수)

> v0.1 보정 2: A등급 직접관측도 절대적으로 신뢰하지 않는다. 등급과 별도로 다음을 KVU마다 기록·계산한다.

| 계수 | 질문 |
|---|---|
| `reliability` | 이 센서의 과거 오류율은 얼마인가 |
| `independence` | 같은 원천에서 파생된 다른 KVU와 상관되어 있는가 |
| `freshness` | 관측이 유효 관측창 안에 있는가 |
| `integrity` | 수집→저장 계보가 단절 없이 검증되는가 |

A등급이라도 `integrity=FAIL`이면 판단에 사용할 수 없다.

### 등급 사용 규칙

1. API는 카탈로그 증거이지 해당 지역 소비자에게 실제 제공된다는 증거가 아니다.
2. C는 가설 상한선일 뿐 관측사실로 계산하지 않는다.
3. 다수의 C·D 증거가 하나의 반대되는 A 증거를 투표로 압도할 수 없다.
4. 집계는 **A only / A+B / A+B+C**를 분리해 공개한다.
5. VPN 우회를 이용한 관할 검증은 허용하지 않는다.

## 3. 상태표시

| 기호 | 의미 |
|---|---|
| `●` | 직접 확인 |
| `◐` | 부분확인 또는 제한조건이 있는 확인 |
| `∅` | 유효한 관측창에서 부재를 직접 확인 |
| `○obs` | 접근·시간·표본 부족으로 직접 관측하지 못함 |
| `○struct` | 구조적 존재만 확인, 실제 제공 미확인 |
| `H` | 가설 |

모든 상태에는 관할, 관측시각, (미확인 시) 실패원인을 붙인다. `○obs`를 `∅`로 표기하는 것은 제3조 5항(관찰하지 못한 것 ≠ 부재) 위반이다.

## 4. 제품 출력에서의 층 분리

사용자에게 보이는 모든 화면·경보에서 Observed(O)와 Inferred(I)를 시각적으로 분리한다. 전환경보의 출력 순서는 전환정책 문서 6절을 따른다: 관측된 변화 → 추론 → 대안 설명 → 발동상태 → 반대증거·무효화 조건 → 허용된 행동 → 다음 관문 → 롤백 가능성.
