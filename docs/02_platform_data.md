# 경기기후플랫폼 데이터 현황

## 플랫폼 URL
- 메인: https://climate.gg.go.kr/ips
- Open&Share: https://climate.gg.go.kr/ols
- 다운로드: https://climate.gg.go.kr/ols/download
- API: https://climate.gg.go.kr/ols/api

## 데이터 카테고리 (총 600+ 데이터셋)

### 1. 기후위기
- **극한호우**: 홍수위험도 평가, 위험등급(2016-2023), 취약시설, 침수흔적지도
- **산사태**: 위험등급, 발생이력, 사방댐, 임시거주시설
- **폭염**: 열쾌적성 평가, 체감온도, 무더위쉼터, 응급/의료시설, 이동노동자쉼터

### 2. 탄소공간
- **탄소배출**: 건축물 에너지 소비 및 탄소배출량, 통계(시군/읍면동)
- **탄소저장(수목)**: 산림 수목정보, 층위구조, 수목 탄소저장지도
- **탄소저장(토양)**: 토양 탄소저장지도, 미생물 탄소, 탄소 분획/취약성 지도
- **탄소흡수(수목)**: LAI(엽면적지수), GPP(총일차생산량), 탄소흡수지도
- **온실가스 인벤토리**: 경기도/시군 통계

### 3. 태양광
- **잠재량**: 이론적/기술적/시장 잠재량 (옥상/지상)
- **규제지역**: 19종 규제요인 (국립공원, 문화재, 상수원보호구역 등)
- **발전현황**: 태양광 발전시설 현황, 설치 예정지

### 4. 그린인프라
- **생태계서비스 평가**: 공급/조절/문화/지지 서비스
- **도시공원 평가**: 공원 서비스 종합평가 (시군/읍면동)

### 5. 도시생태현황지도
- **기본주제도**: 비오톱 유형도, 토지이용/피복지도, 현존식생지도, 투수/불투수 유형
- **기타주제도**: 광역/지역 생태축, 그린인프라, 습지, 탄소흡수원

### 6. 에너지
- 에너지 현황, 태양광 도입, 에너지 절감 시뮬레이션

## API 정보

### WMS (Web Map Service) v1.3.0
```
https://climate.gg.go.kr/ols/api/geoserver/wms?apiKey={인증키}&[WMS Param]
```

### WFS (Web Feature Service) v1.1.0
```
https://climate.gg.go.kr/ols/api/geoserver/wfs?apiKey={인증키}&[WFS Param]
```

### WMTS (Web Map Tile Service)
```
https://climate.gg.go.kr/ols/api/geoserver/wmts?apiKey={인증키}&url=/rest/{레이어명}/EPSG:3857/{z}/{y}/{x}
```

## 주요 레이어 (프로젝트 관련)

| 구분 | 한글명 | WMS/WFS명 |
|------|--------|-----------|
| 탄소흡수 | 탄소흡수지도(10m) | spggcee:rst_npp |
| 탄소흡수 | 탄소흡수지도(비오톱) | spggcee:biotop_cbn_abpvl |
| 탄소저장(수목) | 수목 탄소저장지도 | spggcee:plnt_cbn_strgat_biotop |
| 탄소저장(토양) | 토양 탄소저장지도(10m) | spggcee:rst_soil_cbn_strgat_32652 |
| 탄소저장(토양) | 토양 탄소저장지도(비오톱) | spggcee:soil_cbn_strgat |
| 탄소배출 | 건물정보 | spggcee:bldg_info |
| 비오톱 | 비오톱 유형도 대분류 | spggcee:biotop_lclsf |
| 비오톱 | 비오톱 유형도 중분류 | spggcee:biotop_mclsf |
| 비오톱 | 비오톱 유형도 소분류 | spggcee:biotop_sclsf |
| 토지피복 | 토지이용_토지피복지도 | spggcee:biotop_lndcvg_lcldf |
| 생태계서비스 | 탄소 저장 | spggcee:rst_cbn_strgat |
| 생태계서비스 | 탄소 흡수 | spggcee:rst_cbn_abpvl |

## 다운로드 가능 데이터 (통계)

- 탄소배출 통계 (경기도, 시군, 읍면동)
- 탄소저장(수목) 통계 (경기도, 시군, 읍면동)
- 탄소저장(토양) 통계 (경기도, 시군, 읍면동)
- 탄소흡수(수목) 통계 (경기도, 시군, 읍면동)
- 온실가스 인벤토리 통계 (경기도, 시군)
