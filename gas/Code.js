/**
 * ===============================================================
 * 시험 스케줄 관리 시스템 - Google Apps Script 백엔드
 * VERSION: V9.1
 * - [출력] 💧 습기 1호는 환경챔버와 같은 규칙(기간 전체 사용)으로 바뀌어 방치 표시 제외 — 2·3호만 방치 표시(웹앱 V9.12와 동일)
 * [V9.0]
 * - [보안] 🔑 접속 비밀번호: 스크립트 속성 ACCESS_CODE를 넣으면, 그 비밀번호를 모르는 요청은 모두 거절(읽기·저장·가입 전부)
 *   · ACCESS_CODE가 없으면 지금처럼 열림 · 예외: ?action=version, ?action=checkAccess(비번 확인용)
 * [V8.9]
 * - [출력] 월별 계획표·간트차트를 숨김 탭 '_출력작업'에서 먼저 다 그린 뒤 한 번에 붙여넣기
 *   → 작업자 화면에 지워졌다 병합되는 과정이 보이지 않음(붙여넣기 실패 시에만 병합 풀고 다시 붙임)
 * [V8.8]
 * - [출력] 간트차트 차종·품목·사양 선택(1행 노란 칸) — 고른 조건에 맞는 막대만 원래 색, 나머지는 흐리게(조건부 서식)
 *   · 막대 칸에 숨은 글자(|V=차종|I=품목|S=사양|, 막대 색과 같은 글자색)를 넣어 판별 · 웹앱 지그 검사와 같은 제목 해석
 *   · 고른 값은 다시 출력해도 유지 · 시트를 보는 모든 사람에게 같이 적용
 * [V8.7]
 * - [출력] 오늘 날짜 하이라이트: 월별 계획표·간트 날짜 머리글 주황(TODAY() 조건부 서식 — 날짜가 바뀌면 자동),
 *   월별 계획표 오늘 열 빈 칸 연노랑 + 빨간 테두리, 장비별 캘린더 오늘 칸 노랑
 * - [출력] '📍 오늘로 이동' 링크: 월별 계획표 A2(어느 달 탭에서 눌러도 이번 달 탭의 오늘 칸으로), 간트 A1
 *   (숨김 탭 '_탭목록'에 월→탭 번호를 적어 두고 수식으로 찾음)
 * [V8.6]
 * - [출력] 연계시험은 제목 앞에 원문자 번호(①②…, 웹앱과 같은 번호) — 월별 계획표·전체목록·장비별 캘린더·간트 메모
 * [V8.5]
 * - [연계] 연계 그룹마다 고정 번호(no) 부여 — 만든 순서대로 1,2,3… / 그룹을 지워도 다른 그룹 번호는 그대로(빈 번호 재사용 안 함)
 * [V8.4]
 * - [출력] 간트차트 계획 칸에도 토(연파랑)·일/공휴일(연분홍) 음영 — 시험이 들어간 칸은 시험 색이 우선
 * [V8.3]
 * - [출력] 간트차트 메모는 막대 첫 칸에만(글자 없음은 유지)
 * ===============================================================
 * VERSION: V8.2
 * - [출력] 간트차트 막대 안 글자 제거(색·시작선으로 구분) — 전체 내용 메모는 막대의 모든 칸에 붙여 어디에 마우스를 올려도 보임
 * ===============================================================
 * VERSION: V8.1
 * - [출력] 시험항목 구분 강화: 장비 계열 유사색 대신 서로 뚜렷하게 다른 파스텔 8색 + 진한 글씨
 *   같은 시험(장비+제목)은 모든 탭·간트차트에서 같은 색 · 같은 줄에서 바로 이어지는 시험이 같은 색이면 다음 색으로 바꿈
 *   시험이 시작되는 칸 왼쪽에 굵은 선(월별 탭·간트차트) · 미입고(회색)·💧방치·고장/보수 색은 그대로
 * ===============================================================
 * VERSION: V8.0
 * - [출력] '📊 간트차트' 탭 추가(장비별 캘린더 바로 뒤) — 장비 1대 = 1줄(겹치면 줄 추가), 오늘 기준 -1주 ~ +8주(월요일 시작)
 *   하루 = 1칸 · 막대 색은 월별 탭과 동일(유사색·미입고 흐림·💧방치) · 제목은 막대 첫 칸에 표시(마우스 올리면 전체 내용)
 *   오늘 열 빨간 테두리 · 주말/휴일 머리글 색 구분 · 탭 전체 보호(보기 전용) · 출력 때마다 + 매일 03시 기간 자동 이동
 * ===============================================================
 * VERSION: V7.9
 * - [출력] V7.8에서 장비별 캘린더의 📌 이벤트를 숨긴 것을 되돌림(요청은 웹앱 캘린더의 근태 숨김이었음) · 근태 줄 아래 굵은 구분선은 유지
 * ===============================================================
 * VERSION: V7.8
 * - [출력] 월별 탭 근태 줄(7행)과 첫 장비 줄 사이에 굵은 구분선
 * - [출력] 📅 장비별 캘린더에서 📌 이벤트(미팅·교육·마감 등)는 표시하지 않음 — 시험 일정과 🎌 휴일만 표시
 * ===============================================================
 * VERSION: V7.7
 * - [출력] 같은 장비 안에서도 시험항목마다 유사색(같은 계열 4단계 농도)으로 구분 — 같은 줄에서 이어지는 시험은 서로 다른 농도,
 *   위아래 줄도 엇갈리게 배치 · 연한 농도는 진한 글씨 · 장비 그룹 계열색(배광=인디고 등)은 그대로
 * ===============================================================
 * VERSION: V7.6
 * - disconnectOriginal: 1분 트리거가 출력 중이면 바로 오류를 내지 않고 끝날 때까지 최대 5분 기다렸다 진행
 *   (출력이 비정상 종료돼 '진행 중' 표시만 남은 경우 6분 지나면 무시)
 * ===============================================================
 * VERSION: V7.5  ★ 원본 시험계획표와 연결 완전 차단
 * - 편집기에서 disconnectOriginal() 1회 실행:
 *   ① 원본 '시험계획누적'을 이 스프레드시트 '원본일정(웹앱)' 탭으로 1회 이관(행 번호 = 🔒 일정 id 그대로 → 보호·소요시간·리뷰·연계·이력 유지)
 *   ② 이후 웹앱은 원본 시험계획표를 읽지도 쓰지도 않음(원본 반영 대기열도 끔) → 원본은 이관 시점 그대로 멈춤
 *   ③ 출력 시트의 현장 기록·칸 위치표를 새 id로 다시 이어 붙임(이관 때 id가 달라진 일정 보정)
 *   ④ 출력 시트 전체 다시 출력
 * - rollbackToOriginalMode(): 원본 직접 연동으로 되돌리기(단, 끊은 뒤 웹앱에서 바꾼 내용은 원본에 없음)
 * ===============================================================
 * VERSION: V7.4
 * - [출력] 웹앱에서 미입고·검증지연·지연 처리한 일정은 진행결과 칸에도 자동 표시(미입고 → '미입고', 검증지연·지연 → '지연')
 *   현장 기록이 있으면 현장 기록이 우선 · 자동 표시 값은 현장 기록으로 저장하지 않음(웹앱에서 상태를 풀면 칸도 비워짐)
 * ===============================================================
 * VERSION: V7.3
 * - [출력] 일정 행 높이 16px 고정(장비 줄만)
 * - [출력] 이벤트·근태 행(6~7행)은 높이 고정을 풀고 줄바꿈 허용 → 적힌 줄 수에 맞춰 높이가 자동으로 늘고 줄어듦
 *   (현장에서 근태를 여러 줄 입력해도 그때그때 맞춰짐)
 * ===============================================================
 * VERSION: V7.2
 * - [출력] 웹앱에서 미입고·검증지연·지연 처리한 일정은 흐리게 표시: 회색 막대 + 회색 글씨 + 제목 앞 [미입고]/[검증지연]/[지연]
 *   (월별 탭·메모·캘린더 모두) · 진행결과 칸은 그대로 현장 기록 전용
 * ===============================================================
 * VERSION: V7.1
 * - [출력] 일정 행 높이 36px(2줄) → 15px(1줄) 고정
 * ===============================================================
 * VERSION: V7.0
 * - [출력] 웹앱 '🔄 출력 동기화' 버튼용 exportRunNow — 누르면 그 자리에서 바로 출력(이번 달부터 약 45초 분량),
 *   남은 달은 1분 트리거가 이어서 처리 · 저장 잠금과 별개로 돌아 다른 사람 저장을 막지 않음 · 트리거가 이미 출력 중이면 예약만
 * ===============================================================
 * VERSION: V6.9
 * - [출력] 월별 탭 시험장비(호기)별 순번 최소 2줄 → 5줄(EXPORT_MIN_LANES = 5)
 * ===============================================================
 * VERSION: V6.8
 * - [출력] 월별 탭 시험계획 칸에 전체 내용을 '메모'로 붙임 — 잠긴 칸이라도 마우스를 올리면 전체 내용(제목·담당자·상세)이 팝업으로 보임
 * ===============================================================
 * VERSION: V6.7
 * - [출력] V6.6의 '근태(현장)' 별도 줄을 없애고, 기존 '근태' 줄 자체를 현장 입력 줄로 변경
 *   웹앱 근태 데이터는 출력 시트로 내보내지 않음 · 현장 입력은 날짜 기준으로 보관·복원(웹앱·원본으로는 안 넘어감)
 *   V6.6 배치(근태(현장) 줄)에서 이미 적은 내용은 첫 출력 때 '근태' 줄로 옮겨짐
 * ===============================================================
 * VERSION: V6.6
 * - [출력] 월별 탭 '근태' 줄 아래에 '근태(현장)' 줄 추가 — 기능직 인원이 날짜 칸에 자유롭게 입력(예: 홍길동 연차)
 *   입력값은 날짜 기준으로 '_현장기록'에 보관했다가 다시 그릴 때 그대로 되돌려 놓음 · 웹앱 근태(위 '근태' 줄)는 그대로 잠금
 *   현장 근태도 웹앱·원본으로는 넘어가지 않음
 * ===============================================================
 * VERSION: V6.5
 * - [출력] 시험계획(상세내용) 칸 왼쪽 정렬 — V6.4에서 진행결과 칸 가운데 정렬을 넣으며 계획 칸까지 가운데로 바뀌었던 것 수정(진행결과 칸만 가운데)
 * ===============================================================
 * VERSION: V6.4  ★ 현장 진행여부 기록(출력 시트 안에서만)
 * - 월별 탭 '진행결과' 칸을 현장 입력 칸으로 개방(드롭다운: 샘플입고·진행·완료·미입고·지연, 값별 색상)
 *   웹앱 진행결과는 출력하지 않음(현장 기록만 표시) · 계획 막대 색도 웹앱 상태와 무관하게 장비 그룹색
 * - 출력해서 다시 그리기 직전에 현장 기록을 읽어 숨김 탭 '_현장기록'에 [일정 id + 날짜]로 보관 → 다시 그린 뒤 같은 일정·같은 날짜 칸에 되돌려 놓음
 *   (줄 위치가 바뀌어도 따라감) · 칸 위치표는 숨김 탭 '_셀맵'
 * - 일정이 옮겨지거나 삭제돼 놓을 자리가 없는 기록 / 일정 없는 칸에 적은 기록 → '미반영 기록' 탭에 표시(삭제 체크 시 정리)
 * - 5분마다 이번 달·전후 달 현장 기록을 읽어 캘린더·전체목록·미반영 기록에 반영
 * - 현장 기록은 웹앱·원본 시험계획표로 절대 넘어가지 않음(출력 시트 안에서만)
 * ===============================================================
 * VERSION: V6.3
 * - [출력] 맨 앞에 '📅 장비별 캘린더' 탭 추가 — 노란 칸에서 시험장비·월을 고르면 그 장비의 월간 일정이 달력(일~토)으로 보임
 *   달력은 수식으로 계산(고르는 즉시 바뀜) · 데이터는 숨김 탭 '_캘린더데이터'(출력 때마다 갱신, 휴일·이벤트·💧방치 포함)
 *   캘린더 탭은 고르는 칸(B2·E2)만 편집 가능하고 나머지는 보호 · 고른 장비/월은 출력해도 유지
 * ===============================================================
 * VERSION: V6.2
 * - [출력] 월별 탭·전체목록 탭을 '보호(나만 편집)'로 잠금 — 공유받은 사람은 보기만 가능(다른 탭: 샘플입고대장 등은 자유롭게 편집)
 *   출력할 때마다 보호가 없으면 다시 걸고, 소유자 외 편집자가 추가돼 있으면 빼냄
 * ===============================================================
 * VERSION: V6.1
 * - [출력 버그수정] 습기 장비의 고장·보수·보수필요 기록(🟡 [보수필요] 등)까지 💧 방치로 환경챔버 6·7·8호에 그려지던 문제 → 제외(웹앱과 동일)
 * ===============================================================
 * VERSION: V6.0
 * - [출력] 💧 습기시험 방치 표시를 환경챔버 6·7·8호 행에 추가(웹앱 V2.3 규칙과 동일, 하늘색)
 *   습기 계획(2일 이상, 미입고·지연 제외): 마지막날 오전 6호(½일) → 그 전날 7호 → 더 앞쪽은 8호. 같은 호기 연속일은 한 막대
 *   표시용이라 '전체목록' 탭과 원본 시험계획표에는 넣지 않음
 * ===============================================================
 * VERSION: V5.9
 * - [출력] A열(시험장비) 너비 200px 고정 · 같은 시험장비명 셀 병합(세로) · 같은 장비번호 셀 병합(세로)
 * - [출력] 글꼴 Noto Sans KR로 통일(월별 탭·전체목록) — 구글 시트는 Medium 굵기를 고를 수 없어 본문 일반·제목/장비명 굵게
 * - [출력] A2 안내 문구 삭제
 * ===============================================================
 * VERSION: V5.8
 * - [출력 버그수정] 웹앱에서 상태를 바꾼 직후 출력하면 가끔 예전 상태(예: 완료 해제가 안 됨)로 그려지던 문제
 *   원인: 출력이 원본 '시험계획누적'을 읽는데, ① 20초 캐시를 쓰고 ② 원본 매크로가 1분마다 누적을 다시 만드는 사이에 읽으면 바뀌기 전 값이 나옴
 *   → 출력은 캐시 없이 항상 원본을 새로 읽고, 그린 달은 2분 뒤 한 번 더 다시 그림(매크로 반영 후 최종 확인)
 * ===============================================================
 * VERSION: V5.7
 * - [출력] 계획내용 칸 너비 260px · 일정 행 높이 2줄(36px 고정, 위쪽 정렬)
 * - [출력] 계획 음영을 웹앱 막대 색과 동일하게: 장비 그룹색(배광=인디고, 고온=주황, 습기=하늘, 환경=초록, 가속=보라, 측정=청록, 기타=회색) + 흰 글씨,
 *   완료·미입고/지연 = 회색(미입고/지연은 진행결과 빨간 글씨), 고장/보수 = 웹앱 유형별 색, 휴일=장미색·이벤트=호박색
 * ===============================================================
 * VERSION: V5.6
 * - [출력] 계획내용 칸(D·F·H… 짝수열) 너비 200px로 매번 고정(결과 칸 52px) — 예전엔 새 탭에서만 한꺼번에 지정해 일부 열이 기본 너비로 남았음
 * - [출력] 셀 내용 첫 줄(제목)이 바로 다음 줄에 똑같이 한 번 더 있으면 출력 시트에서는 한 번만 표시(원본 데이터는 그대로)
 * ===============================================================
 * VERSION: V5.5
 * - [출력 버그수정] 휴일을 2035년까지 등록해둔 탓에 출력 범위가 2035년까지 늘어나고, 최근 달부터 거꾸로 그려 2029~2035년 빈 탭만 생기던 문제
 *   → 월별 탭 범위는 '시험 일정'이 있는 달만(휴일·이벤트·근태는 범위 계산에서 제외, 최대 오늘+24개월)
 *   → 그리는 순서: 이번 달 → 다음 달들 → 지난 달들 · 범위 밖 월별 탭은 전체 출력 때 자동 삭제
 * ===============================================================
 * VERSION: V5.4  ★ 비교 운영 단계: 원본 연동은 V5.2 그대로 + 출력 시트만 추가
 * - setupExportOnly()를 편집기에서 1회 실행 → 출력 시트 생성 + 1분/03시 트리거 설치. 원본 연결·동작은 V5.2와 동일(이관 안 함)
 * - 저장하면 바뀐 달을 표시 → 1분 트리거가 출력 시트 해당 달 탭을 다시 그림(웹앱 저장 속도엔 영향 없음)
 * - 비교 후 원본 연결을 끊고 싶을 때만 setupV53() 실행(아래 V5.3 내용) — 그 전까지는 실행하지 마세요
 * ===============================================================
 * VERSION: V5.3  (setupV53 실행 시에만 적용) 구조 전환: 웹앱이 원본
 * - [원본 이관] setupV53()을 편집기에서 1회 실행 → 원본 '시험계획누적'을 이 스프레드시트의 '원본일정(웹앱)' 탭으로 그대로 복사
 *   (행 번호·내용이 같아 기존 🔒 일정 id·보호·소요시간·리뷰·연계그룹·변경이력이 그대로 이어짐)
 * - [로컬 모드] 이관 후에는 불러오기·저장이 원본 파일을 열지 않고 이 스프레드시트 안에서만 처리 → 빠르고 연결오류 없음
 * - [원본 미러] 원본 '시험계획표' 월별 탭 반영은 'OriginalQueue'에 줄 세워 1분 트리거가 뒤에서 처리(실패해도 웹앱 저장에 영향 없음, 3회 재시도)
 *   ※ 이관 후 원본 시험계획표는 '보기 전용' — 원본에서 직접 고친 내용은 웹앱에 들어오지 않음
 * - [출력 시트] 새 스프레드시트 '시험계획표(웹앱 출력) V5.3' 자동 생성 — 월별 격자 탭 + 전체목록 탭
 *   저장할 때마다 바뀐 달을 표시해두고 1분 트리거가 다시 그림(저장 속도에 영향 없음) · 매일 03시 전체 재출력
 * - [되돌리기] rollbackToOriginalMode() 실행 시 V5.2 방식(원본 직접 연동)으로 복귀
 * ===============================================================
 * VERSION: V5.2
 * - 변경 없음(웹앱 V5.2와 번호만 맞춤)
 * ===============================================================
 * VERSION: V5.1
 * - 변경 없음(웹앱 V5.1과 번호만 맞춤)
 * ===============================================================
 * VERSION: V5.0
 * - 변경 없음(웹앱 V5.0과 번호만 맞춤)
 * ===============================================================
 * VERSION: V4.9
 * - [즉시 반영] 저장 응답에 masterPatch(시험계획누적에서 바뀐/추가/삭제된 줄을 웹앱 일정 형식으로) 포함 → 웹앱이 전체 재로딩 없이 바로 반영
 *   (신규 반영·앱 일정 변경/삭제·🔒 원본 일정 수정·진행상태 모두 적용) · '시험계획누적' 한 줄 해석을 parseMasterRow로 분리
 * ===============================================================
 * VERSION: V4.8
 * - [속도개선] 원본('시험계획누적') 읽기 20초 단기 캐시(저장 시 즉시 무효화) · 내용 같으면 캐시 재기록 생략
 * - [측정] read 응답에 단계별 소요시간(timing) 포함 · GAS_VERSION 표기 V4.8로 정정
 * ===============================================================
 * VERSION: V4.7
 * - [속도개선] pushToAppInput: 날짜별 개별 읽기/쓰기/행추가 → 탭별 1회 읽기 + 일괄 쓰기(RangeList) + 어플입력 일괄 기록
 * - [속도개선] 신규 반영 직후 '시험계획누적'에 바로 한 줄 추가 → 원본 매크로(1분)를 기다리지 않고 웹앱에 🔒 표시
 * ===============================================================
 * VERSION: V4.6
 * - 변경 없음(웹앱 V4.6와 번호만 맞춤)
 * ===============================================================
 * VERSION: V4.1
 * - 변경 없음(웹앱 V4.1과 번호만 맞춤)
 * ===============================================================
 * VERSION: V4.0
 * - 변경 없음(웹앱 V4.0과 번호만 맞춤)
 * ===============================================================
 * VERSION: V3.9
 * - 변경 없음(웹앱 V3.9와 번호만 맞춤)
 * ===============================================================
 * VERSION: V3.8
 * - 변경 없음(웹앱 V3.8과 번호만 맞춤)
 * ===============================================================
 * VERSION: V3.7
 * - 변경 없음(웹앱 V3.7과 번호만 맞춤)
 * ===============================================================
 * VERSION: V3.6
 * - 변경 없음(웹앱 V3.6과 번호만 맞춤)
 * ===============================================================
 * VERSION: V3.5
 * - 변경 없음(웹앱 V3.5와 번호만 맞춤)
 * ===============================================================
 * VERSION: V3.4
 * - 변경 없음(웹앱 V3.4와 번호만 맞춤)
 * ===============================================================
 * VERSION: V3.3
 * - 변경 없음(웹앱 V3.3과 번호만 맞춤)
 * ===============================================================
 * VERSION: V3.2
 * - 변경 없음(웹앱 V3.2와 번호만 맞춤)
 * ===============================================================
 * VERSION: V3.1
 * - 변경 없음(웹앱 V3.1과 번호만 맞춤)
 * ===============================================================
 * VERSION: V3.0
 * - 변경 없음(웹앱 V3.0과 번호만 맞춤)
 * ===============================================================
 * VERSION: V2.9
 * - 변경 없음(웹앱 V2.9와 번호만 맞춤)
 * ===============================================================
 * VERSION: V2.8
 * - 변경 없음(웹앱 V2.8과 번호만 맞춤)
 * ===============================================================
 * VERSION: V2.7
 * - 변경 없음(웹앱 V2.7과 번호만 맞춤)
 * ===============================================================
 * VERSION: V2.6
 * - 변경 없음(웹앱 V2.6과 번호만 맞춤)
 * ===============================================================
 * VERSION: V2.5
 * - 변경 없음(웹앱 V2.5와 번호만 맞춤)
 * ===============================================================
 * VERSION: V2.4
 * - 변경 없음(웹앱 V2.4와 번호만 맞춤)
 * ===============================================================
 * VERSION: V2.3
 * - 변경 없음(웹앱 V2.3과 번호만 맞춤 — 💧 습기 방치 표시는 웹앱 화면에서만 계산)
 * ===============================================================
 * VERSION: V2.2
 * - 원본 '시험계획누적'의 장비 이름 인식: '환경챔버/기타' → '환경챔버'가 들어 있으면 환경챔버(env_)로 인식
 *   (원본 장비 칸을 '환경챔버'로 바꿔도 계속 인식되도록. 기존 '환경챔버/기타'도 그대로 인식)
 * - 앱에서 원본 월별 탭에 쓸 때 찾는 장비 칸 글자는 그대로 '환경챔버/기타'
 * ===============================================================
 * VERSION: V2.1
 * - 변경 없음(웹앱 V2.1과 번호만 맞춤 — 중복 정리 시 원본 칸이 지워지던 문제는 웹앱에서 수정)
 * ===============================================================
 * VERSION: V2.0
 * - 버전 체계 정리: 웹앱(V1.97.38)과 GAS(V1.37.8)를 모두 V2.0으로 통일 (기능 변경 없음)
 * - 앞으로 웹앱과 GAS는 같은 버전 번호로 함께 올림 (V2.1, V2.2 …)
 * ===============================================================
 * VERSION: V1.37.8
 * - [기능추가] 🌙 자동 야간 판정 일정도 원본에 야간 표시 — 새 액션 markNightShiftBatch({items:[{original, night}]})
 *   여러 건을 한 번에(원본 파일·월별 탭 캐시 공유) 표시/해제. 해제는 우리가 단 '🌙 야간' 메모가 있는 칸만.
 *   (앱 V1.97.32가 배광UNIT 1일 일정의 자동 주/야간 판정이 바뀔 때마다 변경분만 보냄)
 * ===============================================================
 * VERSION: V1.37.7
 * - [동기화 누락 개선] '시험계획누적' 즉시 갱신 — 이 시트는 원본 매크로(copyAndPasteWithMergedCellsOptimized)가
 *   다시 돌아야 갱신되는 파생 스냅샷이라, 앱에서 🔒 원본 일정을 옮기거나(수정) 진행상태를 바꾸면 월별 탭에는
 *   반영돼도 앱을 새로고침하면 매크로가 돌기 전까지 예전 위치/상태로 되돌아가 보였음(=누락처럼 보임).
 *   → 원본 쓰기에 성공하면 '시험계획누적'의 해당 행(시작일·장비·내용·진행결과·종료일)도 바로 고침
 *   (patchMasterSnapshot). 대상: 🔒 원본 일정 수정/이동, 진행상태(완료·미입고·진행), 앱 일정 이동/삭제가
 *   원본에 따라갈 때 그 원본 행. 행은 지우거나 추가하지 않아 다른 일정의 master_행번호는 그대로.
 *   매크로가 다시 돌면 월별 탭 기준으로 같은 내용이 다시 만들어지므로 충돌 없음.
 * - [안정성] 저장 잠금 대기 실패 응답에 busy:true 표시 — 앱(V1.97.31)이 같은 요청번호로 자동 재시도.
 * ===============================================================
 * VERSION: V1.37.6
 * - [기능추가] 🗑️ 🔒 원본 일정 삭제(deleteMasterSchedule) — 원본 '시험계획표' 월별 탭에서 그 일정의 셀(내용 칸)을
 *   찾아 비우고(흰색·🌙 표시 해제), 바로 옆 진행결과 칸도 비움. '시험계획누적' 해당 행의 내용 칸도 함께 비워
 *   원본 매크로가 다시 돌기 전에 앱을 새로고침해도 삭제한 일정이 다시 나타나지 않게 함(행은 지우지 않아
 *   다른 일정의 master_행번호는 그대로). 셀 매칭은 기존 수정/이동과 같은 방식(장비+날짜+원본 셀 내용).
 * ===============================================================
 * VERSION: V1.37.5
 * - [기능추가] 📥 🔒 원본 일정 '입고완료' 표시 — 원본 진행결과 칸에는 쓰지 않고(집계 매크로가 모르는 값이라
 *   '시험계획누적'에서 빠질 수 있음) 새 시트 'MasterArrival'에 안정 키('장비+원본 셀 내용')로 저장.
 *   새 액션 setMasterArrival, readAll()이 원본 일정마다 arrived(boolean)를 붙여 내려줌,
 *   원본 일정 수정 시 migrateMasterKeys가 이 저장소도 새 키로 이관.
 * ===============================================================
 * VERSION: V1.37.4
 * - [기능추가] 📦 🔒 원본 일정 진행상태에 '미입고' 지원 — updateMasterProgressStatus가 '완료'/''(진행)에 더해
 *   '미입고'도 원본 월별 탭 진행결과 칸에 기록(원본 집계 매크로가 '미입고'를 '시험계획누적'에 포함하므로 안전).
 * - [기능추가] 📝 대시보드 '계획 변경' 카드용 getMonthHistory(GET, month=yyyy-MM) — 그 달의 변경 이력 전체 반환.
 * ===============================================================
 * VERSION: V1.37.3
 * - [안정성] 가끔 동기화가 끝나도 🔒 원본 일정이 통째로 빠지고 앱 일정만 보이던 문제 대응. 원인: 원본 시트 접근이
 *   일시적으로 실패하거나(구글 서비스 지연), 원본 매크로가 '시험계획누적'을 지우고 다시 채우는 순간에 읽으면
 *   readMasterSchedules가 조용히 빈 목록을 돌려줬음. → 실패/빈 결과면 잠시 후 1회 재시도, 그래도 안 되면
 *   마지막으로 정상 읽은 원본 목록(스크립트 캐시, 6시간 보관)을 대신 내려주고 masterStatus.stale=true로 알림.
 *   readAll 응답에 masterStatus { ok, stale, count, error } 추가(HTML V1.97.12가 사용).
 * ===============================================================
 * VERSION: V1.37.2
 * - [기능추가] 🌙 배광UNIT '야간 고정' 일정을 원본 '시험계획표' 월별 탭에 표시 — 셀 글자는 그대로 두고
 *   셀 메모("🌙 야간 (웹앱 지정)") + 남색 굵은 글씨로만 표시(markNightShift). 해제 시 이 메모가 달린 셀만 원래대로.
 * - 이동(마스터 수정·앱 일정 동기화) 시 기존 칸의 야간 표시를 새 칸으로 함께 옮기고, 비워지는 칸의 표시는 지움
 *   (빈 칸에 남색 굵은 서식이 남아 다른 일정이 물려받지 않도록). 앱 일정 삭제 동기화 때도 같이 지움.
 * ===============================================================
 * VERSION: V1.37.1
 * - [동기화] 앱 일반 일정(원본에 반영된 것)을 앱에서 이동/기간변경/내용수정/삭제하면 원본 '시험계획표' 월별 탭도
 *   따라가도록 syncAppSchedule 추가(HTML V1.97.2와 함께 사용). 기존 🔒 마스터 수정과 같은 안전 순서
 *   (새 위치 빈 자리 먼저 확인 → 기존 셀 지움 → 새 위치 기록)를 그대로 사용. 원본에서 기존 셀을 못 찾으면
 *   (애초에 원본에 반영 안 한 일정) 아무것도 쓰지 않고 건너뜀 — 반영 안 한 일정이 이동만으로 원본에 새로 생기지 않음.
 * ===============================================================
 * VERSION: V1.37.0
 * - [안정성] 저장 요청 동시 실행 잠금(LockService) — 여러 사람이 동시에 저장하거나, 백그라운드 동기화로
 *   요청이 겹칠 때 시트 행 번호가 서로 어긋나 엉뚱한 행을 덮어쓰거나 지우는 위험을 막기 위해, 저장 요청은
 *   한 번에 하나씩 차례대로 처리함(최대 25초 대기).
 * - [안정성] 중복 요청 차단 — 클라이언트(HTML V1.91.0 이상)가 보내는 요청 고유번호(_reqId)를 10분간 기억해,
 *   시간초과 재시도로 같은 요청이 다시 와도 실제 처리는 한 번만 하고 첫 결과를 그대로 돌려줌
 *   (새 메모/변경이력/연계그룹/권한요청이 두세 개씩 생기던 위험 제거). doPost → routePostAction 분리.
 * ===============================================================
 * VERSION: V1.36.0
 * - [버그수정] 🔒 마스터 일정의 '결과 리뷰'가 다른 일정에 붙거나 끊기던 문제 — 리뷰가 review_<master_행번호> 레코드로
 *   저장돼 변경이력(V1.35.0)과 똑같이 재집계로 행이 밀리면 엉뚱한 일정에 붙었음. 새 시트 'MasterReviews'에
 *   안정 키('장비+원본 셀 내용')로 저장(handleSetMasterReview, 새 액션 setMasterReview), readAll()이 마스터 일정마다
 *   resultReviewText를 붙여 내려줌. 마스터 수정 시 migrateMasterKeys가 이 저장소도 새 키로 이관.
 *   앱 등록 일정은 id가 고정이라 기존 방식(review_<id> 레코드) 그대로.
 * ===============================================================
 * VERSION: V1.35.0
 * - [버그수정] 🔒 마스터 일정의 변경이력이 다른 일정에 붙던 문제 — 마스터 id(master_행번호)는 원본 '시험계획누적'
 *   시트(시작일 순 정렬)의 행 위치라, 일정을 뒤로 밀고 그 자리에 신규 일정이 들어가면 신규 일정이 밀린 일정의
 *   옛 번호를 그대로 물려받아 그 이력을 가져갔음. History 시트에 'stableKey' 칼럼(자동 추가)을 두고, 마스터
 *   일정 이력은 '장비+원본 셀 내용' 안정 키(buildHistoryStableKey, 다른 마스터 부가정보와 같은 키 방식)로
 *   기록/조회하도록 변경. addHistory는 master{eqId,rawContent}를 받고, getHistory는 eqId/rawContent/title을
 *   받아 조회. 안정 키 도입 전에 쌓인 옛 기록은 기록 당시 제목이 지금 제목과 같은 것만 인정(잘못 붙어 보이던
 *   기존 이력도 함께 정리됨). reassignScheduleHistory(중복정리 이관)도 마스터 대상이면 안정 키를 함께 기록.
 * - [버그수정 · 중요] 앱에서 마스터 일정을 수정/이동하면 GAS가 셀 내용을 buildAppInputContent()로 다시 써서
 *   (예: '의뢰자'→'담당자' 라벨, 줄 앞 공백 정리) 실측 551건 중 498건(약 91%)은 '원본 셀 내용'이 바뀌고,
 *   그 결과 안정 키로 붙여둔 부가정보(변경이력·보호·소요시간·재일정·주야간·연계 그룹)가 그 순간 끊기던
 *   문제. handleUpdateMasterSchedule을 래퍼로 감싸(본체는 handleUpdateMasterScheduleCore) 수정이 성공하면
 *   migrateMasterKeys가 옛 키 → 새 키로 6개 저장소를 전부 이관하고, 응답에 새 셀 내용(newRawContent)을 담아
 *   클라이언트가 이력을 새 키로 남길 수 있게 함. 이관 실패는 이동/수정 자체를 실패로 만들지 않음.
 * ===============================================================
 * VERSION: V1.34.0
 * - [기능추가] 🔗 중복정리로 앱 등록 일정이 삭제되고 마스터 버전이 남을 때, 그 일정의 결과
 *   리뷰/변경이력이 옛 id에 남아 새 id로는 조회 안 되던 문제 해결. 새 액션
 *   reassignScheduleHistory(oldId, newId) 추가 — History 시트의 scheduleId 컬럼 값을
 *   일괄 변경. 결과 리뷰는 review_<id> 형태의 일반 스케줄 레코드라 기존 saveSchedule/
 *   deleteSchedule 조합으로 클라이언트에서 처리(새 GAS 액션 불필요).
 * ===============================================================
 * VERSION: V1.33.0
 * - [기능추가] 🔗 연계 시험(순서가 이어지는 시험들, 예: 배광→진동→배광) 그룹 관리 — 1단계(데이터
 *   구조 + 수동 그룹핑)만 구현. 새 시트 'SequenceGroups'(그룹명/최대간격일)와 'SequenceMembers'
 *   (그룹별 소속 순서, memberKey로 앱/마스터 일정 구분 식별 — 앱은 'app:'+id, 마스터는
 *   'master:'+eqId+rawContent 안정키) 추가. readAll()이 각 일정에 sequenceGroupId/sequenceOrder를
 *   붙여서 내려주고, 그룹 메타(이름/최대간격)도 별도로 함께 반환. 새 액션 saveSequenceGroup(생성·수정
 *   겸용, 멤버 전체 덮어쓰기 방식)/deleteSequenceGroup 추가. 아직 날짜 변경 시 자동 연쇄 재배치는
 *   구현하지 않음(2단계 이후 과제) — 이번엔 그룹으로 묶고 조회만 가능.
 * ===============================================================
 * VERSION: V1.32.0
 * - [기능추가] 🌙 배광UNIT "주간/야간 수동 지정" — 자동 판정(우선순위 행 순서+누적 12시간 기준)이
 *   틀렸을 때 사람이 직접 주간/야간으로 고정하거나 다시 자동판정으로 되돌릴 수 있게 함.
 *   원본 셀은 건드리지 않고, 별도 시트 'MasterShift'에 안정 키(eqId+rawContent)로 저장(마스터),
 *   앱 등록 일정은 Schedules 시트 'shiftOverride' 컬럼에 저장. 새 액션 setMasterShift 추가.
 * ===============================================================
 * VERSION: V1.31.0
 * - [기능추가] 🔁 미입고 마스터 일정 "재일정 수립됨" 표시 — 원본 셀(진행결과='미입고')은 절대 건드리지
 *   않고, 별도 시트 'MasterReschedule'에 안정 키(eqId+rawContent, buildProtectionKey 재사용)로
 *   "이미 새 일정을 만들었음" 표시만 남김. 새 액션 setMasterReschedule 추가, readAll()이 조회 시
 *   이 키로 매칭해서 마스터 일정에 rescheduled(boolean)를 붙여줌.
 *   - 앱 등록 일정도 동일 개념으로 Schedules 시트에 'rescheduled' 컬럼 추가(ensureHeaderColumn),
 *     saveSchedule이 함께 저장.
 * ===============================================================
 * VERSION: V1.30.0
 * - [기능추가] 🎯 배광UNIT(배광1호/2호) 전용 "하루 소요시간(시간)" 저장 — 원본 시트가 배광UNIT을
 *   "우선순위 1~4호" 병렬 슬롯으로 관리하고 있어(하루 12시간 가용, 항목마다 실제 사용시간이 다름),
 *   앱의 밀어내기/자동계획 로직이 겹침=무조건 불가로 오판하던 문제를 고치기 위해 도입.
 *   - 앱 등록 일정: Schedules 시트에 'dailyHours' 컬럼 자동 추가(ensureHeaderColumn), saveSchedule이 저장.
 *   - 🔒 마스터 일정: id 대신 안정 키(eqId+rawContent, buildProtectionKey 재사용)로 별도 시트
 *     'MasterHours'에 저장. 새 액션 setMasterHours 추가, readAll()이 조회 시 이 키로 매칭해서
 *     각 마스터 일정에 dailyHours를 붙여줌(값 없으면 null — 클라이언트가 추정치 계산).
 * ===============================================================
 * VERSION: V1.29.0
 * - [기능추가] "밀리면 안 됨(보호)" 표시 — 밀어내기 후보 추천에서 특정 일정을 최대한 안 밀리게
 *   지정할 수 있는 범용 필드. 4M변경처럼 특정 사유만 이름 붙여 특별 취급하지 않도록, 사유는
 *   자유 텍스트(참고용)로만 남기고 알고리즘은 protected(boolean) 하나만 봄.
 *   - 앱 등록 일정: Schedules 시트에 'protected'/'protectReason' 컬럼 자동 추가(ensureHeaderColumn),
 *     saveSchedule이 두 값을 함께 저장.
 *   - 🔒 마스터(자동연동) 일정: id가 원본 재동기화로 바뀔 수 있어(행 번호 기반), id 대신
 *     "장비(eqId)+원본 셀 내용(rawContent) 정규화 텍스트"를 안정 키로 쓰는 별도 시트
 *     'ScheduleProtection'에 저장(buildProtectionKey). 새 액션 setMasterProtection 추가,
 *     readAll()이 조회 시 이 키로 매칭해서 각 마스터 일정에 protected/protectReason을 붙여줌.
 * ===============================================================
 * VERSION: V1.28.0
 * - [버그수정] handleAddHistory가 scheduleId가 'master_'로 시작하면 무조건 거부하고 있었음 —
 *   🔒 마스터(업무현황 자동연동) 일정은 예전에는 앱에서 읽기 전용이라 이력 기록이 의미 없었지만,
 *   V1.32.0(HTML)부터 편집 자체가 가능해졌는데도 이 제한이 남아있어서, 마스터 일정을 수정할 때
 *   클라이언트가 변경 이력(사유 포함)을 기록하려 해도 서버가 항상 실패로 응답하고 있었음.
 *   → 제한 제거. History 시트는 앱 자체 저장소이며 원본 '시험계획표'와 무관하므로 마스터 일정도
 *   똑같이 기록 가능. (참고: 마스터 일정의 scheduleId(행 번호 기반)가 원본 재동기화로 나중에
 *   바뀌면 이 이력 항목은 옛 id에 남아 새 id로는 조회되지 않을 수 있음 — 알려진 제약사항이며,
 *   완전히 해결하려면 행 번호 대신 내용 기반 안정 키로 재설계가 필요함)
 * ===============================================================
 * VERSION: V1.27.0
 * - [성능개선 · 핵심] pushToAppInput/updateMasterSchedule/updateMasterProgressStatus가
 *   후보를 찾거나 기존 셀을 재검색할 때 셀 하나하나마다 개별 getValue() API 호출을 하고
 *   있어서(날짜 수 × 우선순위 행 수만큼 호출), 기간이 길거나 우선순위 행이 여럿인 경우
 *   15초 클라이언트 타임아웃을 넘기기 쉬웠음. 타임아웃이 나도 GAS 서버 실행 자체는
 *   끊기지 않고 계속 진행되어, 클라이언트 화면에는 "통신 오류"가 뜨는데 원본 시트에는
 *   한참 후에 결국 반영되는 현상의 원인이었음.
 *   → getMonthlyTabCache가 탭당 내용 영역 전체(E13:BU105)를 getValues() 1회로
 *     일괄 캐싱(contentValues)하도록 확장. "후보를 찾는" 스캔 단계
 *     (findWritableRank, handleUpdateMasterSchedule/handleUpdateMasterProgressStatus의
 *     기존 셀 재검색)는 모두 이 캐시에서 읽도록 변경해 탭당 API 호출을 사실상 1회로 축소.
 *   ※ 단, "실제로 쓰기 직전"의 최종 확인(writeAtRank의 setValue 직전 체크)은 캐시가
 *     아니라 여전히 그 순간 셀을 다시 getValue()로 실시간 확인 — 같은 요청의 재시도 중복
 *     실행이나 다른 사용자의 거의 동시 등록이 그 사이 셀을 채웠을 가능성까지 캐시로
 *     덮어버리면 다른 일정을 지우고 덮어쓰는 데이터 누락이 새로 생길 수 있기 때문에,
 *     이 부분만은 의도적으로 실시간성을 유지함. 캐시는 쓰기 직후에도 함께 갱신해서
 *     같은 실행(예: 여러 날짜 반복) 안에서는 최신 상태를 계속 보게 함.
 * ===============================================================
 * VERSION: V1.26.0
 * - [기능추가] 메모/회의록 리마인드 — Memos 시트에 reminderDates(본문에서 인식된 기한 날짜,
 *   JSON 배열)/reminderDone(사용자가 '확인함' 처리한 날짜, JSON 배열) 컬럼 추가.
 *   날짜 인식 자체는 클라이언트(HTML, V1.40.0)에서 저장 직전 미리보기 칩으로 처리하고,
 *   서버는 그 최종 결과를 그대로 저장만 함(saveMemo). 신규 액션: getActiveReminders(아직
 *   확인 안 된 리마인드 전체, GET) / markReminderDone(리마인드 하나를 확인 처리, POST).
 * ===============================================================
 * VERSION: V1.25.0
 * - [버그수정] readMasterSchedules()가 원본 셀 내용(제목+담당자/의뢰자+상세설명이 한 텍스트에 섞여있음)을
 *   그대로 desc에 통째로 넣고 있어서, 앱 화면에 제목이 상세설명에 중복 표시되고 담당자/의뢰자 정보도
 *   텍스트로 뒤섞여 나오던 문제 수정.
 *   → 1행은 title(항목명)로, "담당자 : ..." 또는 "의뢰자 : ..." 형식의 줄은 owner(담당자)로 분리 추출하고,
 *     남은 줄들만 desc(상세설명)에 반영하도록 파싱 로직 추가.
 * - [중요 · 부수 조치] 위 변경으로 desc가 더 이상 원본 셀 전체 텍스트와 같지 않게 되어,
 *   handleUpdateMasterSchedule/handleUpdateMasterProgressStatus가 "원본 셀을 다시 찾을 때"
 *   orig.desc(또는 s.desc)를 셀 값과 그대로 비교하던 방식이 항상 불일치로 깨지는 부작용이 있었음.
 *   → 원본 셀 전체 텍스트를 별도의 rawContent 필드에 그대로 보존해서, 화면 표시(title/owner/desc)와
 *     원본 셀 재매칭(rawContent)의 용도를 분리. 클라이언트는 스키마 변경 없이 스케줄 객체를 그대로
 *     복사/전달하는 구조라 이 필드도 자동으로 함께 오가므로 클라이언트 쪽 수정은 필요 없음.
 * ===============================================================
 * VERSION: V1.24.0
 * - [변경] '내충격' 항목을 무조건 '기타 1호'(etc_1)에 고정 배치하던 것을 제거. '기타'가 이제
 *   1호/2호 두 개로 늘어났으므로, 내충격 항목도 실제 장비번호(C열)에 따라 기타1호/기타2호 중
 *   해당하는 곳에 자연스럽게 배치되도록 변경 (mapMasterEquipment에 forceEtc 파라미터 추가 —
 *   '충격' 키워드 매칭으로 충격UNIT(shk_)에 잘못 분류되는 것만 막고, 번호 매칭은 그대로 둠).
 * ===============================================================
 * VERSION: V1.23.0
 * - [신규] 원본 '시험계획표' 월별 탭에 101~102행으로 추가된 '기타' 2건(장비번호 1/2호로 구분)을
 *   지원하기 위해 getMonthlyTabCache()의 장비 매칭 범위를 B13:B100/C13:C100 → B13:B105/C13:C105로
 *   확장 (마스터 일정 당기기/수정/진행상태 변경 등 원본 셀 되쓰기 기능이 101~102행도 찾을 수 있도록).
 * - [신규] EQUIPMENT_NAME_PREFIX_MAP에 'etc_':'기타' 역매핑 추가 — 앱에서 새로 등록한 '기타' 일정을
 *   "원본 시트에도 반영"(pushToAppInput) 체크박스로 반영할 때 "매칭되는 장비가 아닙니다" 오류로
 *   실패하던 문제 해결 (그동안 etc_ 프리픽스가 이 매핑에 아예 없었음).
 * - [참고] 별도 스크립트인 copyAndPasteWithMergedCellsOptimized()('시험계획표' 파일 자체에 설치되어
 *   '시험계획누적' 시트를 생성하는 스크립트, 이 백엔드 파일과는 별도)도 100행까지만 읽던 것을
 *   101~102행까지 읽도록 함께 수정해야 새 '기타' 항목이 '시험계획누적'에 반영됨 (해당 파일 별도 안내).
 * ===============================================================
 * VERSION: V1.22.0
 * - [버그수정 · 데이터 유실] handleUpdateMasterSchedule의 '이동'(날짜/기간/장비 변경) 분기가 기존
 *   위치의 원본 셀부터 지우고 나서(흰색 리셋) 새 위치에 빈 자리가 있는지 확인하고 있었음. 그래서
 *   예를 들어 기간을 1일→2일로 늘렸는데 늘어난 날짜 쪽에서 해당 장비의 모든 행이 이미 다른
 *   일정으로 차 있으면, findWritableRank가 -1을 반환해 반영은 실패로 끝나면서도 기존 셀은 이미
 *   지워진 뒤라 원본 시트에서 그 일정이 통째로 사라지는 문제가 있었음(반영도 실패, 기존 내용도 소실).
 *   → 새 위치의 빈 자리 확인(findWritableRank)을 먼저 수행하고, 자리가 없으면 기존 셀을 전혀
 *     건드리지 않고 즉시 fail을 반환하도록 순서를 바꿔 기존 일정이 항상 보존되도록 수정.
 * - [개선] 새 위치 반영 중 일부 날짜만 반영되고 나머지는 누락되는 경우(예: 해당 날짜의 월별 탭을
 *   못 찾음)도 pushToAppInput과 동일하게 filledDays/totalDays를 비교해 warning으로 알리도록 추가
 *   (예전에는 이 경우도 조용히 'success'만 반환해 일부 날짜 누락을 알아채기 어려웠음).
 * ===============================================================
 * VERSION: V1.21.0
 * - [버그수정] handleUpdateMasterSchedule이 기존(원래) 위치의 원본 셀을 찾을 때 cell.getValue()와
 *   orig.desc(= '시험계획누적' 스냅샷에서 읽어온 값)를 그대로 === 비교하고 있었음. orig.desc의 출처인
 *   '시험계획누적'과 실제 비교 대상인 월별 탭 원본 셀은 서로 다른 시트라서, 줄바꿈 표기(\r\n vs \n)나
 *   앞뒤 공백 등 사소한 차이만 있어도 "다른 문자열"로 판정되어 조용히 매칭에 실패 — 새 위치에는
 *   정상 반영되지만 기존 위치 셀은 비워지지 않는 현상의 원인이었음.
 *   → normalizeCellText()로 양쪽을 정규화한 뒤 비교하도록 수정 (content-only 수정 분기, 이동 분기 모두).
 * - [개선] 위 매칭 실패가 다시 발생하더라도 이제 조용히 넘어가지 않고, 실제로 지워진 셀 수
 *   (clearedCount/touched)를 세어 기대치보다 적으면 응답에 warning 메시지를 포함하도록 변경.
 *   클라이언트가 "성공"으로만 처리해 문제를 놓치지 않도록, HTML 쪽에서도 이 warning을 토스트로
 *   노출하도록 함께 수정 필요.
 * - [참고 · 버그 아님] '시험계획누적'은 별도로 운영 중인 copyAndPasteWithMergedCellsOptimized()
 *   스크립트가 월별 탭을 재스캔해서 만드는 파생 스냅샷이며, 이 파일의 updateMasterSchedule은
 *   그 스냅샷이 아니라 월별 탭 원본 셀에 직접 쓴다. 따라서 저장 직후 원본 시트에는 바로 반영되어도,
 *   앱 화면(시험계획누적 기반)에는 그 외부 스크립트가 다음에 재실행될 때까지 반영이 지연되는 것이
 *   정상 동작이다 (버그 리포트 시 이 지연과 "원본 셀 미삭제" 버그를 혼동하지 않도록 주의).
 * ===============================================================
 * VERSION: V1.20.0
 * - [성능개선] pushToAppInput/updateMasterSchedule의 배경색(음영) 적용을 날짜마다 개별
 *   setBackground() 호출하던 방식에서, 탭+행별로 모아 Range 단위로 한 번에 적용하도록 변경.
 *   (기간이 길수록 API 호출이 늘어 15초 타임아웃·재시도가 잦아지던 문제 완화 — 실사용 중 16일
 *   반영 시 3회 재시도 관측됨)
 * - [버그수정] V1.19.0의 resolveMonthlyTabName이 날짜 범위를 절대시각(getTime())으로 비교하다가,
 *   new Date("yyyy-MM-dd") 파싱(UTC 자정 = 한국시간 오전 9시)과 시트에서 읽은 날짜(한국시간 자정)
 *   사이의 9시간 차이 때문에 탭의 정확히 "마지막 날"이 근소한 차이로 범위 밖 판정되던 문제 수정.
 *   → isBetweenCalendarDays()를 추가해 시/분/초를 무시하고 연/월/일 성분만으로 비교하도록 변경.
 * - [버그수정 · 핵심원인] 월별 탭이 달력 월과 정확히 일치하지 않고(4~5주 단위로 이어지는 순환 구조,
 *   예: '26년9월' 탭이 실제로는 8/31~10/4까지 담당) 이름만으로 탭을 계산하던 getMonthlyTabName()
 *   결과와 실제 탭이 어긋나, 탭 경계에 걸친 기간(예: 10/1~10/16처럼 앞 며칠이 이전 탭 소속인 경우)을
 *   반영하면 그 며칠의 날짜 칼럼을 못 찾아 findWritableRank가 -1을 반환하고 기간 전체가 반영되지
 *   않던 문제 수정 (pushToAppInput/updateMasterSchedule/updateMasterProgressStatus 공통 영향).
 *   → resolveMonthlyTabName()을 추가해 이름으로 계산한 탭 + 앞/뒤 달 이름의 탭까지 확인해서,
 *     실제 날짜범위(E11:BU11의 첫/끝 날짜)에 해당 날짜가 포함되는 진짜 탭을 찾도록 변경.
 * - [신규] 앱에서 등록한 일정을 원본 '시험계획표' 월별 탭에 반영(pushToAppInput)할 때
 *   반영된 셀에 항목별로 랜덤한 파스텔톤 배경색(randomVisibleColor)을 입혀 오퍼레이터가
 *   구분하기 쉽도록 함 (🔒 마스터 일정 이동 시의 고정색과 달리, 앱 등록 일정은 매번 무작위 색상).
 * - [신규] 🔒 마스터 일정의 진행상태(완료/진행) 원클릭 변경 지원 (updateMasterProgressStatus)
 *   월별 탭의 '진행결과' 칸(내용 칸 바로 오른쪽 열)에 직접 반영. 원본 파이프라인이
 *   '완료' 또는 공란만 인식하므로 이 두 값만 허용('지연'은 지원하지 않음 — 클라이언트에서도 숨김).
 * - [신규] 🔒 업무현황 자동연동(마스터) 일정 양방향 동기화 (updateMasterSchedule)
 *   편집 권한자가 앱에서 마스터 일정을 수정하면, 앱 자체 Schedules 시트가 아니라
 *   원본 '시험계획표' 월별 탭의 실제 셀에 직접 반영합니다.
 *   ('시험계획누적'은 월별 탭을 매번 통째로 재스캔해서 만드는 파생 스냅샷이라
 *    거기에 직접 쓰면 다음 재생성 때 사라지므로, 반드시 월별 탭 원본 셀을 고쳐야 함)
 *   - 내용만 수정(시작일/기간/장비 동일): 기존 셀을 찾아 값만 교체, 셀 배경색(음영)은 그대로 유지
 *   - 이동(시작일/기간/장비 중 하나라도 변경): 기존 셀을 비우고 흰색으로 리셋 후,
 *     새 위치에 값을 쓰고 앱에서 반영했음을 표시하는 고정 배경색(APP_HIGHLIGHT_COLOR)을 입힘
 * - [버그수정] 자동계획 수립의 '상세내용'을 원본 '시험계획표' 월별 탭에 반영할 때,
 *   buildAppInputContent()가 앞에 'ㄴ 설명 : '을 자동으로 붙이던 것을 제거.
 *   → 상세내용에 이미 'ㄴ 시험항목 : ...'처럼 사용자가 직접 접두어를 적는 경우
 *     'ㄴ 설명 : ㄴ 시험항목 : ...'로 중복 표시되던 문제 수정. 이제 상세내용을 입력한 그대로 반영합니다.
 * - [버그수정 · 핵심원인] '시험계획누적' 탭의 계획일자/종료일자가 실제 Date가 아니라
 *   "2026.06.29"같은 텍스트로 입력되어 있어, readMasterSchedules()의
 *   `startDateRaw instanceof Date` 검사에 전부 걸려 모든 행이 조용히 건너뛰어지고
 *   결과가 통째로 빈 배열이 되던 문제 수정 (서버 연결은 정상인데 원본시트 계획만 안 불러와지는 증상).
 *   → parseFlexibleDate()를 추가해 실제 Date 타입은 물론 "yyyy.mm.dd" / "yyyy-mm-dd" /
 *     "yyyy/mm/dd" 형태의 텍스트 날짜도 함께 인식하도록 변경 (readMasterSchedules 참고).
 * - [버그수정 · 핵심원인] 자동 시험계획 등록 시 원본 '시험계획표' 월별 탭에 같은 시험 기간이
 *   1행/2행/3행 등 여러 우선순위 행에 통째로 중복 기록되던 문제 수정.
 *   → 원인: 서버 처리가 15초를 넘으면 클라이언트(gasPost/fetchWithRetry)가 요청을 끊고 동일 요청을
 *     최대 2회까지 재시도하는데, Apps Script는 클라이언트 연결이 끊겨도 서버에서는 계속 실행되므로
 *     같은 pushToAppInput 요청이 실제로 2~3번 실행되어 매번 다음 빈 우선순위 행에 반복 기록됨.
 *   → 조치: handlePushToAppInput이 각 칸에 "이미 동일한 내용이 있으면 다시 쓰지 않고 성공 처리"하도록
 *     멱등(idempotent)하게 변경 (findWritableRank / writeAtRank 참고). 몇 번을 재시도해도 같은 행
 *     하나에만 반영됩니다. 또한 월별 탭 데이터를 탭당 1회만 읽도록 캐시하여(getMonthlyTabCache)
 *     처리 속도를 개선, 애초에 15초 타임아웃이 발생할 확률도 낮췄습니다.
 * - 자동연동 원본 시트를 '업무현황'에서 '시험계획누적'으로 변경 (컬럼 구조 동일, 장비번호 누락 이슈 회피 목적)
 * - '시험계획표' 스프레드시트의 '시험계획누적' 시트를 자동으로 읽어와
 *   일정 목록에 반영합니다. (id가 'master_'로 시작하는 항목)
 * - 자동연동 일정은 원본 시트가 진실의 원천(source of truth)이므로
 *   앱에서는 조회만 가능하고 수정/삭제는 차단됩니다.
 * ===============================================================
 * [설치 방법]
 * 1. 새 구글 스프레드시트를 만듭니다. (시트 이름은 자유롭게)
 * 2. 상단 메뉴 [확장 프로그램] > [Apps Script] 클릭
 * 3. 기본으로 생성된 코드를 모두 지우고 이 파일 내용 전체를 붙여넣습니다.
 * 4. 저장(Ctrl+S) 후 상단 [배포] > [새 배포] 클릭
 * 5. 유형 선택(⚙️)에서 "웹 앱" 선택
 *    - 실행 계정: 나(본인)
 *    - 액세스 권한이 있는 사용자: 전체(익명 사용자 포함)
 * 6. [배포] 클릭 후 나오는 "웹 앱 URL"을 복사합니다.
 * 7. HTML 앱의 최초 설정 화면에 이 URL을 붙여넣으면 연동이 시작됩니다.
 * ※ 이미 운영 중인 스크립트를 업데이트할 때는 4번 대신 [배포] > [배포 관리] > 연필(수정) >
 *   버전: "새 버전" > [배포]로 해야 웹 앱 URL이 바뀌지 않습니다.
 *
 * [자동 생성되는 시트]
 * - Users      : username, password, name, role, createdAt
 * - Schedules  : id, title, eqId, startDate, duration, owner, desc, status, createdBy, updatedAt, progressStatus
 * - Requests   : id, username, name, message, status, createdAt, resolvedAt
 * - History    : id, scheduleId, scheduleTitle, changedBy, changedAt, oldSummary, newSummary, reason
 *
 * [참고] 최초 회원가입 1명은 자동으로 관리자(admin)가 됩니다.
 * ===============================================================
 */

const GAS_VERSION = 'V9.1';

const SHEET_USERS = 'Users';
const SHEET_SCHEDULES = 'Schedules';
const SHEET_REQUESTS = 'Requests';
const SHEET_HISTORY = 'History';
const SHEET_MEMOS = 'Memos';
const SHEET_MEMO_CATEGORIES = 'MemoCategories';
const SHEET_PROTECTION = 'ScheduleProtection'; // V1.29.0: 밀리면 안 되는 일정(보호) 표시 — 마스터 일정용 안정 키 저장소
const SHEET_BEAM_HOURS = 'MasterHours'; // V1.30.0: 배광UNIT 마스터 일정의 "하루 소요시간(시간)" — 안정 키 저장소(ScheduleProtection과 동일 키 방식)
const SHEET_RESCHEDULE = 'MasterReschedule'; // V1.31.0: 미입고 마스터 일정의 "재일정 수립됨" 표시 — 안정 키 저장소
const SHEET_SHIFT = 'MasterShift'; // V1.32.0: 배광UNIT 마스터 일정의 "주간/야간 수동 지정" — 안정 키 저장소
const SHEET_ARRIVAL = 'MasterArrival'; // V1.37.5: 원본 일정 '입고완료' 표시 — 안정 키 저장소
const SHEET_REVIEWS = 'MasterReviews'; // V1.36.0: 마스터 일정 결과 리뷰 — 안정 키('장비+원본 셀 내용') 저장소
const SHEET_SEQ_GROUPS = 'SequenceGroups'; // V1.33.0: 연계 시험 그룹 메타(이름/최대간격)
const SHEET_SEQ_MEMBERS = 'SequenceMembers'; // V1.33.0: 연계 시험 그룹 소속(순서 포함)

// '시험계획누적' 마스터 시트가 들어있는 원본 스프레드시트
// (주의: 이 스크립트를 배포하는 계정이 아래 시트의 열람 권한을 가지고 있어야 합니다)
const MASTER_SPREADSHEET_ID = '1x-Aroa21z06fa0UIAzWyINgq7mW6jJKFPCp-WhgxXwM';
const MASTER_SHEET_NAME = '시험계획누적'; // V1.15.0: '업무현황'(작성중 포함) 대신 완료건만 누적되는 원본으로 변경
const APP_HIGHLIGHT_COLOR = '#c7d2fe'; // V1.16.0: 앱에서 반영/이동한 항목 표시용 고정 배경색 (인디고 계열)

// V1.27.0: getMonthlyTabCache가 캐싱하는 내용 영역의 좌표 상수 (matchRows 계산 범위 B13:B105와 동일한 행 범위,
// 열은 날짜 칼럼이 시작되는 E열부터 마지막 날짜 칼럼인 BU열까지)
const CONTENT_ROW_START = 13;
const CONTENT_ROW_COUNT = 93; // 13행 ~ 105행
const CONTENT_COL_START = 5;  // E열
const CONTENT_COL_COUNT = 69; // E열(5) ~ BU열(73)

// V9.0: 🔑 접속 비밀번호 — 프로젝트 설정 → 스크립트 속성에 ACCESS_CODE(원하는 비밀번호)를 넣으면 켜짐
function accessCodeValue() { try { return String(PropertiesService.getScriptProperties().getProperty('ACCESS_CODE') || '').trim(); } catch (e) { return ''; } }
function accessOk(k) { const c = accessCodeValue(); return !c || String(k || '').trim() === c; }
function accessDeniedResponse() { return jsonResponse({ status: 'fail', accessDenied: true, message: '접속 비밀번호가 필요합니다.' }); }
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'read';
    if (action === 'checkAccess') { // V9.0
      const ak = e.parameter.ak;
      return jsonResponse({ status: 'success', required: !!accessCodeValue(), ok: accessOk(ak), version: GAS_VERSION });
    }
    if (action !== 'version' && !accessOk(e.parameter.ak)) return accessDeniedResponse(); // V9.0
    if (action === 'read') {
      return jsonResponse({ status: 'success', data: readAll() });
    }
    if (action === 'getHistory') {
      return jsonResponse({ status: 'success', data: getHistoryForSchedule(e.parameter.scheduleId, e.parameter.eqId, e.parameter.rawContent, e.parameter.title) });
    }
    if (action === 'getMemosForDate') {
      return jsonResponse({ status: 'success', data: getMemosForDate(e.parameter.date) });
    }
    if (action === 'getAllMemoDates') {
      return jsonResponse({ status: 'success', data: getAllMemoDates() });
    }
    if (action === 'getAllMemos') {
      return jsonResponse({ status: 'success', data: getAllMemos() });
    }
    if (action === 'getMemoCategories') {
      return jsonResponse({ status: 'success', data: getMemoCategories() });
    }
    if (action === 'getActiveReminders') {
      return jsonResponse({ status: 'success', data: getActiveReminders() });
    }
    if (action === 'getMonthHistory') { // V1.37.4
      return jsonResponse({ status: 'success', data: getMonthHistory(e.parameter.month) });
    }
    if (action === 'syncStatus') { // V5.3
      return jsonResponse({ status: 'success', data: getSyncInfo(true) });
    }
    if (action === 'version') {
      return jsonResponse({ status: 'success', data: GAS_VERSION }); // V1.37.0: 배포된 서버 버전 확인용
    }
    return jsonResponse({ status: 'fail', message: 'Unknown GET action: ' + action });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// V1.37.0: 저장 요청은 잠금(LockService)으로 한 번에 하나씩 처리하고,
// 같은 요청 고유번호(_reqId)는 10분간 기억해 재시도가 와도 한 번만 실행한다.
function doPost(e) {
  let lock = null;
  try {
    const action = e.parameter.action;
    const body = JSON.parse(e.postData.contents || '{}');
    if (!accessOk(e.parameter.ak || body._ak)) return accessDeniedResponse(); // V9.0: 🔑 접속 비밀번호
    if (action === 'exportRunNow') return jsonResponse(handleExportRunNow(body)); // V7.0: 저장 잠금 없이 실행(오래 걸려도 다른 저장을 막지 않음)

    lock = LockService.getScriptLock();
    if (!lock.tryLock(25000)) {
      return jsonResponse({ status: 'error', busy: true, message: '서버가 다른 저장을 처리 중입니다. 잠시 후 다시 시도해주세요.' }); // V1.37.7: busy
    }

    // 잠금을 얻은 "뒤에" 확인해야, 첫 요청이 아직 처리 중일 때 들어온 재시도도 정확히 걸러짐
    const reqId = body._reqId ? String(body._reqId) : '';
    const cache = CacheService.getScriptCache();
    if (reqId) {
      const cached = cache.get('req_' + reqId);
      if (cached) return ContentService.createTextOutput(cached).setMimeType(ContentService.MimeType.JSON);
    }

    MASTER_PATCH_OUT = { rows: [], removed: [] }; // V4.9
    const result = routePostAction(action, body);
    try { if (result && result.status === 'success') markExportDirtyFromRequest(action, body); } catch (eDirty) {} // V5.3
    if (result && typeof result === 'object' && (MASTER_PATCH_OUT.rows.length || MASTER_PATCH_OUT.removed.length)) result.masterPatch = MASTER_PATCH_OUT;
    MASTER_PATCH_OUT = null;
    invalidateMasterFastCache(); // V4.8: 저장 후 다음 불러오기는 원본을 새로 읽음
    const text = JSON.stringify(result);
    if (reqId && text.length < 90000) cache.put('req_' + reqId, text, 600); // 10분 기억
    return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  } finally {
    if (lock) { try { lock.releaseLock(); } catch (e2) {} }
  }
}

function routePostAction(action, body) {
  if (isLocalMode() && LOCAL_HANDLED_ACTIONS[action]) return handleLocalAction(action, body); // V5.3
  switch (action) {
    case 'exportNow': return handleExportNow(body); // V5.3
    case 'retryMirror': return handleRetryMirror(body); // V5.3
    case 'login': return handleLogin(body);
    case 'register': return handleRegister(body);
    case 'saveSchedule': return handleSaveSchedule(body);
    case 'updateMasterSchedule': return handleUpdateMasterSchedule(body);
    case 'syncAppSchedule': return handleSyncAppSchedule(body); // V1.37.1
    case 'markNightShift': return handleMarkNightShift(body); // V1.37.2
    case 'markNightShiftBatch': return handleMarkNightShiftBatch(body); // V1.37.8
    case 'updateMasterProgressStatus': return handleUpdateMasterProgressStatus(body);
    case 'deleteSchedule': return handleDeleteSchedule(body);
    case 'deleteMasterSchedule': return handleDeleteMasterSchedule(body); // V1.37.6
    case 'requestPermission': return handleRequestPermission(body);
    case 'resolveRequest': return handleResolveRequest(body);
    case 'updateUserRole': return handleUpdateUserRole(body);
    case 'deleteUser': return handleDeleteUser(body);
    case 'changePassword': return handleChangePassword(body);
    case 'addHistory': return handleAddHistory(body);
    case 'reassignScheduleHistory': return handleReassignScheduleHistory(body); // V1.34.0
    case 'updateProgressStatus': return handleUpdateProgressStatus(body);
    case 'pushToAppInput': return handlePushToAppInput(body);
    case 'bulkAddSchedules': return handleBulkAddSchedules(body);
    case 'saveMemo': return handleSaveMemo(body);
    case 'deleteMemo': return handleDeleteMemo(body);
    case 'saveMemoCategory': return handleSaveMemoCategory(body);
    case 'deleteMemoCategory': return handleDeleteMemoCategory(body);
    case 'markReminderDone': return handleMarkReminderDone(body);
    case 'setMasterProtection': return handleSetMasterProtection(body); // V1.29.0
    case 'setMasterHours': return handleSetMasterHours(body); // V1.30.0
    case 'setMasterReschedule': return handleSetMasterReschedule(body); // V1.31.0
    case 'setMasterShift': return handleSetMasterShift(body); // V1.32.0
    case 'setMasterReview': return handleSetMasterReview(body); // V1.36.0
    case 'setMasterArrival': return handleSetMasterArrival(body); // V1.37.5
    case 'saveSequenceGroup': return handleSaveSequenceGroup(body); // V1.33.0
    case 'deleteSequenceGroup': return handleDeleteSequenceGroup(body); // V1.33.0
    default: return { status: 'fail', message: 'Unknown POST action: ' + action };
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getSS() { return SpreadsheetApp.getActiveSpreadsheet(); }

function getOrCreateSheet(name, headers) {
  const ss = getSS();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
  }
  return sh;
}

function usersSheet() { return getOrCreateSheet(SHEET_USERS, ['username', 'password', 'name', 'role', 'createdAt']); }
function schedulesSheet() {
  const sh = getOrCreateSheet(SHEET_SCHEDULES, ['id', 'title', 'eqId', 'startDate', 'duration', 'owner', 'desc', 'status', 'createdBy', 'updatedAt']);
  ensureHeaderColumn(sh, 'progressStatus'); // V1.5.0: 기존 시트에도 자동으로 컬럼 추가
  ensureHeaderColumn(sh, 'protected'); // V1.29.0: 밀리면 안 되는 일정(보호) 여부
  ensureHeaderColumn(sh, 'protectReason'); // V1.29.0: 보호 사유(자유 텍스트, 참고용)
  ensureHeaderColumn(sh, 'dailyHours'); // V1.30.0: 배광UNIT 일정의 "하루 소요시간(시간)" — 그 외 장비는 사용 안 함
  ensureHeaderColumn(sh, 'rescheduled'); // V1.31.0: "미입고 → 재일정 수립됨" 표시(앱 등록 일정용)
  ensureHeaderColumn(sh, 'shiftOverride'); // V1.32.0: 배광UNIT "주간/야간 수동 지정" — 'day'|'night'|''(자동판정)
  return sh;
}
// V1.29.0: 마스터(자동연동) 일정의 보호 여부를 저장하는 시트. id 대신 "장비+원본 셀 내용" 정규화 키를 씀
// (마스터 id는 원본 재동기화 시 행 번호가 바뀌어 끊길 수 있어, 결과 리뷰와 달리 이번엔 안정 키로 설계)
function protectionSheet() {
  return getOrCreateSheet(SHEET_PROTECTION, ['key', 'protected', 'reason', 'updatedBy', 'updatedAt']);
}
// V1.30.0: 배광UNIT 마스터 일정의 "하루 소요시간(시간)" 저장 — protectionSheet와 동일한 안정 키(eqId+rawContent) 방식
function beamHoursSheet() {
  return getOrCreateSheet(SHEET_BEAM_HOURS, ['key', 'dailyHours', 'updatedBy', 'updatedAt']);
}
function buildProtectionKey(eqId, rawContent) {
  return String(eqId || '') + '::' + normalizeCellText(rawContent);
}
function readMasterProtections() {
  const rows = sheetToObjects(protectionSheet());
  const map = {};
  rows.forEach(function (r) { if (r.key) map[r.key] = r; });
  return map;
}
function readMasterHours() {
  const rows = sheetToObjects(beamHoursSheet());
  const map = {};
  rows.forEach(function (r) { if (r.key) map[r.key] = r; });
  return map;
}
// V1.31.0: 미입고 마스터 일정의 "재일정 수립됨" 표시 — protectionSheet와 동일한 안정 키(eqId+rawContent) 방식.
// 원본 셀은 절대 건드리지 않고(미입고 상태 그대로 유지), 별도 시트에만 "이미 재일정 만들어졌음" 표시를 남긴다.
function rescheduleSheet() {
  return getOrCreateSheet(SHEET_RESCHEDULE, ['key', 'rescheduled', 'updatedBy', 'updatedAt']);
}
function readMasterReschedules() {
  const rows = sheetToObjects(rescheduleSheet());
  const map = {};
  rows.forEach(function (r) { if (r.key) map[r.key] = r; });
  return map;
}
// V1.32.0: 배광UNIT 마스터 일정의 "주간/야간 수동 지정" — 위와 동일한 안정 키 방식.
// V1.36.0: 🔒 마스터 일정의 '결과 리뷰' — 예전에는 review_<master_행번호> 레코드로 저장돼 재집계로 행이 밀리면
// 다른 일정에 붙었음. 이제 안정 키로 저장하고, 마스터 수정 시 migrateMasterKeys가 새 키로 이관한다.
function reviewsSheet() {
  return getOrCreateSheet(SHEET_REVIEWS, ['key', 'reviewText', 'updatedBy', 'updatedAt']);
}
function readMasterReviews() {
  const rows = sheetToObjects(reviewsSheet());
  const map = {};
  rows.forEach(function (r) { if (r.key) map[r.key] = r; });
  return map;
}
// V1.37.5: 📥 원본 일정 '입고완료' 표시
function arrivalSheet() {
  return getOrCreateSheet(SHEET_ARRIVAL, ['key', 'arrived', 'updatedBy', 'updatedAt']);
}
function readMasterArrivals() {
  const rows = sheetToObjects(arrivalSheet());
  const map = {};
  rows.forEach(function (r) { if (r.key) map[r.key] = r; });
  return map;
}
function handleSetMasterArrival(body) {
  const eqId = body.eqId;
  const rawContent = body.rawContent;
  if (!eqId || rawContent === undefined || rawContent === null || rawContent === '') {
    return { status: 'fail', message: '잘못된 요청입니다.' };
  }
  const key = buildProtectionKey(eqId, rawContent);
  const sh = arrivalSheet();
  const data = sh.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key) { rowIndex = i + 1; break; }
  }
  if (!body.arrived) { // 해제는 행 삭제
    if (rowIndex > -1) sh.deleteRow(rowIndex);
    return { status: 'success' };
  }
  const row = [key, 'TRUE', body.updatedBy || '', new Date().toISOString()];
  if (rowIndex > -1) sh.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);
  return { status: 'success' };
}
function shiftSheet() {
  return getOrCreateSheet(SHEET_SHIFT, ['key', 'shift', 'updatedBy', 'updatedAt']);
}
function readMasterShifts() {
  const rows = sheetToObjects(shiftSheet());
  const map = {};
  rows.forEach(function (r) { if (r.key) map[r.key] = r; });
  return map;
}

// V1.33.0: 🔗 연계 시험(순서가 이어지는 시험들) 그룹 — 앱 등록/마스터 일정을 섞어서 묶을 수 있도록,
// 각 멤버는 memberKey('app:'+id 또는 'master:'+eqId+rawContent 안정키)로 식별한다.
function sequenceGroupsSheet() {
  return getOrCreateSheet(SHEET_SEQ_GROUPS, ['groupId', 'name', 'maxGapDays', 'createdBy', 'createdAt']);
}
function sequenceMembersSheet() {
  return getOrCreateSheet(SHEET_SEQ_MEMBERS, ['groupId', 'order', 'memberKey', 'memberType']);
}
function buildSequenceMemberKey(m) {
  return m.isMaster ? ('master:' + buildProtectionKey(m.eqId, m.rawContent)) : ('app:' + m.id);
}
// 두 시트를 조인해 그룹별 구조로 반환: [{ groupId, name, maxGapDays, members:[{order,memberKey,memberType}] }]
function readSequences() {
  const groups = sheetToObjects(sequenceGroupsSheet());
  const members = sheetToObjects(sequenceMembersSheet());
  const byGroup = {};
  groups.forEach(function (g) {
    byGroup[g.groupId] = { groupId: g.groupId, name: g.name || '', maxGapDays: Number(g.maxGapDays) || 2, members: [] };
  });
  members.forEach(function (m) {
    if (byGroup[m.groupId]) {
      byGroup[m.groupId].members.push({ order: Number(m.order) || 0, memberKey: m.memberKey, memberType: m.memberType });
    }
  });
  const result = Object.keys(byGroup).map(function (k) { return byGroup[k]; });
  result.forEach(function (g) { g.members.sort(function (a, b) { return a.order - b.order; }); });
  // V8.5: 연계 그룹 고정 번호 — 스크립트 속성 SEQ_NO_MAP {groupId: 번호, _next: 다음번호}
  try {
    const props = PropertiesService.getScriptProperties();
    let map = {}; try { map = JSON.parse(props.getProperty('SEQ_NO_MAP') || '{}') || {}; } catch (e) { map = {}; }
    let next = Number(map._next) || 1, changed = false;
    Object.keys(map).forEach(function (k) { if (k !== '_next' && Number(map[k]) >= next) next = Number(map[k]) + 1; });
    result.slice().sort(function (a, b) { return String(a.groupId) < String(b.groupId) ? -1 : 1; }).forEach(function (g) {
      const id = String(g.groupId);
      if (!map[id]) { map[id] = next++; changed = true; }
      g.no = Number(map[id]);
    });
    if (changed) { map._next = next; props.setProperty('SEQ_NO_MAP', JSON.stringify(map)); }
  } catch (e) {}
  return result;
}
function handleSaveSequenceGroup(body) {
  const groupId = body.groupId || ('seq_' + Date.now());
  const membersIn = body.members || [];
  if (!body.name && !membersIn.length) return { status: 'fail', message: '잘못된 요청입니다.' };
  const gsh = sequenceGroupsSheet();
  const gdata = gsh.getDataRange().getValues();
  let grow = -1;
  for (let i = 1; i < gdata.length; i++) { if (String(gdata[i][0]) === groupId) { grow = i + 1; break; } }
  const grow_values = [groupId, body.name || '', body.maxGapDays || 2, body.updatedBy || '', new Date().toISOString()];
  if (grow > -1) gsh.getRange(grow, 1, 1, grow_values.length).setValues([grow_values]);
  else gsh.appendRow(grow_values);

  // 기존 멤버 행 전부 삭제 후 새로 씀(수정 시 순서/구성이 통째로 바뀔 수 있으므로 덮어쓰기가 안전)
  const msh = sequenceMembersSheet();
  const mdata = msh.getDataRange().getValues();
  for (let i = mdata.length - 1; i >= 1; i--) {
    if (String(mdata[i][0]) === groupId) msh.deleteRow(i + 1);
  }
  membersIn.forEach(function (m, idx) {
    const memberKey = buildSequenceMemberKey(m);
    msh.appendRow([groupId, idx + 1, memberKey, m.isMaster ? 'master' : 'app']);
  });
  return { status: 'success', groupId: groupId };
}
function handleDeleteSequenceGroup(body) {
  const groupId = body.groupId;
  if (!groupId) return { status: 'fail', message: '잘못된 요청입니다.' };
  const gsh = sequenceGroupsSheet();
  const gdata = gsh.getDataRange().getValues();
  for (let i = gdata.length - 1; i >= 1; i--) {
    if (String(gdata[i][0]) === groupId) gsh.deleteRow(i + 1);
  }
  const msh = sequenceMembersSheet();
  const mdata = msh.getDataRange().getValues();
  for (let i = mdata.length - 1; i >= 1; i--) {
    if (String(mdata[i][0]) === groupId) msh.deleteRow(i + 1);
  }
  return { status: 'success' };
}
function requestsSheet() { return getOrCreateSheet(SHEET_REQUESTS, ['id', 'username', 'name', 'message', 'status', 'createdAt', 'resolvedAt']); }
function historySheet() {
  const sh = getOrCreateSheet(SHEET_HISTORY, ['id', 'scheduleId', 'scheduleTitle', 'changedBy', 'changedAt', 'oldSummary', 'newSummary', 'reason']);
  ensureHeaderColumn(sh, 'stableKey'); // V1.35.0: 🔒 마스터 일정 이력을 '장비+원본 셀 내용' 안정 키로 연결(master_행번호는 재집계 시 다른 일정을 가리킬 수 있음)
  return sh;
}
// V1.35.0: 마스터 일정 이력의 안정 키 — 보호/소요시간/재일정/연계 그룹과 동일한 키 방식(buildProtectionKey 재사용)
function buildHistoryStableKey(eqId, rawContent) {
  return 'master:' + buildProtectionKey(eqId, rawContent);
}
function memosSheet() {
  const sh = getOrCreateSheet(SHEET_MEMOS, ['id', 'date', 'title', 'content', 'createdBy', 'createdAt', 'updatedAt']);
  ensureHeaderColumn(sh, 'images'); // V1.10.0: 이미지 URL 목록(JSON 문자열) 저장용
  ensureHeaderColumn(sh, 'category'); // V1.13.0: 분류(회의록/장비점검/공지사항/기타)
  ensureHeaderColumn(sh, 'reminderDates'); // V1.26.0: 본문에서 인식된 리마인드 날짜 목록(JSON 배열)
  ensureHeaderColumn(sh, 'reminderDone'); // V1.26.0: 사용자가 '확인함' 처리한 리마인드 날짜 목록(JSON 배열, reminderDates의 부분집합)
  return sh;
}

// 메모 분류(카테고리) 시트: 사용자가 앱에서 직접 추가/수정/삭제 가능
function memoCategoriesSheet() {
  const sh = getOrCreateSheet(SHEET_MEMO_CATEGORIES, ['id', 'name', 'icon', 'color', 'sortOrder']);
  if (sh.getLastRow() < 2) {
    // 최초 생성 시 기존과 동일한 기본 4종을 시드
    sh.appendRow(['cat_1', '회의록', '📋', 'indigo', 1]);
    sh.appendRow(['cat_2', '장비점검', '🔧', 'orange', 2]);
    sh.appendRow(['cat_3', '공지사항', '📢', 'rose', 3]);
    sh.appendRow(['cat_4', '기타', '📎', 'slate', 4]);
  }
  return sh;
}

// 이미 존재하는 시트에 새 컬럼이 없으면 헤더 끝에 추가 (기존 데이터는 그대로 유지)
function ensureHeaderColumn(sh, columnName) {
  const lastCol = sh.getLastColumn();
  const headers = lastCol > 0 ? sh.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  if (headers.indexOf(columnName) === -1) {
    sh.getRange(1, headers.length + 1).setValue(columnName);
  }
}

function sheetToObjects(sh) {
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  const tz = Session.getScriptTimeZone();
  return values.slice(1)
    .filter(r => r.some(c => c !== '' && c !== null))
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => {
        let v = r[i];
        // 시트가 날짜 텍스트를 자동으로 실제 Date 타입으로 바꿔버린 경우,
        // JSON으로 내보낼 때 시간대가 붙은 타임스탬프가 되어 클라이언트 날짜 비교가 깨짐 → 순수 날짜 문자열로 통일
        if (v instanceof Date) {
          v = Utilities.formatDate(v, tz, 'yyyy-MM-dd');
        }
        obj[h] = v;
      });
      return obj;
    });
}

// 로그인용 응답에는 비밀번호를 절대 포함하지 않습니다.
// V4.8: ⏱ 단계별 소요시간(ms) — 웹앱 🔄 버튼 툴팁/콘솔에 표시해 느린 구간을 찾음
let READ_TIMING = null;
function tmark(label) { if (!READ_TIMING) return; const now = Date.now(); READ_TIMING[label] = (READ_TIMING[label] || 0) + (now - READ_TIMING.__last); READ_TIMING.__last = now; }
function readAll() {
  READ_TIMING = { __start: Date.now(), __last: Date.now() };
  const users = sheetToObjects(usersSheet()).map(u => ({ username: u.username, name: u.name, role: u.role }));
  tmark('users');
  const manualSchedules = sheetToObjects(schedulesSheet());
  tmark('appSchedules');
  manualSchedules.forEach(function (s) {
    // V1.29.0: 시트엔 'TRUE'/'FALSE' 텍스트(또는 빈칸)로 저장되므로 boolean으로 정리해서 내보냄
    s.protected = String(s.protected).toUpperCase() === 'TRUE';
    s.protectReason = s.protectReason || '';
    // V1.30.0: dailyHours는 빈칸이면 null(=미입력, 클라이언트가 추정), 값 있으면 숫자로
    s.dailyHours = (s.dailyHours === '' || s.dailyHours === undefined || s.dailyHours === null) ? null : Number(s.dailyHours);
    s.rescheduled = String(s.rescheduled).toUpperCase() === 'TRUE'; // V1.31.0
    s.shiftOverride = s.shiftOverride || ''; // V1.32.0: 'day'|'night'|''
  });
  const masterSchedules = readMasterSchedulesSafe(); // V1.37.3: 실패·빈 결과 시 재시도 + 마지막 정상본 사용
  tmark('master');
  const protections = readMasterProtections(); // V1.29.0: 마스터 일정 보호 여부 별도 매칭
  const hours = readMasterHours(); // V1.30.0: 마스터 일정 배광UNIT 소요시간 별도 매칭
  const reschedules = readMasterReschedules(); // V1.31.0: 마스터 일정 재일정 수립 여부 별도 매칭
  const shifts = readMasterShifts(); // V1.32.0: 마스터 일정 주간/야간 수동 지정 별도 매칭
  const reviews = readMasterReviews(); // V1.36.0: 마스터 일정 결과 리뷰 별도 매칭
  const arrivals = readMasterArrivals(); // V1.37.5: 입고완료 표시
  tmark('auxSheets');
  masterSchedules.forEach(function (s) {
    const key = buildProtectionKey(s.eqId, s.rawContent);
    const p = protections[key];
    s.protected = !!(p && String(p.protected).toUpperCase() === 'TRUE');
    s.protectReason = p ? (p.reason || '') : '';
    const h = hours[key];
    s.dailyHours = (h && h.dailyHours !== '' && h.dailyHours !== undefined) ? Number(h.dailyHours) : null;
    const r = reschedules[key];
    s.rescheduled = !!(r && String(r.rescheduled).toUpperCase() === 'TRUE');
    const sh = shifts[key];
    s.shiftOverride = sh ? (sh.shift || '') : '';
    const rv = reviews[key];
    s.resultReviewText = rv ? String(rv.reviewText || '') : '';
    const av = arrivals[key];
    s.arrived = !!(av && String(av.arrived).toUpperCase() === 'TRUE');
  });
  const schedules = masterSchedules.concat(manualSchedules); // 자동연동 + 앱에서 직접 등록한 일정
  // V1.33.0: 🔗 연계 시험 그룹 소속 표시 — 각 일정의 memberKey를 계산해 그룹 멤버 목록과 매칭
  tmark('merge');
  const sequences = readSequences();
  tmark('sequences');
  const memberIndex = {}; // memberKey -> { groupId, order }
  sequences.forEach(function (g) {
    g.members.forEach(function (m) { memberIndex[m.memberKey] = { groupId: g.groupId, order: m.order }; });
  });
  schedules.forEach(function (s) {
    const key = (String(s.id).indexOf('master_') === 0)
      ? ('master:' + buildProtectionKey(s.eqId, s.rawContent))
      : ('app:' + s.id);
    const hit = memberIndex[key];
    s.sequenceGroupId = hit ? hit.groupId : null;
    s.sequenceOrder = hit ? hit.order : null;
  });
  const requests = sheetToObjects(requestsSheet());
  tmark('requests');
  const timing = {}; Object.keys(READ_TIMING).forEach(function (k) { if (k.indexOf('__') !== 0) timing[k] = READ_TIMING[k]; });
  timing.total = Date.now() - READ_TIMING.__start; READ_TIMING = null;
  let syncInfo = null; try { syncInfo = getSyncInfo(); } catch (e) {} // V5.3
  return { users, schedules, requests, masterStatus: LAST_MASTER_STATUS, timing: timing, syncInfo: syncInfo, sequences: sequences.map(function (g) { return { groupId: g.groupId, name: g.name, maxGapDays: g.maxGapDays }; }) };
}

// '계획일자'/'종료일자' 칸이 실제 Date 타입일 수도, "2026.06.29" 같은 텍스트일 수도 있어
// 두 경우 모두 인식하도록 하는 유연한 날짜 파서 (V1.15.3)
// 지원 형식: 실제 Date 객체, "yyyy.mm.dd" / "yyyy-mm-dd" / "yyyy/mm/dd" (일부 자리 0 생략 포함, 뒤에 다른 텍스트가 붙어있어도 앞부분만 인식)
function parseFlexibleDate(v) {
  if (v instanceof Date) return v;
  if (typeof v === 'string') {
    const m = v.trim().match(/^(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
    if (m) {
      const y = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, d = parseInt(m[3], 10);
      const dt = new Date(y, mo, d);
      if (!isNaN(dt.getTime())) return dt;
    }
  }
  return null;
}

// '시험계획누적' 시트를 읽어 일정 형식으로 변환합니다.
// 열 구성(A~F): 계획일자, 시험장비, 장비번호, 내용, 진행결과, 종료일자
// V1.37.3: 원본 읽기 안전장치 — 재시도 + 마지막 정상본(CacheService, 90KB 조각 단위) 사용
let LAST_MASTER_STATUS = { ok: true, stale: false, count: 0 };
const MASTER_CACHE_PREFIX = 'master_rows_v1_';
// V4.8: ⚡ 원본 읽기 단기 캐시 — 여러 사람이 1분마다 동기화해도 20초 안에는 원본 파일을 다시 열지 않음.
//   웹앱에서 저장(쓰기)하면 바로 무효화되어 다음 불러오기는 원본을 새로 읽음. 내용이 같으면 캐시를 다시 쓰지 않음.
const MASTER_FAST_TTL_MS = 20000;
// V4.9: ⚡ 즉시 반영 — 저장 요청 중 '시험계획누적'에 바꾼/추가한/지운 줄을 모아 응답(masterPatch)으로 돌려줌
//   웹앱은 전체를 다시 불러오지 않고 이 정보로 화면의 🔒 원본 일정을 바로 고침
let MASTER_PATCH_OUT = null;
function masterPatchRecord(kind, orig, rowArr, i) {
  if (!MASTER_PATCH_OUT) return;
  try {
    const tz = Session.getScriptTimeZone();
    const o = rowArr ? parseMasterRow(rowArr, i, tz) : null;
    const before = orig ? { id: orig.id || '', eqId: orig.eqId || '', startDate: String(orig.startDate || ''), rawContent: normalizeCellText(orig.rawContent || '') } : null;
    if (kind === 'remove' || !o) MASTER_PATCH_OUT.removed.push(before ? Object.assign({ rowId: 'master_' + (i + 1) }, before) : { rowId: 'master_' + (i + 1) });
    else MASTER_PATCH_OUT.rows.push({ before: before, row: o });
  } catch (e) {}
}
function invalidateMasterFastCache() { try { CacheService.getScriptCache().put(MASTER_CACHE_PREFIX + 'at', '0', 21600); } catch (e) {} }
function saveMasterCache(rows) {
  try {
    const cache = CacheService.getScriptCache();
    const text = JSON.stringify(rows);
    const hash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, text, Utilities.Charset.UTF_8));
    if (cache.get(MASTER_CACHE_PREFIX + 'hash') === hash && cache.get(MASTER_CACHE_PREFIX + 'n')) { // 내용 같음 → 시각만 갱신
      cache.put(MASTER_CACHE_PREFIX + 'at', String(Date.now()), 21600); return;
    }
    const size = 90000, parts = {};
    const n = Math.ceil(text.length / size);
    for (let i = 0; i < n; i++) parts[MASTER_CACHE_PREFIX + i] = text.substr(i * size, size);
    parts[MASTER_CACHE_PREFIX + 'n'] = String(n);
    parts[MASTER_CACHE_PREFIX + 'hash'] = hash; // V4.8
    parts[MASTER_CACHE_PREFIX + 'at'] = String(Date.now()); // V4.8
    cache.putAll(parts, 21600); // 6시간
  } catch (e) { /* 캐시 실패는 무시 */ }
}
function loadMasterCache() {
  try {
    const cache = CacheService.getScriptCache();
    const n = parseInt(cache.get(MASTER_CACHE_PREFIX + 'n'), 10);
    if (!n) return null;
    const keys = []; for (let i = 0; i < n; i++) keys.push(MASTER_CACHE_PREFIX + i);
    const got = cache.getAll(keys);
    let text = '';
    for (let i = 0; i < n; i++) { if (got[keys[i]] == null) return null; text += got[keys[i]]; }
    return JSON.parse(text);
  } catch (e) { return null; }
}
function readMasterSchedulesSafe() {
  if (isLocalMode()) { // V5.3: 이관 후에는 이 스프레드시트의 '원본일정(웹앱)' 탭만 읽음(원본 파일 안 엶)
    const rows = readLocalMaster();
    tmark('masterRead');
    LAST_MASTER_STATUS = { ok: true, stale: false, count: rows.length, local: true };
    return rows;
  }
  try { // V4.8: 20초 안에 읽은 원본이 있고 그 뒤 저장이 없었으면 캐시 사용
    const at = parseInt(CacheService.getScriptCache().get(MASTER_CACHE_PREFIX + 'at'), 10) || 0;
    if (at && Date.now() - at < MASTER_FAST_TTL_MS) {
      const fast = loadMasterCache();
      if (fast && fast.length) { LAST_MASTER_STATUS = { ok: true, stale: false, count: fast.length, cached: true }; return fast; }
    }
  } catch (e) {}
  let rows = null, error = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    try { rows = readMasterSchedules(true); } catch (e) { rows = null; error = String(e); }
    tmark('masterRead'); // V4.8
    if (rows && rows.length) break;
    if (attempt === 0) Utilities.sleep(2000); // 매크로 재집계 중일 수 있어 잠시 대기 후 1회 재시도
  }
  if (rows && rows.length) {
    saveMasterCache(rows);
    tmark('masterCacheSave'); // V4.8
    LAST_MASTER_STATUS = { ok: true, stale: false, count: rows.length };
    return rows;
  }
  const cached = loadMasterCache();
  if (cached && cached.length) {
    LAST_MASTER_STATUS = { ok: false, stale: true, count: cached.length, error: error || 'empty' };
    return cached;
  }
  LAST_MASTER_STATUS = { ok: false, stale: false, count: 0, error: error || 'empty' };
  return rows || [];
}
// V4.9: '시험계획누적' 한 줄(row, 0-based 인덱스 i) → 웹앱 원본 일정 객체 (readMasterSchedules와 즉시 반영 응답이 공용)
function parseMasterRow(row, i, tz) {
    const startDateRaw = row[0];
    const eqName = row[1];
    const eqNo = row[2];
    const content = row[3];
    const status = row[4];
    const endDateRaw = row[5];
    if (!startDateRaw || !content) return null;
    const startDateParsed = parseFlexibleDate(startDateRaw);
    if (!startDateParsed) return null; // 날짜로 해석할 수 없는 값이면 스킵

    const startDate = Utilities.formatDate(startDateParsed, tz, 'yyyy-MM-dd');
    let duration = 1;
    const endDateParsed = parseFlexibleDate(endDateRaw);
    if (endDateParsed) {
      const diff = Math.round((endDateParsed - startDateParsed) / 86400000) + 1;
      if (diff > 0) duration = diff;
    }
    // V1.25.0: 원본 셀 내용을 제목(1행) / 담당자·의뢰자(있으면 해당 줄) / 나머지 상세설명으로 분리.
    // 예전에는 title이 content 첫 줄에서만 뽑히고, desc에는 title을 포함한 content 전체가 그대로
    // 들어가서 앱 화면에서 제목이 상세설명에도 중복 표시되고 담당자/의뢰자 정보도 텍스트로 섞여 있었음.
    const normalizedContent = String(content).replace(/\r\n/g, '\n');
    const rawLines = normalizedContent.split('\n');
    const titleFull = (rawLines[0] || '').trim();
    const ownerLineRegex = /^\s*[ㄴ\-•*]*\s*(담당자|의뢰자)\s*[:：]\s*(.+?)\s*$/;
    let extractedOwner = '';
    let ownerLineFound = false;
    const descLines = [];
    for (let li = 1; li < rawLines.length; li++) {
      const line = rawLines[li];
      if (!ownerLineFound) {
        const m = line.match(ownerLineRegex);
        if (m) {
          extractedOwner = m[2].trim();
          ownerLineFound = true;
          continue; // 담당자/의뢰자 줄은 상세설명에서 제외
        }
      }
      descLines.push(line);
    }
    const descOnly = descLines.join('\n').trim();

    // '내충격'/'내충격성'이 포함되면 (장비명이 뭐든) '기타' 계열로 보냄
    // ('충격' 부분 문자열 매칭 때문에 충격 장비(shk_)로 잘못 분류되는 것을 방지)
    // V1.24.0: 예전에는 무조건 etc_1로 고정했지만, 이제 '기타' 항목이 1호/2호 두 개로 늘어났으므로
    // 장비번호(eqNo)에 따라 기타1호/기타2호 중 실제 해당하는 곳에 자연스럽게 배치되도록 변경.
    const eqNameStr = String(eqName || '');
    const isNaeChunggyeok = normalizedContent.indexOf('내충격') > -1 || eqNameStr.indexOf('내충격') > -1;
    const mappedEqId = mapMasterEquipment(eqName, eqNo, isNaeChunggyeok);

    return {
      id: 'master_' + (i + 1), // 행 번호 기반 고정 ID (재동기화 시에도 동일 유지)
      title: titleFull || '(제목 없음)',
      eqId: mappedEqId,
      startDate: startDate,
      duration: duration,
      owner: extractedOwner,
      desc: descOnly,
      rawContent: normalizedContent.trim(), // V1.25.0: 원본 셀 전체 텍스트(제목+담당자줄+설명 포함) 그대로 보존
                                             // — 화면 표시용 desc는 파싱해서 축약했지만, 이 필드는 원본 셀을
                                             // 다시 찾아 매칭(당기기/수정/진행상태 반영)할 때 반드시 필요함.
      status: status || '',
      createdBy: '시험계획누적(자동연동)',
      updatedAt: '',
      source: 'master'
    };
}
function readMasterSchedules(throwOnError) {
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const sh = ss.getSheetByName(MASTER_SHEET_NAME);
    if (!sh) return [];
    const data = sh.getDataRange().getValues();
    const tz = Session.getScriptTimeZone();
    const result = [];
    // data[0] = 상단 여백행, data[1] = 헤더행 → 실제 데이터는 인덱스 2(=3행)부터
    for (let i = 2; i < data.length; i++) {
      const o = parseMasterRow(data[i], i, tz); // V4.9: 한 줄 해석을 함수로 분리(즉시 반영 응답에도 사용)
      if (o) result.push(o);
    }
    return result;
  } catch (err) {
    // 마스터 시트 접근 실패 시에도 앱 전체가 멈추지 않도록 빈 배열 반환
    if (throwOnError) throw err; // V1.37.3: 안전장치(readMasterSchedulesSafe)가 실패를 구분할 수 있게
    return [];
  }
}

// '시험계획누적'의 시험장비/장비번호를 앱의 eqId 형식으로 변환합니다.
// forceEtc가 true면 이름 키워드 매칭을 건너뛰고 장비번호만으로 'etc_' + 번호를 반환합니다.
// ('내충격' 항목이 '충격' 부분 문자열 매칭으로 shk_(충격UNIT)에 잘못 분류되는 것을 막기 위한 용도 — V1.24.0)
function mapMasterEquipment(name, no, forceEtc) {
  const n = (String(no || '1')).replace(/[^0-9]/g, '') || '1';
  if (forceEtc) return 'etc_' + n;
  const nameStr = String(name || '');
  const map = [
    ['배광', 'bg_'],
    ['오븐', 'ov_'],
    ['2룸', 'rm2_'],
    ['습기', 'hm_'],
    ['진동', 'vib_'],
    ['장기내열', 'acc_'],
    ['환경챔버', 'env_'], // V2.2: '환경챔버/기타'·'환경챔버' 모두 인식
    ['스캐너', 'scan_'],
    ['CMM', 'cmm_'],
    ['충격', 'shk_']
  ];
  for (let i = 0; i < map.length; i++) {
    if (nameStr.indexOf(map[i][0]) > -1) return map[i][1] + n;
  }
  return 'etc_' + n;
}

// 앱의 eqId → '시험계획표' 월별 탭에서 쓰는 정확한 (시험장비, 장비번호) 텍스트로 역변환
// (텍스트가 한 글자라도 다르면 그쪽의 copyData() 매칭이 실패하므로 정확히 일치시켜야 함)
const EQUIPMENT_NAME_PREFIX_MAP = {
  'bg_': '배광',
  'ov_': '오븐',
  'rm2_': '2룸',
  'hm_': '습기',
  'vib_': '진동',
  'acc_': '장기내열\n(Max 8 Item)',
  'env_': '환경챔버/기타',
  'scan_': '스캐너',
  'cmm_': 'CMM',
  'shk_': '충격',
  'etc_': '기타'
};
function mapEqIdToNameNum(eqId) {
  const idStr = String(eqId || '');
  for (const prefix in EQUIPMENT_NAME_PREFIX_MAP) {
    if (idStr.indexOf(prefix) === 0) {
      const num = idStr.substring(prefix.length).replace(/[^0-9]/g, '') || '1';
      return { name: EQUIPMENT_NAME_PREFIX_MAP[prefix], num: num + '호' };
    }
  }
  return null;
}

// '어플입력' 시트에 하루 단위로 행을 추가 → 이미 운영 중인 copyData() 스크립트가 월별 탭 빈 칸에 자동 반영
function handlePushToAppInput(body) {
  const s = body.schedule;
  if (!s || !s.startDate) return { status: 'fail', message: '잘못된 요청입니다.' };
  const mapped = mapEqIdToNameNum(s.eqId);
  if (!mapped) return { status: 'fail', message: '시험계획표와 매칭되는 장비가 아닙니다 (휴일/이벤트 등은 반영 대상이 아닙니다).' };
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const appInputSheet = ss.getSheetByName('어플입력');
    if (!appInputSheet) return { status: 'fail', message: "'어플입력' 시트를 찾을 수 없습니다." };

    const duration = parseInt(s.duration) || 1;
    const startDate = new Date(s.startDate);
    const content = buildAppInputContent(s);
    const dates = [];
    for (let i = 0; i < duration; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }

    const tabCache = {};
    const rank = findWritableRank(ss, dates, mapped.name, mapped.num, content, tabCache);
    const highlightColor = randomVisibleColor(); // V1.18.0: 이 항목(여러 날짜에 걸친 한 블록) 전체에 동일한 랜덤 색상 적용

    let totalDays = 0;
    let filledDays = 0;
    const colorTargets = {}; // V1.20.0: 탭별로 모아뒀다가 마지막에 한 번씩만 Range로 적용

    // V4.7: [속도개선] 날짜마다 셀 읽기·쓰기·어플입력 행추가(하루 3번)를 하던 것을
    //   탭(월)마다 "그 행 구간 1번 읽기(실시간 확인) + 빈 칸 한 번에 쓰기(RangeList)"로 묶고, 어플입력도 마지막에 한 번에 기록
    totalDays = dates.length;
    const appRows = [];
    const groups = {}; // 탭+행별로 날짜 모음
    if (rank >= 0) dates.forEach(function (d) {
      const cache = getMonthlyTabCache(ss, d, mapped.name, mapped.num, tabCache);
      if (!cache) return;
      const col = findDateColumnInCache(cache, d);
      const rowNum = cache.matchRows[rank];
      if (col === -1 || rowNum === undefined) return;
      const key = cache.sheet.getName() + '_' + rowNum;
      if (!groups[key]) groups[key] = { cache: cache, rowNum: rowNum, items: [] };
      groups[key].items.push({ d: d, col: col });
    });
    Object.keys(groups).forEach(function (key) {
      const g = groups[key], sheet = g.cache.sheet;
      const cols = g.items.map(function (x) { return x.col; });
      const minCol = Math.min.apply(null, cols), maxCol = Math.max.apply(null, cols);
      const live = sheet.getRange(g.rowNum, minCol, 1, maxCol - minCol + 1).getValues()[0]; // 실시간 확인(덮어쓰기 방지)
      const toWrite = [];
      g.items.forEach(function (x) {
        const cur = live[x.col - minCol];
        if (cur === content) { filledDays++; addColorTarget(colorTargets, sheet, g.rowNum, x.col); }
        else if (cur === '') {
          toWrite.push(sheet.getRange(g.rowNum, x.col).getA1Notation());
          filledDays++; addColorTarget(colorTargets, sheet, g.rowNum, x.col);
          setCachedCellValue(g.cache, g.rowNum, x.col, content);
          appRows.push([x.d, mapped.name, mapped.num, content, x.d, Utilities.getUuid().substring(0, 8), '복사완료']);
        }
      });
      if (toWrite.length) sheet.getRangeList(toWrite).setValue(content); // 한 번에 쓰기
    });
    if (appRows.length) appInputSheet.getRange(appInputSheet.getLastRow() + 1, 1, appRows.length, 7).setValues(appRows);
    applyHighlightColors(colorTargets, highlightColor);
    // V4.7: [속도개선] 원본 매크로(1분 간격)를 기다리지 않도록 '시험계획누적'에도 바로 한 줄 추가 → 웹앱에 🔒로 즉시 표시
    //   (매크로가 다음에 시트를 다시 만들면 그 결과로 자연스럽게 대체됨)
    let snapshotAdded = false;
    if (filledDays > 0 && filledDays === totalDays) snapshotAdded = appendMasterSnapshotRow(ss, mapped, content, dates[0], dates[dates.length - 1]);
    return { status: 'success', totalDays: totalDays, filledDays: filledDays, snapshotAdded: snapshotAdded };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

// V1.20.0: 날짜마다 setBackground()를 개별 호출하면 API 호출 수가 기간(일수)만큼 늘어나
// 15초 타임아웃/재시도가 잦아지므로(스캐너 16일 반영 시 3회 재시도 관측됨), 탭+행별로 모아뒀다가
// 탭당 read 1회 + write 1회(Range 단위)로 묶어서 적용합니다. (같은 rank는 한 탭 안에서 항상 같은
// 행이므로, 탭 하나당 실제로는 딱 한 행의 여러 칼럼만 바뀌는 경우가 대부분이라 이 방식이 안전합니다)
// V4.7: '시험계획누적'에 새 일정 한 줄 추가(같은 장비·시작일·내용 줄이 이미 있으면 건너뜀)
function appendMasterSnapshotRow(ss, mapped, content, startDate, endDate) {
  try {
    const sh = ss.getSheetByName(MASTER_SHEET_NAME);
    if (!sh || sh.getLastRow() < 2) return false;
    const tz = Session.getScriptTimeZone();
    const startStr = Utilities.formatDate(startDate, tz, 'yyyy-MM-dd');
    const want = normalizeCellText(content);
    const last = sh.getLastRow();
    if (last >= 3) {
      const data = sh.getRange(3, 1, last - 2, 4).getValues();
      for (let i = 0; i < data.length; i++) {
        const d = parseFlexibleDate(data[i][0]);
        if (d && Utilities.formatDate(d, tz, 'yyyy-MM-dd') === startStr && String(data[i][1]) === String(mapped.name)
          && String(data[i][2]) === String(mapped.num) && normalizeCellText(data[i][3]) === want) {
          masterPatchRecord('update', null, sh.getRange(i + 3, 1, 1, 6).getValues()[0], i + 2); // V4.9: 이미 있는 줄도 화면 반영용으로 전달
          return false;
        }
      }
    }
    const newRow = [startDate, mapped.name, mapped.num, content, '', endDate];
    sh.getRange(last + 1, 1, 1, 6).setValues([newRow]);
    masterPatchRecord('update', null, newRow, last); // V4.9: 새 줄(인덱스 = last)
    return true;
  } catch (e) { return false; }
}
function addColorTarget(colorTargets, sheet, rowNum, col) {
  const key = sheet.getName() + '_' + rowNum;
  if (!colorTargets[key]) colorTargets[key] = { sheet: sheet, rowNum: rowNum, cols: [] };
  colorTargets[key].cols.push(col);
}
function applyHighlightColors(colorTargets, highlightColor) {
  Object.keys(colorTargets).forEach(function (key) {
    const t = colorTargets[key];
    if (!t.cols.length) return;
    const minCol = Math.min.apply(null, t.cols);
    const maxCol = Math.max.apply(null, t.cols);
    const range = t.sheet.getRange(t.rowNum, minCol, 1, maxCol - minCol + 1);
    const current = range.getBackgrounds()[0]; // 색 안 바꾸는 칸(사이의 진행결과 칸 등)은 기존 색 그대로 유지
    const targetCols = {};
    t.cols.forEach(function (c) { targetCols[c] = true; });
    const updated = current.map(function (bg, idx) { return targetCols[minCol + idx] ? highlightColor : bg; });
    range.setBackgrounds([updated]);
  });
}

// V1.18.0: 오퍼레이터가 눈으로 구분하기 좋도록 너무 밝지도(흰색과 구분 안 됨) 너무 어둡지도(글자 안 보임) 않은
// 범위(채도 45~70%, 명도 78~88%)에서 매번 무작위 색을 뽑아 반환합니다. (기존 수동 음영과 비슷한 파스텔 톤)
function randomVisibleColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 45 + Math.floor(Math.random() * 25);
  const lightness = 78 + Math.floor(Math.random() * 10);
  return hslToHex(hue, saturation, lightness);
}
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  const toHex = v => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// duration 전체 날짜에 대해 "쓸 수 있는" (=이미 동일 내용이 있거나, 비어있는) 공통 우선순위 순번(0-based)을 찾음.
// 다른 내용으로 이미 차 있어 전체 기간을 감당 못하는 행은 후보에서 제외됩니다. 없으면 -1.
// V1.27.0: 이 함수는 "후보를 찾는" 스캔 단계이므로, 실제 셀을 매번 getValue()하지 않고
// getMonthlyTabCache가 탭당 1회로 미리 읽어둔 contentValues 캐시에서 값을 조회합니다.
// (실제로 그 자리에 쓸지 최종 확정하는 writeAtRank는 이 함수와 별개로, 쓰기 직전 실시간 재확인을 합니다 —
//  그래야 이 스캔 이후 다른 요청이 그 사이 같은 칸에 먼저 쓰더라도 덮어쓰는 사고가 나지 않습니다)
// reserved(V1.22.0, 선택 인자): '이 칸은 곧 비워질 예정이니 지금 당장은 다른 내용이 있어도 빈 칸처럼
// 취급해도 된다'는 표시. handleUpdateMasterSchedule의 이동 분기가, 기존 셀을 실제로 지우기 전에
// 먼저 새 위치의 여유를 확인할 때 자기 자신이 차지한 기존 칸까지 포함해 검사하면서(사이 시간에
// 기존 셀을 지우지 않고도) 원래 자리를 그대로 재사용할 수 있도록 하기 위함. 시트명_행_열 문자열의 배열.
function findWritableRank(ss, dates, eqName, eqNum, content, tabCache, reserved) {
  const perDate = dates.map(function (d) {
    const cache = getMonthlyTabCache(ss, d, eqName, eqNum, tabCache);
    if (!cache) return null; // 해당 월 탭이 아직 없음
    const col = findDateColumnInCache(cache, d);
    if (col === -1) return null; // 그 날짜 열을 못 찾음
    return { cache: cache, col: col };
  });
  if (perDate.some(function (x) { return x === null; })) return -1;

  let maxRank = 0;
  perDate.forEach(function (x) { maxRank = Math.max(maxRank, x.cache.matchRows.length); });

  for (let rank = 0; rank < maxRank; rank++) {
    let ok = true;
    for (let k = 0; k < perDate.length; k++) {
      const rowNum = perDate[k].cache.matchRows[rank];
      if (rowNum === undefined) { ok = false; break; }
      const val = getCachedCellValue(perDate[k].cache, rowNum, perDate[k].col); // V1.27.0: 캐시에서 읽음 (API 호출 없음)
      const cellKey = perDate[k].cache.sheet.getName() + '_' + rowNum + '_' + perDate[k].col;
      const isReserved = reserved && reserved.indexOf(cellKey) !== -1;
      if (val !== '' && val !== content && !isReserved) { ok = false; break; } // 다른 내용이 이미 있으면 이 행은 이 날짜엔 못 씀(단, 곧 비워질 예약 칸은 예외)
    }
    if (ok) return rank;
  }
  return -1;
}

// findWritableRank로 정해진 rank 행에 실제로 기록.
// 이미 동일 내용이면 다시 쓰지 않고 'already' 반환 (재시도로 인한 중복 기록 방지의 핵심).
// V1.27.0: findWritableRank는 캐시로 후보를 찾지만, 실제로 쓰기 직전인 여기서는 여전히
// 그 순간의 셀 값을 getValue()로 실시간 재확인합니다 — 스캔 이후 같은 요청의 재시도 중복 실행이나
// 다른 사용자의 거의 동시 등록이 그 사이 이 칸을 먼저 채웠을 가능성을 캐시만으로는 알 수 없기
// 때문에, 다른 일정을 덮어쓰는 데이터 누락을 막기 위해 이 최종 확인만은 실시간성을 유지합니다.
function writeAtRank(ss, date, eqName, eqNum, content, rank, tabCache) {
  if (rank < 0) return 'fail';
  const cache = getMonthlyTabCache(ss, date, eqName, eqNum, tabCache);
  if (!cache) return 'fail';
  const col = findDateColumnInCache(cache, date);
  if (col === -1) return 'fail';
  const rowNum = cache.matchRows[rank];
  if (rowNum === undefined) return 'fail';

  const targetCell = cache.sheet.getRange(rowNum, col);
  const current = targetCell.getValue(); // 실시간 확인 (의도적으로 캐시 미사용)
  if (current === content) { setCachedCellValue(cache, rowNum, col, content); return 'already'; }
  if (current === '') {
    targetCell.setValue(content);
    setCachedCellValue(cache, rowNum, col, content); // V1.27.0: 같은 실행 안에서 이후 조회가 최신 값을 보도록 캐시도 갱신
    return 'written';
  }
  return 'fail'; // 다른 내용이 이미 있음 (findWritableRank를 통과했다면 이론상 발생하지 않아야 함)
}

// V1.27.0: getMonthlyTabCache가 캐싱한 contentValues 2차원 배열에서 (rowNum, col) 좌표의 값을 꺼냄.
// 캐시 범위(CONTENT_ROW_START~, CONTENT_COL_START~) 밖의 좌표를 요청하면 안전하게 ''을 반환.
function getCachedCellValue(cache, rowNum, col) {
  const r = rowNum - CONTENT_ROW_START;
  const c = col - CONTENT_COL_START;
  if (r < 0 || c < 0 || !cache.contentValues[r] || cache.contentValues[r][c] === undefined) return '';
  return cache.contentValues[r][c];
}
function setCachedCellValue(cache, rowNum, col, value) {
  const r = rowNum - CONTENT_ROW_START;
  const c = col - CONTENT_COL_START;
  if (r < 0 || c < 0 || !cache.contentValues[r]) return;
  cache.contentValues[r][c] = value;
}

// 월별 탭의 (날짜 헤더 행 / 장비 매칭 행 / 내용 영역 전체) 데이터를 탭당 한 번만 읽어와 캐시.
// duration에 포함된 여러 날짜가 같은 월 탭을 공유하는 경우 스프레드시트 API 호출을 크게 줄여줍니다.
// V1.27.0: 장비 매칭에 쓰는 B13:B105/C13:C105, 날짜 헤더 E11:BU11에 더해 내용 영역 전체
// (E13:BU105, contentValues)까지 이 함수 안에서 한 번에 읽어둡니다. 예전에는 이 내용 영역을
// findWritableRank/writeAtRank/handleUpdateMasterSchedule 등이 필요할 때마다 셀 하나씩
// getValue()로 읽었는데, 기간이 길거나 우선순위 행이 여럿이면 그만큼 API 호출이 곱으로 늘어나
// 15초 클라이언트 타임아웃을 넘기기 쉬웠습니다. 이제 "후보를 찾는" 용도의 읽기는 모두 이 캐시를
// 쓰고, "실제로 쓰기 직전"의 최종 확인만 의도적으로 실시간 getValue()를 유지합니다(writeAtRank 참고).
function getMonthlyTabCache(ss, date, eqName, eqNum, tabCache) {
  if (!tabCache.__tabNameCache) tabCache.__tabNameCache = {};
  const tabName = resolveMonthlyTabName(ss, date, tabCache.__tabNameCache);
  if (tabCache[tabName] !== undefined) return tabCache[tabName]; // 탭이 없다는 결과(null)도 캐시됨
  const sheet = ss.getSheetByName(tabName);
  if (!sheet) { tabCache[tabName] = null; return null; }

  const equipmentList = sheet.getRange('B13:B105').getValues();
  const equipmentNumList = sheet.getRange('C13:C105').getValues();
  const matchRows = [];
  for (let i = 0; i < equipmentList.length; i++) {
    if (String(equipmentList[i][0]) === String(eqName) && String(equipmentNumList[i][0]) === String(eqNum)) {
      matchRows.push(i + 13); // B13 기준 행 오프셋
    }
  }

  const cache = {
    sheet: sheet,
    planDates: sheet.getRange('E11:BU11').getValues()[0],
    matchRows: matchRows, // 화면상 위→아래(=우선순위) 순서
    // V1.27.0: 내용 영역 전체를 한 번에 읽어 캐싱 (E13:BU105) — getCachedCellValue/setCachedCellValue로 조회/갱신
    contentValues: sheet.getRange(CONTENT_ROW_START, CONTENT_COL_START, CONTENT_ROW_COUNT, CONTENT_COL_COUNT).getValues()
  };
  tabCache[tabName] = cache;
  return cache;
}

// 캐시된 planDates에서 해당 날짜와 일치하는 열 번호(1-based)를 반환. 없으면 -1.
function findDateColumnInCache(cache, date) {
  const planDates = cache.planDates;
  for (let j = 0; j < planDates.length; j++) {
    const cellDate = planDates[j];
    if (cellDate instanceof Date && isSameCalendarDay(cellDate, date)) return j + 5; // E열 기준 열 오프셋
  }
  return -1;
}

// V1.19.0 이름만으로 계산한 결과(달력 월 기준)
function getMonthlyTabName(date) {
  const tz = Session.getScriptTimeZone();
  const yy = Utilities.formatDate(date, tz, 'yy');
  const m = Utilities.formatDate(date, tz, 'M'); // 앞자리 0 없이 (8월 -> "8")
  return `${yy}년${m}월`;
}

// V1.19.0: 실제로 그 날짜가 들어있는 탭을 찾음.
// 탭은 달력 월과 정확히 일치하지 않고 4~5주 단위로 이어지는 순환 구조라서(예: '26년9월' 탭이
// 실제로는 8/31~10/4까지 담당), 경계 근처 날짜는 이름만으로 계산한 탭('26년10월')에 그 날짜의
// 칼럼이 아예 없을 수 있습니다. 그래서 이름으로 계산한 탭을 먼저 확인하고, 못 찾으면 앞/뒤 달
// 이름의 탭까지 확장해서 실제 날짜범위(E11:BU11의 첫/끝 날짜)에 그 날짜가 포함되는 탭을 찾습니다.
function resolveMonthlyTabName(ss, date, tabNameCache) {
  const guess = getMonthlyTabName(date);
  const prevGuessDate = new Date(date); prevGuessDate.setMonth(prevGuessDate.getMonth() - 1);
  const nextGuessDate = new Date(date); nextGuessDate.setMonth(nextGuessDate.getMonth() + 1);
  const candidates = [guess, getMonthlyTabName(prevGuessDate), getMonthlyTabName(nextGuessDate)];

  for (let i = 0; i < candidates.length; i++) {
    const name = candidates[i];
    if (tabNameCache[name] === undefined) {
      const sh = ss.getSheetByName(name);
      if (!sh) { tabNameCache[name] = null; }
      else {
        const planDates = sh.getRange('E11:BU11').getValues()[0];
        const validDates = planDates.filter(function (d) { return d instanceof Date; });
        tabNameCache[name] = validDates.length ? { first: validDates[0], last: validDates[validDates.length - 1] } : null;
      }
    }
    const info = tabNameCache[name];
    // 시간 성분(9시간 차이 등)을 무시하고 연/월/일만으로 범위를 비교해야 함.
    // (new Date("yyyy-MM-dd")는 UTC 자정으로 해석되어 한국시간으로는 이미 그날 오전 9시가 되는데,
    //  시트에서 읽은 날짜는 한국시간 자정이라, 절대시각(getTime())으로 비교하면 탭의 정확히
    //  마지막 날짜에서 근소한 차이로 범위 밖 판정이 나버림 — isBetweenCalendarDays로 보정)
    if (info && isBetweenCalendarDays(date, info.first, info.last)) {
      return name;
    }
  }
  return guess; // 세 후보 중 아무 데도 안 맞으면(이론상 발생 안 해야 함) 기존 방식으로 폴백
}

// 연/월/일 성분만 비교(시/분/초 무시)해서 target이 [first, last] 범위(양끝 포함)에 있는지 판단
function isBetweenCalendarDays(target, first, last) {
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const f = new Date(first.getFullYear(), first.getMonth(), first.getDate()).getTime();
  const l = new Date(last.getFullYear(), last.getMonth(), last.getDate()).getTime();
  return t >= f && t <= l;
}

function isSameCalendarDay(a, b) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

function buildAppInputContent(s) {
  const lines = [s.title || ''];
  if (s.owner) lines.push(' ㄴ 담당자 : ' + s.owner);
  if (s.desc) lines.push(s.desc);
  return lines.join('\n');
}

// ===============================================================
// V1.16.0: 🔒 마스터(시험계획누적) 일정 편집 → 원본 '시험계획표' 월별 탭에 양방향 재반영
// ===============================================================
//
// 주의: '시험계획누적'은 copyAndPasteWithMergedCellsOptimized()가 월별 탭들을 매번
// 통째로 재스캔해서 만드는 파생 스냅샷이며, 그 트리거가 도는 순간 3행 이후가 전부
// clearContent() 되었다가 새로 채워집니다. 따라서 여기서는 '시험계획누적' 시트가
// 아니라 실제 진짜 원본인 월별 탭 셀(getMonthlyTabCache가 읽는 셀)을 직접 고칩니다.
// V1.21.0: '시험계획누적'(orig.desc의 출처)과 월별 탭 원본 셀의 실제 값은 줄바꿈 표기(\r\n vs \n)나
// 앞뒤 공백 등 사소한 차이가 있을 수 있어, 그대로 === 비교하면 "다른 문자열"로 판정되어 기존 셀을
// 못 찾고 조용히 지나쳐버릴 수 있습니다(=지운 게 아니라 애초에 매칭에 실패한 것). 비교 전 정규화합니다.
function normalizeCellText(v) {
  return String(v == null ? '' : v).replace(/\r\n/g, '\n').trim();
}

// V1.35.0: 마스터 일정 수정/이동은 셀 내용을 buildAppInputContent()로 다시 써서(예: '의뢰자'→'담당자' 라벨, 줄 앞 공백 정리)
// 실제 데이터의 약 91%는 '원본 셀 내용'이 바뀐다 — 그러면 '장비+원본 셀 내용' 안정 키로 붙여둔 부가정보(변경이력·보호·
// 소요시간·재일정·주야간·연계 그룹)가 그 순간 새 키와 어긋나 끊긴다. 수정이 성공하면 옛 키 → 새 키로 전부 이관하고,
// 클라이언트가 이력을 새 키로 남길 수 있게 새 셀 내용(newRawContent)도 응답에 담아준다.
function handleUpdateMasterSchedule(body) {
  const res = handleUpdateMasterScheduleCore(body);
  try {
    if (res && res.status === 'success' && body.schedule && body.original) {
      const wrote = (res.mode === 'move') ? (res.filledDays > 0) : (res.touched > 0);
      if (wrote) {
        const newRaw = normalizeCellText(buildAppInputContent(body.schedule));
        res.newRawContent = newRaw;
        migrateMasterKeys(body.original.eqId, body.original.rawContent, body.schedule.eqId, newRaw);
        res.snapshotPatched = patchMasterSnapshot( // V1.37.7: '시험계획누적' 즉시 갱신
          { id: body.original.id, eqId: body.original.eqId, startDate: body.original.startDate, rawContent: body.original.rawContent },
          { eqId: body.schedule.eqId, startDate: body.schedule.startDate, duration: body.schedule.duration, rawContent: newRaw });
      }
    }
  } catch (err) { /* 부가정보 이관 실패가 이동/수정 자체를 실패로 만들지 않도록 무시 */ }
  return res;
}
function migrateMasterKeys(oldEqId, oldRaw, newEqId, newRaw) {
  if (oldRaw == null || oldRaw === '') return;
  const oldKey = buildProtectionKey(oldEqId, oldRaw);
  const newKey = buildProtectionKey(newEqId, newRaw);
  if (oldKey === newKey) return;
  // 항목당 1행인 저장소(key 칼럼): 새 키에 이미 값이 있으면 옛 값은 버림
  [protectionSheet(), beamHoursSheet(), rescheduleSheet(), shiftSheet(), reviewsSheet(), arrivalSheet()].forEach(function (sh) {
    rekeySheetColumn(sh, 'key', oldKey, newKey, true);
  });
  // 여러 행이 가능한 저장소: 연계 그룹 멤버(memberKey), 변경이력(stableKey)
  rekeySheetColumn(sequenceMembersSheet(), 'memberKey', 'master:' + oldKey, 'master:' + newKey, false);
  rekeySheetColumn(historySheet(), 'stableKey', 'master:' + oldKey, 'master:' + newKey, false);
}
function rekeySheetColumn(sh, colName, oldVal, newVal, unique) {
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return;
  const col = data[0].indexOf(colName);
  if (col === -1) return;
  let exists = false;
  if (unique) {
    for (let i = 1; i < data.length; i++) { if (String(data[i][col]) === newVal) { exists = true; break; } }
  }
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][col]) === oldVal) {
      if (unique && exists) sh.deleteRow(i + 1);
      else sh.getRange(i + 1, col + 1).setValue(newVal);
    }
  }
}

function handleUpdateMasterScheduleCore(body) {
  const s = body.schedule;
  const orig = body.original; // 클라이언트가 모달을 열 당시 보관해둔 편집 전 값 (editingOriginalSchedule)
  const appSync = body.__appSync === true; // V1.37.1: 앱 일반 일정 동기화 모드(마스터 id 검사 생략, 원본에 없으면 건너뜀)
  if (!s || !orig || (!appSync && String(s.id).indexOf('master_') !== 0)) {
    return { status: 'fail', message: '잘못된 요청입니다.' };
  }
  const mappedNew = mapEqIdToNameNum(s.eqId);
  const mappedOld = mapEqIdToNameNum(orig.eqId);
  if (!mappedNew || !mappedOld) return { status: 'fail', message: '매칭되는 장비가 아닙니다.' };

  const moved = (s.startDate !== orig.startDate) ||
                (parseInt(s.duration) !== parseInt(orig.duration)) ||
                (s.eqId !== orig.eqId);
  const newContent = buildAppInputContent(s);

  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const tabCache = {};

    if (!moved) {
      // 내용만 수정: 기존 위치의 셀을 찾아 값만 교체, 색상(음영)은 그대로 둠
      // V1.27.0: "어느 셀이 기존 셀인지" 찾는 스캔은 캐시(getCachedCellValue)로 하고,
      // 실제로 교체할 셀이 정해진 뒤에만 진짜 쓰기(setValue)를 합니다.
      const oldDuration = parseInt(orig.duration) || 1;
      const oldStart = new Date(orig.startDate);
      const dates = [];
      for (let i = 0; i < oldDuration; i++) {
        const d = new Date(oldStart); d.setDate(d.getDate() + i); dates.push(d);
      }
      const origMatchText = orig.rawContent != null ? orig.rawContent : orig.desc; // V1.25.0: rawContent 우선, 구버전 캐시 대비 desc 폴백
      let touched = 0;
      dates.forEach(function (d) {
        const cache = getMonthlyTabCache(ss, d, mappedOld.name, mappedOld.num, tabCache);
        if (!cache) return;
        const col = findDateColumnInCache(cache, d);
        if (col === -1) return;
        cache.matchRows.forEach(function (rowNum) {
          const cachedVal = getCachedCellValue(cache, rowNum, col); // V1.27.0: 캐시에서 스캔 (API 호출 없음)
          if (normalizeCellText(cachedVal) === normalizeCellText(origMatchText)) {
            cache.sheet.getRange(rowNum, col).setValue(newContent); // 실제 쓰기는 매칭된 셀에만 발생
            setCachedCellValue(cache, rowNum, col, newContent);
            touched++;
          }
        });
      });
      if (touched === 0) {
        if (appSync) return { status: 'success', mode: 'edit', touched: 0, skipped: true }; // V1.37.1: 원본에 없는 일정
        return { status: 'success', mode: 'edit', touched: 0, warning: '원본 시트에서 기존 셀을 찾지 못해 내용을 반영하지 못했습니다. 원본 시트에서 직접 확인해주세요.' };
      }
      return { status: 'success', mode: 'edit', touched: touched };
    }

    // 이동(날짜/기간/장비 변경): 새 위치에 쓸 자리가 있는지 먼저 확인한 뒤에만 기존 셀을 지운다.
    // V1.22.0 버그수정 · 핵심원인: 예전에는 기존 셀부터 지우고(흰색 리셋) 나서야 새 위치의 여유를
    // 확인했음. 그래서 기간을 늘렸는데 늘어난 날짜 쪽에 다른 일정이 이미 그 장비의 모든 행을 채우고
    // 있어 새 위치를 못 찾는 경우, findWritableRank가 -1을 반환해 fail로 끝나면서도 기존 셀은 이미
    // 지워진 뒤라 원본 일정이 통째로 사라지는(반영은 실패, 기존 내용도 소실) 데이터 유실이 있었다.
    // → 새 위치 확인(findWritableRank)을 먼저 하고, 자리가 없으면 기존 셀을 건드리지 않고 즉시
    //   fail을 반환하도록 순서를 바꿔 기존 일정이 항상 보존되도록 수정.
    const newDuration = parseInt(s.duration) || 1;
    const newStart = new Date(s.startDate);
    const newDates = [];
    for (let i = 0; i < newDuration; i++) { const d = new Date(newStart); d.setDate(d.getDate() + i); newDates.push(d); }

    // 기존 위치의 셀을 아직 지우지 않은 채로, 이 일정이 실제로 차지하고 있는 (셀, 위치) 목록만 먼저
    // 찾아둔다 — 새 위치 여유 확인(findWritableRank) 시 "곧 비워질 칸"으로 알려주기 위함(V1.22.0).
    // 이렇게 하면 제목/설명까지 함께 바뀌어 기존 칸의 현재 값이 newContent와 달라도, 날짜/기간만
    // 바뀌는 흔한 경우와 마찬가지로 원래 자리를 그대로 재사용할 수 있다.
    // V1.27.0: 여기서도 "어느 셀이 기존 셀인지" 찾는 스캔은 캐시로 함 (실제 지우기는 아래에서 별도로 수행).
    const oldDuration = parseInt(orig.duration) || 1;
    const oldStart = new Date(orig.startDate);
    const oldDates = [];
    for (let i = 0; i < oldDuration; i++) { const d = new Date(oldStart); d.setDate(d.getDate() + i); oldDates.push(d); }
    const oldMatches = []; // { cell, key } — 지워야 할 실제 셀들
    const origMatchText2 = orig.rawContent != null ? orig.rawContent : orig.desc; // V1.25.0: rawContent 우선, 구버전 캐시 대비 desc 폴백
    oldDates.forEach(function (d) {
      const cache = getMonthlyTabCache(ss, d, mappedOld.name, mappedOld.num, tabCache);
      if (!cache) return;
      const col = findDateColumnInCache(cache, d);
      if (col === -1) return;
      cache.matchRows.forEach(function (rowNum) {
        const cachedVal = getCachedCellValue(cache, rowNum, col); // V1.27.0: 캐시에서 스캔 (API 호출 없음)
        if (normalizeCellText(cachedVal) === normalizeCellText(origMatchText2)) {
          oldMatches.push({ cache: cache, rowNum: rowNum, col: col, key: cache.sheet.getName() + '_' + rowNum + '_' + col });
        }
      });
    });
    if (appSync && oldMatches.length === 0) return { status: 'success', mode: 'move', skipped: true }; // V1.37.1: 원본에 반영 안 된 일정은 새로 쓰지 않음
    const reserved = oldMatches.map(function (m) { return m.key; });

    const rank = findWritableRank(ss, newDates, mappedNew.name, mappedNew.num, newContent, tabCache, reserved);
    if (rank === -1) return { status: 'fail', message: '새 위치에 빈 자리가 없습니다 (이미 다른 내용으로 차 있음). 기존 일정은 그대로 유지됩니다.' };

    // 새 위치에 자리가 있다는 것을 확인했으니, 이제 실제로 기존 셀을 지운다.
    // (여기서부터는 스캔이 아니라 확정된 실제 쓰기이므로 실시간 setValue/setBackground를 그대로 사용)
    let clearedCount = 0;
    let wasNight = false; // V1.37.2: 기존 칸에 🌙 야간 표시가 있었으면 새 칸에도 옮김
    oldMatches.forEach(function (m) {
      const cell = m.cache.sheet.getRange(m.rowNum, m.col);
      if (isNightNote(cell.getNote())) { wasNight = true; applyNightMark(cell, false); }
      cell.setValue('');
      cell.setBackground('#ffffff');
      setCachedCellValue(m.cache, m.rowNum, m.col, '');
      clearedCount++;
    });

    let filledDays = 0;
    const colorTargets = {};
    newDates.forEach(function (d) {
      const result = writeAtRank(ss, d, mappedNew.name, mappedNew.num, newContent, rank, tabCache);
      if (result === 'written' || result === 'already') filledDays++;
      if (result === 'written') {
        const cache = getMonthlyTabCache(ss, d, mappedNew.name, mappedNew.num, tabCache);
        const col = findDateColumnInCache(cache, d);
        const rowNum = cache.matchRows[rank];
        addColorTarget(colorTargets, cache.sheet, rowNum, col);
      }
    });
    applyHighlightColors(colorTargets, APP_HIGHLIGHT_COLOR);
    if (wasNight) { // V1.37.2
      newDates.forEach(function (d) {
        const cache = getMonthlyTabCache(ss, d, mappedNew.name, mappedNew.num, tabCache);
        if (!cache) return;
        const col = findDateColumnInCache(cache, d);
        const rowNum = cache.matchRows[rank];
        if (col !== -1 && rowNum !== undefined) applyNightMark(cache.sheet.getRange(rowNum, col), true);
      });
    }

    // V1.22.0: 위에서 findWritableRank로 자리를 확인했더라도, 그 사이 해당 날짜의 월 탭을 못 찾는 등의
    // 사유로 개별 날짜 반영이 누락될 수 있어(pushToAppInput과 동일하게) filledDays/totalDays를 비교해
    // 일부만 반영된 경우도 warning으로 알린다.
    const warnings = [];
    if (clearedCount === 0) {
      // 새 위치에는 정상적으로 반영됐지만, 기존 위치의 원본 셀을 못 찾아 못 지운 경우.
      // 예전에는 이 경우도 조용히 'success'만 반환해서 원본 시트에 예전 일정이 남아있는 걸
      // 알아채기 어려웠습니다 — 이제 warning으로 명시적으로 알립니다.
      warnings.push('새 위치에는 반영했지만, 기존 위치의 원본 셀을 찾지 못해 비우지 못했습니다. 원본 시트에서 기존 일정을 직접 지워주세요.');
    } else if (clearedCount < oldDates.length) {
      warnings.push(`기존 위치 ${oldDates.length}일 중 ${clearedCount}일만 비웠습니다. 원본 시트에서 나머지 날짜를 직접 확인해주세요.`);
    }
    if (filledDays < newDates.length) {
      warnings.push(`새 위치 ${newDates.length}일 중 ${filledDays}일만 반영되었습니다. 원본 시트에서 나머지 날짜를 직접 확인해주세요.`);
    }
    return { status: 'success', mode: 'move', filledDays: filledDays, totalDays: newDates.length, clearedCount: clearedCount,
      warning: warnings.length ? warnings.join(' ') : undefined };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

// ===============================================================
// V1.37.1: 앱 일반 일정 변경 → 원본 '시험계획표' 월별 탭 동기화
//   body: { mode: 'move' | 'delete', schedule(변경 후), original(변경 전: eqId/startDate/duration/title/owner/desc) }
// ===============================================================
function handleSyncAppSchedule(body) {
  const orig = body.original;
  if (!orig || !orig.startDate) return { status: 'fail', message: '잘못된 요청입니다.' };
  orig.rawContent = buildAppInputContent(orig); // 원본 셀 내용 = 제목 + 담당자 + 설명
  if (body.mode === 'delete') {
    const r = clearAppScheduleCells(orig);
    if (r.status === 'success' && r.clearedCount > 0) patchMasterSnapshot(orig, null); // V1.37.7
    return r;
  }
  if (!body.schedule) return { status: 'fail', message: '잘못된 요청입니다.' };
  const res = handleUpdateMasterScheduleCore({ schedule: body.schedule, original: orig, __appSync: true });
  try { // V1.37.7: 원본 매크로가 이미 이 앱 일정을 '시험계획누적'에 올려뒀다면 그 행도 같이 고침
    if (res.status === 'success' && !res.skipped) {
      patchMasterSnapshot(orig, { eqId: body.schedule.eqId, startDate: body.schedule.startDate, duration: body.schedule.duration,
        rawContent: normalizeCellText(buildAppInputContent(body.schedule)) });
    }
  } catch (e) {}
  return res;
}
function clearAppScheduleCells(orig) {
  const mapped = mapEqIdToNameNum(orig.eqId);
  if (!mapped) return { status: 'success', skipped: true };
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const tabCache = {};
    const dur = parseInt(orig.duration) || 1;
    const st = new Date(orig.startDate);
    let cleared = 0;
    for (let i = 0; i < dur; i++) {
      const d = new Date(st); d.setDate(d.getDate() + i);
      const cache = getMonthlyTabCache(ss, d, mapped.name, mapped.num, tabCache);
      if (!cache) continue;
      const col = findDateColumnInCache(cache, d);
      if (col === -1) continue;
      cache.matchRows.forEach(function (rowNum) {
        if (normalizeCellText(getCachedCellValue(cache, rowNum, col)) === normalizeCellText(orig.rawContent)) {
          const cell = cache.sheet.getRange(rowNum, col);
          if (isNightNote(cell.getNote())) applyNightMark(cell, false); // V1.37.2
          cell.setValue(''); cell.setBackground('#ffffff');
          setCachedCellValue(cache, rowNum, col, '');
          cleared++;
        }
      });
    }
    return { status: 'success', mode: 'delete', clearedCount: cleared, skipped: cleared === 0 };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

// ===============================================================
// V1.37.2: 🌙 야간 표시 — 셀 메모 + 남색 굵은 글씨 (셀 글자는 바꾸지 않음)
//   body: { original: {eqId, startDate, duration, rawContent | title/owner/desc}, night: true|false }
// ===============================================================
const NIGHT_NOTE = '🌙 야간 (웹앱 지정)';
const NIGHT_FONT_COLOR = '#1e3a8a';
function isNightNote(note) { return String(note || '').indexOf('🌙 야간') === 0; }
function applyNightMark(range, on) {
  if (on) { range.setNote(NIGHT_NOTE); range.setFontColor(NIGHT_FONT_COLOR); range.setFontWeight('bold'); }
  else { range.setNote(''); range.setFontColor('#000000'); range.setFontWeight('normal'); }
}
// V1.37.8: 🌙 여러 건 한 번에 — body: { items: [{ original, night }] } → results: [{ touched }]
function handleMarkNightShiftBatch(body) {
  const items = (body && body.items) || [];
  if (!items.length) return { status: 'success', results: [] };
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const tabCache = {};
    const results = items.slice(0, 60).map(function (it) {
      try { return { touched: markNightCore(ss, tabCache, it.original, it.night === true) }; }
      catch (e) { return { touched: 0, error: String(e) }; }
    });
    return { status: 'success', results: results };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}
function markNightCore(ss, tabCache, o, on) {
  if (!o || !o.startDate) return 0;
  const mapped = mapEqIdToNameNum(o.eqId);
  if (!mapped) return 0;
  const content = (o.rawContent != null && o.rawContent !== '') ? o.rawContent : buildAppInputContent(o);
  const dur = parseInt(o.duration) || 1;
  const st = new Date(o.startDate);
  let touched = 0;
  for (let i = 0; i < dur; i++) {
    const d = new Date(st); d.setDate(d.getDate() + i);
    const cache = getMonthlyTabCache(ss, d, mapped.name, mapped.num, tabCache);
    if (!cache) continue;
    const col = findDateColumnInCache(cache, d);
    if (col === -1) continue;
    cache.matchRows.forEach(function (rowNum) {
      if (normalizeCellText(getCachedCellValue(cache, rowNum, col)) !== normalizeCellText(content)) return;
      const cell = cache.sheet.getRange(rowNum, col);
      if (on) { applyNightMark(cell, true); touched++; }
      else if (isNightNote(cell.getNote())) { applyNightMark(cell, false); touched++; }
    });
  }
  return touched;
}
function handleMarkNightShift(body) {
  const o = body.original;
  if (!o || !o.startDate) return { status: 'fail', message: '잘못된 요청입니다.' };
  const mapped = mapEqIdToNameNum(o.eqId);
  if (!mapped) return { status: 'success', skipped: true };
  const content = (o.rawContent != null && o.rawContent !== '') ? o.rawContent : buildAppInputContent(o);
  const on = body.night === true;
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const tabCache = {};
    const dur = parseInt(o.duration) || 1;
    const st = new Date(o.startDate);
    let touched = 0;
    for (let i = 0; i < dur; i++) {
      const d = new Date(st); d.setDate(d.getDate() + i);
      const cache = getMonthlyTabCache(ss, d, mapped.name, mapped.num, tabCache);
      if (!cache) continue;
      const col = findDateColumnInCache(cache, d);
      if (col === -1) continue;
      cache.matchRows.forEach(function (rowNum) {
        if (normalizeCellText(getCachedCellValue(cache, rowNum, col)) !== normalizeCellText(content)) return;
        const cell = cache.sheet.getRange(rowNum, col);
        if (on) { applyNightMark(cell, true); touched++; }
        else if (isNightNote(cell.getNote())) { applyNightMark(cell, false); touched++; } // 우리가 단 표시만 해제
      });
    }
    return { status: 'success', touched: touched, skipped: touched === 0 };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

// ===============================================================
// V1.17.0: 🔒 마스터 일정의 진행상태(완료/진행)를 원본 월별 탭의 '진행결과' 칸에 직접 반영
// ===============================================================
// 주의: copyAndPasteWithMergedCellsOptimized()는 진행결과 값이 정확히 '완료' 또는
// 빈 문자열('')인 행만 '시험계획누적'으로 수집합니다(그 외 값이 있는 행은 조용히 누락됨).
// 따라서 이 함수는 반드시 '완료' 또는 '' 두 값만 받도록 방어하고, 클라이언트도
// '지연' 버튼을 마스터 항목에서는 숨겨서 애초에 다른 값이 넘어오지 않게 합니다.
// 진행결과 칸은 내용 칸 바로 오른쪽 열(= content 칸 col+1)입니다 (원본 매크로의 c/c+1 쌍 구조와 동일).
function handleUpdateMasterProgressStatus(body) {
  const s = body.schedule;
  const statusValue = body.statusValue;
  if (!s || String(s.id).indexOf('master_') !== 0) return { status: 'fail', message: '잘못된 요청입니다.' };
  if (statusValue !== '완료' && statusValue !== '' && statusValue !== '미입고') return { status: 'fail', message: '지원하지 않는 상태 값입니다.' }; // V1.37.4: 미입고 추가
  const mapped = mapEqIdToNameNum(s.eqId);
  if (!mapped) return { status: 'fail', message: '매칭되는 장비가 아닙니다.' };

  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const tabCache = {};
    const duration = parseInt(s.duration) || 1;
    const start = new Date(s.startDate);
    const dates = [];
    for (let i = 0; i < duration; i++) { const d = new Date(start); d.setDate(d.getDate() + i); dates.push(d); }

    // V1.27.0: 매칭 대상 셀을 찾는 스캔은 캐시로, 실제 진행결과 칸 쓰기는 그 셀이 확정된 뒤에만 수행.
    let touched = 0;
    const matchText = s.rawContent != null ? s.rawContent : s.desc; // V1.25.0: rawContent 우선, 구버전 캐시 대비 desc 폴백
    dates.forEach(function (d) {
      const cache = getMonthlyTabCache(ss, d, mapped.name, mapped.num, tabCache);
      if (!cache) return;
      const col = findDateColumnInCache(cache, d);
      if (col === -1) return;
      cache.matchRows.forEach(function (rowNum) {
        const cachedVal = getCachedCellValue(cache, rowNum, col); // V1.27.0: 캐시에서 스캔 (API 호출 없음)
        if (normalizeCellText(cachedVal) === normalizeCellText(matchText)) {
          cache.sheet.getRange(rowNum, col + 1).setValue(statusValue); // 내용 칸 바로 옆 = 진행결과 칸 (실제 쓰기)
          touched++;
        }
      });
    });
    if (touched > 0) patchMasterSnapshot({ id: s.id, eqId: s.eqId, startDate: s.startDate, rawContent: matchText }, { status: statusValue }); // V1.37.7
    return { status: 'success', touched: touched };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

function handleLogin(body) {
  const username = (body.username || '').trim();
  const password = body.password || '';
  const sh = usersSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === username) {
      if (data[i][1] === password) {
        return { status: 'success', user: { username: data[i][0], name: data[i][2], role: data[i][3] } };
      }
      return { status: 'fail', message: '비밀번호가 일치하지 않습니다.' };
    }
  }
  return { status: 'fail', message: '존재하지 않는 계정입니다.' };
}

function handleRegister(body) {
  const username = (body.username || '').trim();
  const password = body.password || '';
  const name = (body.name || '').trim();
  if (!username || !password || !name) return { status: 'fail', message: '입력값을 확인해주세요.' };

  const sh = usersSheet();
  const data = sh.getDataRange().getValues();
  const isFirstUser = data.length < 2; // 헤더만 있는 경우 = 최초 가입자
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === username) return { status: 'fail', message: '이미 존재하는 아이디입니다.' };
  }
  const role = isFirstUser ? 'admin' : 'viewer';
  sh.appendRow([username, password, name, role, new Date().toISOString()]);
  return { status: 'success', user: { username, name, role } };
}

// 여러 일정(주로 공휴일)을 한 번에 추가. 이미 같은 (장비,날짜,제목) 조합이 있으면 건너뜀 (중복 방지)
function handleBulkAddSchedules(body) {
  const list = body.schedules;
  if (!Array.isArray(list) || list.length === 0) return { status: 'fail', message: '데이터가 없습니다.' };
  const sh = schedulesSheet();
  const data = sh.getDataRange().getValues();
  const existingKeys = new Set();
  for (let i = 1; i < data.length; i++) {
    existingKeys.add(`${data[i][2]}_${data[i][3]}_${data[i][1]}`); // eqId_startDate_title
  }
  const rows = [];
  let skipped = 0;
  list.forEach(s => {
    const key = `${s.eqId}_${s.startDate}_${s.title}`;
    if (existingKeys.has(key)) { skipped++; return; }
    existingKeys.add(key);
    rows.push([
      s.id || (Date.now().toString() + Math.random().toString(36).slice(2, 6)),
      s.title, s.eqId, s.startDate, s.duration || 1,
      s.owner || '', s.desc || '', s.status || 'active',
      s.createdBy || '', new Date().toISOString(), s.progressStatus || '진행'
    ]);
  });
  if (rows.length > 0) {
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  }
  return { status: 'success', added: rows.length, skipped: skipped };
}

function handleSaveSchedule(body) {
  const s = body.schedule;
  if (!s || !s.id) return { status: 'fail', message: '잘못된 요청입니다.' };
  if (String(s.id).indexOf('master_') === 0) {
    return { status: 'fail', message: '시험계획누적에서 자동 연동된 일정은 앱에서 수정할 수 없습니다. 원본 시트에서 수정해주세요.' };
  }
  const sh = schedulesSheet();
  const data = sh.getDataRange().getValues();
  const headers = data[0];
  const psCol = headers.indexOf('progressStatus');
  const protCol = headers.indexOf('protected');
  const protReasonCol = headers.indexOf('protectReason');
  const hoursCol = headers.indexOf('dailyHours');
  const rescheduledCol = headers.indexOf('rescheduled');
  const shiftCol = headers.indexOf('shiftOverride');
  let rowIndex = -1;
  let existingProgressStatus = '';
  let existingProtected = '';
  let existingProtectReason = '';
  let existingHours = '';
  let existingRescheduled = '';
  let existingShift = '';
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(s.id)) {
      rowIndex = i + 1;
      existingProgressStatus = psCol > -1 ? data[i][psCol] : '';
      existingProtected = protCol > -1 ? data[i][protCol] : '';
      existingProtectReason = protReasonCol > -1 ? data[i][protReasonCol] : '';
      existingHours = hoursCol > -1 ? data[i][hoursCol] : '';
      existingRescheduled = rescheduledCol > -1 ? data[i][rescheduledCol] : '';
      existingShift = shiftCol > -1 ? data[i][shiftCol] : '';
      break;
    }
  }
  // 수정 모달은 progressStatus를 보내지 않으므로, 기존 값을 그대로 유지 (신규는 '진행' 기본값)
  const progressStatus = s.progressStatus || existingProgressStatus || '진행';
  // V1.29.0: protected/protectReason — 클라이언트가 값을 보내면 그 값을, 안 보내면(다른 경로로 저장되는 경우) 기존 값을 유지
  const protectedVal = (s.protected !== undefined) ? (s.protected ? 'TRUE' : 'FALSE') : (existingProtected || 'FALSE');
  const protectReasonVal = (s.protectReason !== undefined) ? (s.protectReason || '') : (existingProtectReason || '');
  // V1.30.0: dailyHours — 배광UNIT이 아닌 장비는 항상 undefined로 오므로 기존 값을 그대로 유지
  const hoursVal = (s.dailyHours !== undefined) ? (s.dailyHours === null || s.dailyHours === '' ? '' : Number(s.dailyHours)) : (existingHours || '');
  // V1.31.0: rescheduled — 클라이언트가 값을 보내면 그 값을, 안 보내면 기존 값을 유지
  const rescheduledVal = (s.rescheduled !== undefined) ? (s.rescheduled ? 'TRUE' : 'FALSE') : (existingRescheduled || 'FALSE');
  // V1.32.0: shiftOverride — 클라이언트가 값을 보내면(빈 문자열 포함) 그 값을, 안 보내면 기존 값 유지
  const shiftVal = (s.shiftOverride !== undefined) ? (s.shiftOverride || '') : (existingShift || '');
  const row = [
    s.id, s.title, s.eqId, s.startDate, s.duration,
    s.owner || '', s.desc || '', s.status || 'active',
    s.createdBy || '', new Date().toISOString(), progressStatus
  ];
  if (rowIndex > -1) sh.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  else { sh.appendRow(row); rowIndex = sh.getLastRow(); }
  // protected/protectReason/dailyHours는 헤더 위치가 유동적일 수 있어(컬럼 추가 순서 무관) 별도로 그 칸에만 씀
  if (protCol > -1) sh.getRange(rowIndex, protCol + 1).setValue(protectedVal);
  if (protReasonCol > -1) sh.getRange(rowIndex, protReasonCol + 1).setValue(protectReasonVal);
  if (hoursCol > -1) sh.getRange(rowIndex, hoursCol + 1).setValue(hoursVal);
  if (rescheduledCol > -1) sh.getRange(rowIndex, rescheduledCol + 1).setValue(rescheduledVal);
  if (shiftCol > -1) sh.getRange(rowIndex, shiftCol + 1).setValue(shiftVal);
  return { status: 'success' };
}

// V1.29.0: 🔒 마스터(자동연동) 일정의 "밀리면 안 됨(보호)" 표시 — id 대신 안정 키(eqId+rawContent)로 저장
function handleSetMasterProtection(body) {
  const eqId = body.eqId;
  const rawContent = body.rawContent;
  if (!eqId || rawContent === undefined || rawContent === null || rawContent === '') {
    return { status: 'fail', message: '잘못된 요청입니다.' };
  }
  const key = buildProtectionKey(eqId, rawContent);
  const sh = protectionSheet();
  const data = sh.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key) { rowIndex = i + 1; break; }
  }
  const row = [key, body.protected ? 'TRUE' : 'FALSE', body.reason || '', body.updatedBy || '', new Date().toISOString()];
  if (rowIndex > -1) sh.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);
  return { status: 'success' };
}

// V1.30.0: 배광UNIT 🔒 마스터 일정의 "하루 소요시간(시간)" 저장 — 위 보호 표시와 동일한 안정 키 방식
function handleSetMasterHours(body) {
  const eqId = body.eqId;
  const rawContent = body.rawContent;
  if (!eqId || rawContent === undefined || rawContent === null || rawContent === '') {
    return { status: 'fail', message: '잘못된 요청입니다.' };
  }
  const key = buildProtectionKey(eqId, rawContent);
  const sh = beamHoursSheet();
  const data = sh.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key) { rowIndex = i + 1; break; }
  }
  const row = [key, (body.dailyHours === null || body.dailyHours === '') ? '' : Number(body.dailyHours), body.updatedBy || '', new Date().toISOString()];
  if (rowIndex > -1) sh.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);
  return { status: 'success' };
}

// V1.31.0: 🔁 미입고 마스터 일정 "재일정 수립됨" 표시 — 원본 셀(진행결과='미입고')은 절대 건드리지 않고,
// 이 표시만 별도 시트에 안정 키(eqId+rawContent)로 남긴다.
function handleSetMasterReschedule(body) {
  const eqId = body.eqId;
  const rawContent = body.rawContent;
  if (!eqId || rawContent === undefined || rawContent === null || rawContent === '') {
    return { status: 'fail', message: '잘못된 요청입니다.' };
  }
  const key = buildProtectionKey(eqId, rawContent);
  const sh = rescheduleSheet();
  const data = sh.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key) { rowIndex = i + 1; break; }
  }
  const row = [key, body.rescheduled ? 'TRUE' : 'FALSE', body.updatedBy || '', new Date().toISOString()];
  if (rowIndex > -1) sh.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);
  return { status: 'success' };
}

// V1.32.0: 🌙 배광UNIT 마스터 일정 "주간/야간 수동 지정" — shift는 'day'|'night'|''(빈 값=자동판정으로 되돌림)
// V1.36.0: 🔒 마스터 일정 결과 리뷰 저장 — text가 비면 해당 키의 리뷰를 삭제
function handleSetMasterReview(body) {
  const eqId = body.eqId;
  const rawContent = body.rawContent;
  if (!eqId || rawContent === undefined || rawContent === null || rawContent === '') {
    return { status: 'fail', message: '잘못된 요청입니다.' };
  }
  const key = buildProtectionKey(eqId, rawContent);
  const sh = reviewsSheet();
  const data = sh.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key) { rowIndex = i + 1; break; }
  }
  const text = String(body.text || '').trim();
  if (!text) {
    if (rowIndex > -1) sh.deleteRow(rowIndex);
    return { status: 'success' };
  }
  const row = [key, text, body.updatedBy || '', new Date().toISOString()];
  if (rowIndex > -1) sh.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);
  return { status: 'success' };
}

function handleSetMasterShift(body) {
  const eqId = body.eqId;
  const rawContent = body.rawContent;
  if (!eqId || rawContent === undefined || rawContent === null || rawContent === '') {
    return { status: 'fail', message: '잘못된 요청입니다.' };
  }
  const key = buildProtectionKey(eqId, rawContent);
  const sh = shiftSheet();
  const data = sh.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key) { rowIndex = i + 1; break; }
  }
  const row = [key, body.shift || '', body.updatedBy || '', new Date().toISOString()];
  if (rowIndex > -1) sh.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);
  return { status: 'success' };
}

function handleUpdateProgressStatus(body) {
  const id = body.id;
  const progressStatus = body.progressStatus;
  if (String(id).indexOf('master_') === 0) {
    return { status: 'fail', message: '시험계획누적 자동연동 일정은 상태를 변경할 수 없습니다.' };
  }
  const sh = schedulesSheet();
  const data = sh.getDataRange().getValues();
  const headers = data[0];
  const psCol = headers.indexOf('progressStatus');
  if (psCol === -1) return { status: 'fail', message: 'progressStatus 컬럼을 찾을 수 없습니다.' };
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sh.getRange(i + 1, psCol + 1).setValue(progressStatus);
      return { status: 'success' };
    }
  }
  return { status: 'fail', message: '일정을 찾을 수 없습니다.' };
}

// V1.37.7: '시험계획누적'(파생 스냅샷) 행을 바로 고쳐 원본 매크로 재실행 전에도 앱에 즉시 반영
//   orig: { id?(master_N), eqId, startDate(yyyy-MM-dd), rawContent }  → 이 행을 찾음(장비+시작일+내용 일치)
//   next: null → 내용 칸만 비움(앱에서 안 보이게) / { eqId?, startDate?, duration?, rawContent?, status? } → 해당 칸 갱신
//   반환: 고친 행 수 (실패해도 예외를 던지지 않음 — 매크로가 다시 돌면 어차피 맞춰짐)
function patchMasterSnapshot(orig, next, targetSheet) { // V5.3: targetSheet 지정 시 그 시트('원본일정(웹앱)')를 고침
  try {
    if (!orig || !orig.rawContent) return 0;
    const sh = targetSheet || SpreadsheetApp.openById(MASTER_SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME);
    if (!sh || sh.getLastRow() < 3) return 0;
    const tz = Session.getScriptTimeZone();
    const data = sh.getRange(1, 1, sh.getLastRow(), 6).getValues();
    const want = normalizeCellText(orig.rawContent);
    const matches = function (i) {
      const row = data[i];
      if (!row || normalizeCellText(row[3]) !== want) return false;
      const d = parseFlexibleDate(row[0]);
      if (!d || Utilities.formatDate(d, tz, 'yyyy-MM-dd') !== String(orig.startDate)) return false;
      const forceEtc = String(row[3]).indexOf('내충격') > -1 || String(row[1]).indexOf('내충격') > -1;
      return mapMasterEquipment(row[1], row[2], forceEtc) === orig.eqId;
    };
    let rows = [];
    const idNo = String(orig.id || '').indexOf('master_') === 0 ? parseInt(String(orig.id).replace('master_', ''), 10) : 0;
    if (idNo > 2 && matches(idNo - 1)) rows = [idNo - 1];
    else for (let i = 2; i < data.length; i++) if (matches(i)) rows.push(i);
    if (!rows.length) return 0;
    let nameNum = null;
    if (next && next.eqId && next.eqId !== orig.eqId) {
      nameNum = mapEqIdToNameNum(next.eqId);
      const forceEtc = String(next.rawContent || orig.rawContent).indexOf('내충격') > -1;
      if (!nameNum || mapMasterEquipment(nameNum.name, nameNum.num, forceEtc) !== next.eqId) return 0; // 역변환이 안 맞으면 건드리지 않음
    }
    rows.forEach(function (i) {
      const r = i + 1;
      if (!next) { sh.getRange(r, 4).setValue(''); masterPatchRecord('remove', orig, null, i); return; }
      const vals = data[i].slice();
      if (nameNum) { vals[1] = nameNum.name; vals[2] = nameNum.num; }
      if (next.startDate) {
        const st = new Date(next.startDate);
        const en = new Date(st); en.setDate(en.getDate() + (parseInt(next.duration) || 1) - 1);
        vals[0] = st; vals[5] = en;
      }
      if (next.rawContent != null && next.rawContent !== '') vals[3] = next.rawContent;
      if (next.status !== undefined) vals[4] = next.status;
      sh.getRange(r, 1, 1, 6).setValues([vals]);
      masterPatchRecord('update', orig, vals, i); // V4.9
    });
    return rows.length;
  } catch (e) { return 0; }
}

// V1.37.6: 🗑️ 🔒 원본 일정 삭제 — body: { schedule: {id, eqId, startDate, duration, rawContent} }
function handleDeleteMasterSchedule(body) {
  const s = body.schedule;
  if (!s || String(s.id).indexOf('master_') !== 0 || !s.startDate || !s.rawContent) {
    return { status: 'fail', message: '잘못된 요청입니다.' };
  }
  const mapped = mapEqIdToNameNum(s.eqId);
  if (!mapped) return { status: 'fail', message: '매칭되는 장비가 아닙니다.' };
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const tabCache = {};
    const dur = parseInt(s.duration) || 1;
    const st = new Date(s.startDate);
    let cleared = 0;
    for (let i = 0; i < dur; i++) {
      const d = new Date(st); d.setDate(d.getDate() + i);
      const cache = getMonthlyTabCache(ss, d, mapped.name, mapped.num, tabCache);
      if (!cache) continue;
      const col = findDateColumnInCache(cache, d);
      if (col === -1) continue;
      cache.matchRows.forEach(function (rowNum) {
        if (normalizeCellText(getCachedCellValue(cache, rowNum, col)) !== normalizeCellText(s.rawContent)) return;
        const cell = cache.sheet.getRange(rowNum, col);
        if (isNightNote(cell.getNote())) applyNightMark(cell, false);
        cell.setValue(''); cell.setBackground('#ffffff');
        cache.sheet.getRange(rowNum, col + 1).setValue(''); // 진행결과 칸
        setCachedCellValue(cache, rowNum, col, '');
        cleared++;
      });
    }
    if (cleared === 0) {
      return { status: 'fail', message: '원본 시험계획표에서 이 일정의 셀을 찾지 못했습니다. 원본 시트에서 직접 확인해주세요.' };
    }
    // '시험계획누적' 해당 행 내용 칸(D열)도 비워 즉시 화면에서 빠지게 함 (행 번호 유지)
    try {
      const sh = ss.getSheetByName(MASTER_SHEET_NAME);
      const rowNo = parseInt(String(s.id).replace('master_', ''), 10);
      if (sh && rowNo > 2 && rowNo <= sh.getLastRow()) {
        const c = sh.getRange(rowNo, 4);
        if (normalizeCellText(c.getValue()) === normalizeCellText(s.rawContent)) c.setValue('');
      }
    } catch (e2) { /* 누적 시트 정리 실패는 무시 — 원본 매크로 재실행 시 반영 */ }
    return { status: 'success', clearedCount: cleared, warning: cleared < dur ? `${dur}일 중 ${cleared}일만 비웠습니다. 원본 시트에서 나머지 날짜를 확인해주세요.` : undefined };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

function handleDeleteSchedule(body) {
  if (String(body.id).indexOf('master_') === 0) {
    return { status: 'fail', message: '시험계획누적 자동연동 일정은 앱에서 삭제할 수 없습니다. 원본 시트에서 삭제해주세요.' };
  }
  const sh = schedulesSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(body.id)) { sh.deleteRow(i + 1); break; }
  }
  return { status: 'success' };
}

function handleRequestPermission(body) {
  const sh = requestsSheet();
  const id = Date.now().toString();
  sh.appendRow([id, body.username, body.name, body.message || '', 'pending', new Date().toISOString(), '']);
  return { status: 'success' };
}

function handleResolveRequest(body) {
  const id = body.id;
  const decision = body.decision; // 'approved' | 'rejected'
  const reqSh = requestsSheet();
  const data = reqSh.getDataRange().getValues();
  let username = null;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      username = data[i][1];
      reqSh.getRange(i + 1, 5).setValue(decision);
      reqSh.getRange(i + 1, 7).setValue(new Date().toISOString());
      break;
    }
  }
  if (decision === 'approved' && username) {
    const ush = usersSheet();
    const udata = ush.getDataRange().getValues();
    for (let i = 1; i < udata.length; i++) {
      if (udata[i][0] === username) { ush.getRange(i + 1, 4).setValue('editor'); break; }
    }
  }
  return { status: 'success' };
}

function handleUpdateUserRole(body) {
  const sh = usersSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === body.username) { sh.getRange(i + 1, 4).setValue(body.role); break; }
  }
  return { status: 'success' };
}

function handleDeleteUser(body) {
  const sh = usersSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === body.username) { sh.deleteRow(i + 1); break; }
  }
  return { status: 'success' };
}

function handleChangePassword(body) {
  const sh = usersSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === body.username) {
      if (data[i][1] !== body.oldPassword) return { status: 'fail', message: '기존 비밀번호가 일치하지 않습니다.' };
      sh.getRange(i + 1, 2).setValue(body.newPassword);
      return { status: 'success' };
    }
  }
  return { status: 'fail', message: '사용자를 찾을 수 없습니다.' };
}

function handleAddHistory(body) {
  const h = body.history;
  if (!h || !h.scheduleId) return { status: 'fail', message: '잘못된 요청입니다.' };
  // V1.28.0(GAS): 🔒 마스터(업무현황 자동연동) 일정은 예전에는 앱에서 읽기 전용이라 이력을 막았으나,
  // V1.32.0(HTML)부터 편집 자체가 가능해졌으므로 이 제한은 더 이상 유효하지 않아 제거함.
  // (History 시트는 앱 자체 저장소이며 원본 '시험계획표'와 무관하므로, 마스터 일정의 scheduleId가
  //  원본 재동기화로 나중에 바뀌면 이 이력 항목은 옛 id에 남아 새 id로는 조회되지 않을 수 있음 —
  //  알려진 제약사항이며, 완전히 해결하려면 행 번호 대신 내용 기반 안정 키로 재설계가 필요함)
  const sh = historySheet();
  const id = Date.now().toString();
  // V1.35.0: 마스터 일정이면 클라이언트가 보낸 eqId+rawContent로 안정 키를 만들어 함께 기록(이 키로 조회함).
  // scheduleId(master_행번호)는 참고용으로만 남김. 장비가 바뀐 이동이면 옛 키 기록을 새 키로 이관.
  let stableKey = '';
  if (h.master && h.master.eqId && h.master.rawContent) {
    stableKey = buildHistoryStableKey(h.master.eqId, h.master.rawContent);
  }
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const values = { id: id, scheduleId: h.scheduleId, scheduleTitle: h.scheduleTitle || '', changedBy: h.changedBy || '',
    changedAt: new Date().toISOString(), oldSummary: h.oldSummary || '', newSummary: h.newSummary || '', reason: h.reason || '', stableKey: stableKey };
  sh.appendRow(headers.map(function (name) { return values[name] !== undefined ? values[name] : ''; }));
  return { status: 'success' };
}

// V1.34.0: 마스터 반영 중복 정리 등으로 앱 등록 일정 id가 사라지고 다른 id(마스터 버전)로 대체될 때,
// 그 id에 남아있던 변경이력을 새 id로 옮겨 적어 계속 조회되게 한다(History 시트는 scheduleId로만 연결되므로
// 행을 지우고 새로 쓸 필요 없이 scheduleId 칼럼 값만 바꿔주면 됨).
function handleReassignScheduleHistory(body) {
  const oldId = body.oldId, newId = body.newId;
  if (!oldId || !newId) return { status: 'fail', message: '잘못된 요청입니다.' };
  const sh = historySheet();
  const data = sh.getDataRange().getValues();
  const headers = data[0];
  const scheduleIdCol = headers.indexOf('scheduleId');
  const stableKeyCol = headers.indexOf('stableKey');
  if (scheduleIdCol === -1) return { status: 'fail', message: '이력 시트 구조를 확인할 수 없습니다.' };
  // V1.35.0: 새 id가 마스터 일정이면 그 안정 키도 함께 기록(master_행번호만으로는 나중에 다른 일정을 가리킬 수 있음)
  const newKey = (body.master && body.master.eqId && body.master.rawContent) ? buildHistoryStableKey(body.master.eqId, body.master.rawContent) : '';
  let count = 0;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][scheduleIdCol]) === String(oldId)) {
      sh.getRange(i + 1, scheduleIdCol + 1).setValue(newId);
      if (newKey && stableKeyCol > -1) sh.getRange(i + 1, stableKeyCol + 1).setValue(newKey);
      count++;
    }
  }
  return { status: 'success', reassigned: count };
}

// V1.37.4: 대시보드 '계획 변경' 카드 — 해당 달(yyyy-MM)의 변경 이력 전체
function getMonthHistory(month) {
  const m = String(month || '').slice(0, 7);
  if (!m) return [];
  return sheetToObjects(historySheet())
    .filter(h => String(h.changedAt || '').slice(0, 7) === m)
    .map(h => ({ scheduleId: h.scheduleId, scheduleTitle: h.scheduleTitle, changedBy: h.changedBy,
      changedAt: h.changedAt, reason: h.reason || '', stableKey: h.stableKey || '' }));
}

function getHistoryForSchedule(scheduleId, eqId, rawContent, title) {
  const all = sheetToObjects(historySheet());
  let rows;
  if (String(scheduleId).indexOf('master_') === 0 && eqId && rawContent) {
    // V1.35.0: 마스터 일정 — master_행번호는 원본이 재집계되면 다른 일정을 가리키므로 안정 키로 조회.
    // 안정 키 도입 전에 쌓인 옛 기록(stableKey 없음)은 번호만으로는 어느 일정 것인지 알 수 없어서,
    // 기록 당시 제목이 지금 이 일정의 제목과 같은 것만 이 일정의 이력으로 인정한다.
    const key = buildHistoryStableKey(eqId, rawContent);
    const titleNorm = String(title || '').trim();
    rows = all.filter(h => {
      if (h.stableKey) return String(h.stableKey) === key;
      return String(h.scheduleId).indexOf('master_') === 0 && titleNorm && String(h.scheduleTitle || '').trim() === titleNorm;
    });
  } else {
    rows = all.filter(h => String(h.scheduleId) === String(scheduleId));
  }
  return rows.sort((a, b) => String(b.changedAt || '').localeCompare(String(a.changedAt || '')));
}

// 메모/회의록: 특정 날짜의 메모 목록 조회
function getMemosForDate(dateStr) {
  const all = sheetToObjects(memosSheet());
  return all
    .filter(m => String(m.date) === String(dateStr))
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

// 메모/회의록: 날짜별 개수 전체 조회 (사이드바 등에서 "메모 있는 날짜" 표시용)
function getAllMemoDates() {
  const all = sheetToObjects(memosSheet());
  const dates = {};
  all.forEach(m => { dates[m.date] = (dates[m.date] || 0) + 1; });
  return dates;
}

// 메모/회의록: 전체 목록 조회 (최신순)
function getAllMemos() {
  const all = sheetToObjects(memosSheet());
  return all.sort((a, b) => {
    const dc = String(b.date || '').localeCompare(String(a.date || ''));
    if (dc !== 0) return dc;
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
}

// 구글 드라이브에 메모용 이미지를 저장할 폴더를 가져오거나 새로 만듦
function getOrCreateMemoImageFolder() {
  const folderName = '시험스케줄_메모이미지';
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(folderName);
}

// base64 이미지를 드라이브에 업로드하고, <img>에 바로 쓸 수 있는 URL을 반환
function uploadImageToDrive(base64, mimeType, name) {
  const folder = getOrCreateMemoImageFolder();
  const blob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType || 'image/png', name || 'image.png');
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w1000`;
}

// [수동 실행용] 이 함수를 Apps Script 편집기에서 직접 한 번 실행하면 드라이브 접근 권한 승인창이 뜹니다.
function testDrivePermission() {
  const folder = getOrCreateMemoImageFolder();
  Logger.log('드라이브 권한 정상! 폴더 URL: ' + folder.getUrl());
}

// 시트 헤더 순서에 맞춰 한 행을 안전하게 씀 (컬럼 순서가 바뀌어도 안전)
function writeRowByHeaders(sh, rowIndex, headers, valuesObj) {
  const row = headers.map(h => (valuesObj[h] !== undefined ? valuesObj[h] : ''));
  sh.getRange(rowIndex, 1, 1, row.length).setValues([row]);
}

function handleSaveMemo(body) {
  const m = body.memo;
  if (!m || !m.date || !m.title) return { status: 'fail', message: '날짜와 제목은 필수입니다.' };
  const sh = memosSheet();
  const now = new Date().toISOString();
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];

  const imageUrls = [];
  const uploadErrors = [];
  (m.images || []).forEach(img => {
    if (img.url) {
      imageUrls.push(img.url);
    } else if (img.base64) {
      try { imageUrls.push(uploadImageToDrive(img.base64, img.mimeType, img.name)); }
      catch (e) { uploadErrors.push((img.name || '이미지') + ': ' + e.toString()); }
    }
  });
  const imagesJson = JSON.stringify(imageUrls);

  // V1.26.0: 클라이언트가 본문에서 인식해 확정한(사용자가 칩에서 수정 가능) 리마인드 날짜 목록을 그대로 저장
  const reminderDates = Array.isArray(m.reminderDates) ? m.reminderDates.filter(Boolean) : [];
  const reminderDatesJson = JSON.stringify(reminderDates);

  if (m.id) {
    const data = sh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(m.id)) {
        const existing = {};
        headers.forEach((h, idx) => { existing[h] = data[i][idx]; });
        // 기존에 '확인함' 처리된 리마인드 중, 수정 후 본문에도 여전히 남아있는 날짜만 유지
        let prevDone = [];
        try { prevDone = JSON.parse(existing.reminderDone || '[]'); } catch (e2) { prevDone = []; }
        const reminderDone = prevDone.filter(d => reminderDates.indexOf(d) !== -1);
        writeRowByHeaders(sh, i + 1, headers, {
          id: m.id, date: m.date, title: m.title, content: m.content || '', category: m.category || '기타',
          images: imagesJson, createdBy: existing.createdBy, createdAt: existing.createdAt, updatedAt: now,
          reminderDates: reminderDatesJson, reminderDone: JSON.stringify(reminderDone)
        });
        return { status: 'success', id: m.id, uploadErrors: uploadErrors.length ? uploadErrors : undefined };
      }
    }
    return { status: 'fail', message: '메모를 찾을 수 없습니다.' };
  }
  const id = Date.now().toString();
  const row = headers.map(h => {
    const map = {
      id, date: m.date, title: m.title, content: m.content || '', category: m.category || '기타', images: imagesJson,
      createdBy: m.createdBy || '', createdAt: now, updatedAt: now,
      reminderDates: reminderDatesJson, reminderDone: '[]'
    };
    return map[h] !== undefined ? map[h] : '';
  });
  sh.appendRow(row);
  return { status: 'success', id: id, uploadErrors: uploadErrors.length ? uploadErrors : undefined };
}

// V1.26.0: '확인함' 처리되지 않은 리마인드 전체 조회. isDue는 기한이 오늘이거나 지난 경우 true (배너용),
// false는 아직 남은 미래 리마인드 (캘린더 예고 표시용)
function getActiveReminders() {
  const todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const all = sheetToObjects(memosSheet());
  const result = [];
  all.forEach(m => {
    let dates = [];
    let done = [];
    try { dates = JSON.parse(m.reminderDates || '[]'); } catch (e) { dates = []; }
    try { done = JSON.parse(m.reminderDone || '[]'); } catch (e) { done = []; }
    dates.forEach(d => {
      if (done.indexOf(d) !== -1) return; // 이미 확인 처리된 리마인드는 제외
      result.push({
        memoId: m.id, memoTitle: m.title, memoDate: m.date, category: m.category || '기타',
        reminderDate: d, isDue: d <= todayStr
      });
    });
  });
  result.sort((a, b) => a.reminderDate.localeCompare(b.reminderDate));
  return result;
}

// V1.26.0: 리마인드 하나를 '확인함' 처리 (해당 메모의 reminderDone 목록에 날짜 추가)
function handleMarkReminderDone(body) {
  const sh = memosSheet();
  const data = sh.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('id');
  const doneCol = headers.indexOf('reminderDone');
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === String(body.memoId)) {
      let done = [];
      try { done = JSON.parse(data[i][doneCol] || '[]'); } catch (e) { done = []; }
      if (done.indexOf(body.reminderDate) === -1) done.push(body.reminderDate);
      sh.getRange(i + 1, doneCol + 1).setValue(JSON.stringify(done));
      return { status: 'success' };
    }
  }
  return { status: 'fail', message: '메모를 찾을 수 없습니다.' };
}

function handleDeleteMemo(body) {
  const sh = memosSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(body.id)) { sh.deleteRow(i + 1); return { status: 'success' }; }
  }
  return { status: 'fail', message: '메모를 찾을 수 없습니다.' };
}

// 메모 분류(카테고리) 조회
function getMemoCategories() {
  const all = sheetToObjects(memoCategoriesSheet());
  return all.sort((a, b) => (parseInt(a.sortOrder) || 0) - (parseInt(b.sortOrder) || 0));
}

// 메모 분류 추가/수정
function handleSaveMemoCategory(body) {
  const c = body.category;
  if (!c || !c.name) return { status: 'fail', message: '이름은 필수입니다.' };
  const sh = memoCategoriesSheet();
  if (c.id) {
    const data = sh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(c.id)) {
        sh.getRange(i + 1, 1, 1, 5).setValues([[c.id, c.name, c.icon || '📎', c.color || 'slate', data[i][4] || i]]);
        return { status: 'success', id: c.id };
      }
    }
    return { status: 'fail', message: '분류를 찾을 수 없습니다.' };
  }
  const id = 'cat_' + Date.now().toString();
  const sortOrder = sh.getLastRow(); // 새 항목은 맨 뒤로
  sh.appendRow([id, c.name, c.icon || '📎', c.color || 'slate', sortOrder]);
  return { status: 'success', id: id };
}

// 메모 분류 삭제 (해당 분류를 쓰던 기존 메모는 그대로 남아있고, 새로 선택만 못 하게 됨)
function handleDeleteMemoCategory(body) {
  const sh = memoCategoriesSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(body.id)) { sh.deleteRow(i + 1); return { status: 'success' }; }
  }
  return { status: 'fail', message: '분류를 찾을 수 없습니다.' };
}

// ===============================================================
// V5.3: ★ 구조 전환 — 웹앱이 원본, 원본 시험계획표는 뒤에서 따라오는 사본(미러), 출력 시트는 보기용
// ===============================================================
//  [설치/전환] 편집기에서 함수 선택 → setupV53 → ▶실행 (최초 1회, 권한 승인 필요)
//  [되돌리기]  편집기에서 rollbackToOriginalMode 실행 → V5.2 방식(원본 직접 연동)
//  [수동 출력] 편집기에서 exportAllNow 실행, 또는 웹앱 관리자 메뉴 '📤 출력 시트' 버튼
// ---------------------------------------------------------------
const LOCAL_MASTER_SHEET = '원본일정(웹앱)';   // 원본 '시험계획누적'을 그대로 옮겨온 탭(행 번호 = 🔒 일정 id)
const SHEET_ORIGINAL_QUEUE = 'OriginalQueue';  // 원본 시험계획표 반영 대기열
const PROP_MODE = 'MASTER_MODE';               // 'local' | (없음/'original')
const PROP_DISCONNECTED = 'MASTER_DISCONNECTED'; // V7.5: '1' = 원본 시험계획표와 완전 차단(미러도 안 함)
const PROP_EXPORT_ID = 'EXPORT_SPREADSHEET_ID';
const PROP_EXPORT_DIRTY = 'EXPORT_DIRTY';      // {'yyyy-MM': 표시시각(ms), 'LIST': ms}
const PROP_EXPORT_LAST = 'EXPORT_LAST_AT';
const PROP_BG_RUNNING = 'BG_RUNNING_AT';
const PROP_EXPORT_RECHECK = 'EXPORT_RECHECK'; // V5.8: {'yyyy-MM': 다시 그릴 시각(ms)} — 원본 매크로 반영 뒤 최종 확인용
const EXPORT_RECHECK_MS = 2 * 60000;
const PROP_MIRROR_FLAG = 'MIRROR_HAS_WORK';    // 대기열에 할 일이 있을 때만 1 → 트리거가 할 일 없으면 시트를 열지 않고 바로 끝냄(실행시간 할당량 절약)
const MIRROR_MAX_TRIES = 3;

// 로컬 모드에서 이 스프레드시트 안에서 처리하고, 원본 반영은 대기열로 넘기는 저장 동작들
const LOCAL_HANDLED_ACTIONS = {
  pushToAppInput: true, syncAppSchedule: true, markNightShift: true, markNightShiftBatch: true,
  updateMasterSchedule: true, updateMasterProgressStatus: true, deleteMasterSchedule: true
};

function props() { return PropertiesService.getScriptProperties(); }
let LOCAL_MODE_CACHE = null;
function isLocalMode() {
  if (LOCAL_MODE_CACHE === null) LOCAL_MODE_CACHE = props().getProperty(PROP_MODE) === 'local';
  return LOCAL_MODE_CACHE;
}
let DISCONNECTED_CACHE = null;
function isDisconnected() { // V7.5
  if (DISCONNECTED_CACHE === null) DISCONNECTED_CACHE = isLocalMode() && props().getProperty(PROP_DISCONNECTED) === '1';
  return DISCONNECTED_CACHE;
}
function localMasterSheet() { return getSS().getSheetByName(LOCAL_MASTER_SHEET); }
function readLocalMaster() {
  const sh = localMasterSheet();
  if (!sh || sh.getLastRow() < 3) return [];
  const data = sh.getRange(1, 1, sh.getLastRow(), 6).getValues();
  const tz = Session.getScriptTimeZone();
  const out = [];
  for (let i = 2; i < data.length; i++) { const o = parseMasterRow(data[i], i, tz); if (o) out.push(o); }
  return out;
}

// ---------------- 원본 반영 대기열 ----------------
function queueSheet() {
  return getOrCreateSheet(SHEET_ORIGINAL_QUEUE, ['qid', 'createdAt', 'action', 'body', 'state', 'tries', 'result', 'doneAt']);
}
function enqueueMirror(action, body) {
  if (isDisconnected()) return; // V7.5: 원본과 완전 차단 — 원본에 반영하지 않음
  const copy = JSON.parse(JSON.stringify(body || {}));
  delete copy._reqId;
  queueSheet().appendRow([Utilities.getUuid().substring(0, 8), new Date().toISOString(), action, JSON.stringify(copy), 'pending', 0, '', '']);
  props().setProperty(PROP_MIRROR_FLAG, '1');
}
function runMirrorItem(action, body) {
  switch (action) {
    case 'pushToAppInput': return handlePushToAppInput(body);
    case 'syncAppSchedule': return handleSyncAppSchedule(body);
    case 'markNightShift': return handleMarkNightShift(body);
    case 'markNightShiftBatch': return handleMarkNightShiftBatch(body);
    case 'updateMasterSchedule': return handleUpdateMasterScheduleCore(body); // 키 이관은 웹앱 쪽에서 이미 끝남
    case 'updateMasterProgressStatus': return handleUpdateMasterProgressStatus(body);
    case 'deleteMasterSchedule': return handleDeleteMasterSchedule(body);
    default: return { status: 'fail', message: 'unknown mirror action ' + action };
  }
}
// 순서대로 처리. 통신/시간초과(error)는 다음 회차에 재시도(그 뒤 작업은 순서 보장을 위해 대기), 3회 넘으면 실패로 넘김
function processMirrorQueue(deadline) {
  const sh = queueSheet();
  const last = sh.getLastRow();
  if (last < 2) return { done: 0, failed: 0 };
  const rows = sh.getRange(2, 1, last - 1, 8).getValues();
  let done = 0, failed = 0;
  for (let i = 0; i < rows.length; i++) {
    if (Date.now() > deadline) break;
    const r = rows[i];
    const state = String(r[4]);
    if (state !== 'pending' && state !== 'error') continue;
    let res;
    try { res = runMirrorItem(String(r[2]), JSON.parse(String(r[3]) || '{}')); }
    catch (e) { res = { status: 'error', message: String(e) }; }
    const tries = (Number(r[5]) || 0) + 1;
    let newState;
    if (res && res.status === 'success') { newState = 'done'; done++; }
    else if (res && res.status === 'error' && tries < MIRROR_MAX_TRIES) newState = 'error';
    else { newState = 'fail'; failed++; }
    const msg = res ? String(res.warning || res.message || (res.skipped ? '원본에 해당 칸 없음(건너뜀)' : '')) : '';
    sh.getRange(i + 2, 5, 1, 4).setValues([[newState, tries, msg.substring(0, 500), new Date().toISOString()]]);
    rows[i][4] = newState;
    if (newState === 'error') break; // 순서 보장: 앞 작업이 끝나야 뒤 작업 진행
  }
  const left = rows.some(function (r) { const st = String(r[4]); return st === 'pending' || st === 'error'; });
  if (!left) { // 처리 중 새로 들어온 작업이 있으면 flag 유지
    if (queueSheet().getLastRow() === last) props().deleteProperty(PROP_MIRROR_FLAG);
  }
  return { done: done, failed: failed };
}
function handleRetryMirror(body) {
  const sh = queueSheet();
  const last = sh.getLastRow();
  if (last < 2) return { status: 'success', retried: 0 };
  const states = sh.getRange(2, 5, last - 1, 2).getValues();
  let n = 0;
  for (let i = 0; i < states.length; i++) {
    if (String(states[i][0]) === 'fail') { states[i] = ['pending', 0]; n++; }
  }
  if (n) { sh.getRange(2, 5, last - 1, 2).setValues(states); props().setProperty(PROP_MIRROR_FLAG, '1'); }
  return { status: 'success', retried: n };
}
function cleanupMirrorQueue(keepDays) {
  const sh = queueSheet();
  const last = sh.getLastRow();
  if (last < 2) return;
  const rows = sh.getRange(2, 1, last - 1, 8).getValues();
  const limit = Date.now() - keepDays * 86400000;
  for (let i = rows.length - 1; i >= 0; i--) {
    const t = new Date(rows[i][7] || rows[i][1]).getTime();
    if (String(rows[i][4]) === 'done' && t && t < limit) sh.deleteRow(i + 2);
  }
}

// ---------------- 로컬 모드 저장 처리 ----------------
function handleLocalAction(action, body) {
  const local = localMasterSheet();
  if (!local) return { status: 'fail', message: "'" + LOCAL_MASTER_SHEET + "' 탭이 없습니다. 편집기에서 setupV53을 실행해주세요." };

  if (isDisconnected() && (action === 'pushToAppInput' || action === 'markNightShift' || action === 'markNightShiftBatch')) {
    // V7.5: 원본 시험계획표 반영 요청은 할 일이 없음 → 성공으로 조용히 끝냄
    const items = (body && body.items) || [];
    return { status: 'success', disconnected: true, queued: true, skipped: true, touched: 0, filledDays: 0, totalDays: 0, snapshotAdded: false,
      results: items.map(function () { return { touched: 0 }; }) };
  }
  if (action === 'pushToAppInput') {
    const s = body.schedule;
    if (!s || !s.startDate) return { status: 'fail', message: '잘못된 요청입니다.' };
    if (!mapEqIdToNameNum(s.eqId)) return { status: 'fail', message: '시험계획표와 매칭되는 장비가 아닙니다 (휴일/이벤트 등은 반영 대상이 아닙니다).' };
    enqueueMirror(action, body);
    const n = parseInt(s.duration) || 1;
    return { status: 'success', queued: true, totalDays: n, filledDays: n, snapshotAdded: false };
  }

  if (action === 'syncAppSchedule') {
    const orig = body.original;
    if (!orig || !orig.startDate) return { status: 'fail', message: '잘못된 요청입니다.' };
    if (body.mode !== 'delete' && !body.schedule) return { status: 'fail', message: '잘못된 요청입니다.' };
    const o = { eqId: orig.eqId, startDate: orig.startDate, rawContent: buildAppInputContent(orig) };
    // 이관 전 원본에 함께 올라가 있던 쌍둥이 🔒 줄이 있으면 같이 고침(없으면 아무 일 없음)
    if (body.mode === 'delete') patchMasterSnapshot(o, null, local);
    else patchMasterSnapshot(o, { eqId: body.schedule.eqId, startDate: body.schedule.startDate, duration: body.schedule.duration,
      rawContent: normalizeCellText(buildAppInputContent(body.schedule)) }, local);
    enqueueMirror(action, body);
    return { status: 'success', queued: true, skipped: true, mode: body.mode, disconnected: isDisconnected() };
  }

  if (action === 'markNightShift' || action === 'markNightShiftBatch') {
    enqueueMirror(action, body);
    const items = (body && body.items) || [];
    return { status: 'success', queued: true, skipped: true, touched: 0, results: items.map(function () { return { touched: 0 }; }) };
  }

  if (action === 'updateMasterSchedule') {
    const s = body.schedule, orig = body.original;
    if (!s || !orig || String(s.id).indexOf('master_') !== 0) return { status: 'fail', message: '잘못된 요청입니다.' };
    if (!mapEqIdToNameNum(s.eqId) || !mapEqIdToNameNum(orig.eqId)) return { status: 'fail', message: '매칭되는 장비가 아닙니다.' };
    const origRaw = orig.rawContent != null ? orig.rawContent : orig.desc;
    const newRaw = normalizeCellText(buildAppInputContent(s));
    const moved = (s.startDate !== orig.startDate) || (parseInt(s.duration) !== parseInt(orig.duration)) || (s.eqId !== orig.eqId);
    const n = patchMasterSnapshot({ id: orig.id, eqId: orig.eqId, startDate: orig.startDate, rawContent: origRaw },
      { eqId: s.eqId, startDate: s.startDate, duration: s.duration, rawContent: newRaw }, local);
    if (!n) return { status: 'fail', message: '웹앱 원본에서 이 일정을 찾지 못했습니다. 🔄 새로고침 후 다시 시도해주세요.' };
    try { migrateMasterKeys(orig.eqId, origRaw, s.eqId, newRaw); } catch (e) {}
    enqueueMirror(action, body);
    const dur = parseInt(s.duration) || 1;
    return { status: 'success', queued: true, mode: moved ? 'move' : 'edit', touched: n, filledDays: dur, totalDays: dur,
      clearedCount: parseInt(orig.duration) || 1, newRawContent: newRaw, snapshotPatched: n };
  }

  if (action === 'updateMasterProgressStatus') {
    const s = body.schedule, v = body.statusValue;
    if (!s || String(s.id).indexOf('master_') !== 0) return { status: 'fail', message: '잘못된 요청입니다.' };
    if (v !== '완료' && v !== '' && v !== '미입고') return { status: 'fail', message: '지원하지 않는 상태 값입니다.' };
    const matchText = s.rawContent != null ? s.rawContent : s.desc;
    const n = patchMasterSnapshot({ id: s.id, eqId: s.eqId, startDate: s.startDate, rawContent: matchText }, { status: v }, local);
    if (!n) return { status: 'fail', message: '웹앱 원본에서 이 일정을 찾지 못했습니다. 🔄 새로고침 후 다시 시도해주세요.' };
    enqueueMirror(action, body);
    return { status: 'success', queued: true, touched: n };
  }

  if (action === 'deleteMasterSchedule') {
    const s = body.schedule;
    if (!s || String(s.id).indexOf('master_') !== 0 || !s.startDate || !s.rawContent) return { status: 'fail', message: '잘못된 요청입니다.' };
    const n = patchMasterSnapshot({ id: s.id, eqId: s.eqId, startDate: s.startDate, rawContent: s.rawContent }, null, local);
    if (!n) return { status: 'fail', message: '웹앱 원본에서 이 일정을 찾지 못했습니다. 🔄 새로고침 후 다시 시도해주세요.' };
    enqueueMirror(action, body);
    return { status: 'success', queued: true, clearedCount: parseInt(s.duration) || 1 };
  }
  return { status: 'fail', message: 'Unknown local action: ' + action };
}

// ---------------- 상태 정보(웹앱 표시용) ----------------
function getSyncInfo(detail) {
  const p = props();
  const info = { mode: isDisconnected() ? 'disconnected' : isLocalMode() ? 'local' : 'original', exportUrl: '', lastExportAt: p.getProperty(PROP_EXPORT_LAST) || '',
    exportDirty: 0, mirrorPending: 0, mirrorFailed: 0, failedItems: [] };
  const exId = p.getProperty(PROP_EXPORT_ID);
  if (exId) info.exportUrl = 'https://docs.google.com/spreadsheets/d/' + exId + '/edit';
  try { info.exportDirty = Object.keys(JSON.parse(p.getProperty(PROP_EXPORT_DIRTY) || '{}')).length; } catch (e) {}
  const qs = getSS().getSheetByName(SHEET_ORIGINAL_QUEUE);
  if (qs && qs.getLastRow() >= 2) {
    const rows = qs.getRange(2, 1, qs.getLastRow() - 1, 7).getValues();
    rows.forEach(function (r) {
      const st = String(r[4]);
      if (st === 'pending' || st === 'error') info.mirrorPending++;
      else if (st === 'fail') {
        info.mirrorFailed++;
        if (info.failedItems.length < 15) info.failedItems.push(mirrorItemLabel(String(r[2]), String(r[3])) + (r[6] ? ' — ' + r[6] : ''));
      }
    });
  }
  return info;
}
function mirrorItemLabel(action, bodyText) {
  let b = {}; try { b = JSON.parse(bodyText || '{}'); } catch (e) {}
  const s = b.schedule || b.original || {};
  const names = { pushToAppInput: '신규 반영', syncAppSchedule: '변경/삭제', markNightShift: '야간 표시', markNightShiftBatch: '야간 표시(묶음)',
    updateMasterSchedule: '🔒 일정 수정', updateMasterProgressStatus: '진행결과', deleteMasterSchedule: '🔒 일정 삭제' };
  const title = String(s.title || s.rawContent || '').split('\n')[0];
  return (names[action] || action) + (title ? ': ' + title : '') + (s.startDate ? ' (' + s.startDate + ')' : '');
}

// ---------------- 출력 시트 ----------------
// 웹앱 equipments 목록과 같은 순서/이름(웹앱 장비를 추가·변경하면 여기도 함께 맞춰주세요)
const EXPORT_EQUIPMENTS = [
  ['bg_1', '배광', '1호'], ['bg_2', '배광', '2호'], ['ov_1', '오븐', '1호'], ['ov_2', '오븐', '2호'],
  ['rm2_1', '2룸', '1호'], ['rm2_2', '2룸', '2호'], ['hm_1', '습기', '1호'], ['hm_2', '습기', '2호'], ['hm_3', '습기', '3호'],
  ['env_1', '환경챔버', '1호'], ['env_3', '환경챔버', '3호'], ['env_4', '환경챔버', '4호'], ['env_5', '환경챔버', '5호'],
  ['env_6', '환경챔버', '6호'], ['env_7', '환경챔버', '7호'], ['env_8', '환경챔버', '8호'],
  ['vib_1', '진동', '1호'], ['acc_1', '장기내열', '1호'], ['acc_2', '장기내열', '2호'], ['scan_1', '스캐너', '1호'],
  ['cmm_1', 'CMM', '1호'], ['shk_1', '충격', '1호'], ['etc_1', '기타', '1호'], ['etc_2', '기타', '2호']
];
const EXPORT_MIN_LANES = 5; // V6.9: 호기별 최소 순번(줄) 수
const EXPORT_CONTENT_WIDTH = 260; // V5.7: 계획내용 칸 너비(px) — 바꾸려면 이 숫자만
const EXPORT_ROW_HEIGHT = 16;     // V7.3: 장비 일정 행 높이(px) — 1줄(이벤트·근태 행은 자동)
const EXPORT_FONT = 'Noto Sans KR';  // V5.9
const EXPORT_COL_A_WIDTH = 200;      // V5.9: 시험장비 열 너비(px)
const EXPORT_RESULT_WIDTH = 62;      // V6.4: 진행결과 칸 너비(px)
// V6.4: 현장 진행여부 — 값 / 배경 / 글자색 / 캘린더 표시
const FIELD_STATUSES = ['샘플입고', '진행', '완료', '미입고', '지연'];
const FIELD_STYLE = {
  '샘플입고': { bg: '#dbeafe', fg: '#1d4ed8', icon: '📥' },
  '진행':     { bg: '#fef9c3', fg: '#a16207', icon: '▶' },
  '완료':     { bg: '#dcfce7', fg: '#15803d', icon: '✅' },
  '미입고':   { bg: '#fee2e2', fg: '#b91c1c', icon: '⛔' },
  '지연':     { bg: '#ffedd5', fg: '#c2410c', icon: '⏳' }
};
function fieldStatusRules(ranges) {
  return FIELD_STATUSES.map(function (v) {
    const st = FIELD_STYLE[v];
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(v).setBackground(st.bg).setFontColor(st.fg).setBold(true).setRanges(ranges).build();
  });
}     // V5.7: 일정 행 높이(px) — 글자 9pt 기준 2줄
// V5.7: 웹앱 막대 색(Tailwind 500 계열)과 동일 — 웹앱 groupColors / MAINT_TYPES 기준
const EXPORT_GROUP_COLOR = { bg_: '#6366f1', ov_: '#f97316', rm2_: '#f97316', hm_: '#0ea5e9', env_: '#10b981',
  vib_: '#a855f7', acc_: '#a855f7', shk_: '#a855f7', scan_: '#06b6d4', cmm_: '#06b6d4', etc_: '#64748b' };
// V7.7: 그룹별 유사색 4단계(500 → 700 → 400 → 600 순서로 돌려 이웃끼리 대비가 크게) · 3번째(400)는 연해서 진한 글씨
const EXPORT_GROUP_SHADES = {
  bg_:  ['#6366f1', '#4338ca', '#a5b4fc', '#4f46e5'],
  ov_:  ['#f97316', '#c2410c', '#fdba74', '#ea580c'], rm2_: ['#f97316', '#c2410c', '#fdba74', '#ea580c'],
  hm_:  ['#0ea5e9', '#0369a1', '#7dd3fc', '#0284c7'],
  env_: ['#10b981', '#047857', '#6ee7b7', '#059669'],
  vib_: ['#a855f7', '#7e22ce', '#d8b4fe', '#9333ea'], acc_: ['#a855f7', '#7e22ce', '#d8b4fe', '#9333ea'], shk_: ['#a855f7', '#7e22ce', '#d8b4fe', '#9333ea'],
  scan_: ['#06b6d4', '#0e7490', '#67e8f9', '#0891b2'], cmm_: ['#06b6d4', '#0e7490', '#67e8f9', '#0891b2'],
  etc_: ['#64748b', '#334155', '#cbd5e1', '#475569']
};
const EXPORT_LIGHT_SHADE_FONT = '#1e293b';
// V8.1: 시험항목 구분용 파스텔 8색(서로 뚜렷하게 다른 계열) — 진한 글씨
const EXPORT_TEST_PALETTE = ['#fbcfe8', '#fef08a', '#bbf7d0', '#ddd6fe', '#fed7aa', '#99f6e4', '#d9f99d', '#c7d2fe'];
const EXPORT_TEST_FONT = '#1e293b';
const EXPORT_START_LINE = '#334155'; // 시험 시작 칸 왼쪽 굵은 선
function testColorIndex(o) { // 같은 장비+제목이면 항상 같은 색
  let h = 0; const t = o.eqId + '|' + String(o.title || '').trim();
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
  return h % EXPORT_TEST_PALETTE.length;
}
// 줄(레인)마다 직전 시험과 바로 붙어 있고 색이 같으면 다음 색으로
function assignTestColor(o, prev) {
  let idx = testColorIndex(o);
  if (prev && prev.colorIdx === idx && (o.start - prev.end) <= 86400000 * 1.5) idx = (idx + 1) % EXPORT_TEST_PALETTE.length;
  o._tcolor = EXPORT_TEST_PALETTE[idx];
  return { colorIdx: idx, end: o.end };
}
function exportItemStyle(o) { // [배경, 글씨]
  if (isExportDelayed(o)) return [EXPORT_DELAY_COLOR, EXPORT_DELAY_FONT];
  if (o.virtual) return [EXPORT_HM_SOAK_COLOR, EXPORT_HM_SOAK_FONT];
  for (const p in EXPORT_MAINT_COLOR) if (String(o.id).indexOf(p) === 0) return [EXPORT_MAINT_COLOR[p], '#ffffff'];
  return [o._tcolor || EXPORT_TEST_PALETTE[testColorIndex(o)], EXPORT_TEST_FONT];
}
function isLightShade(hex) { // 연한 단계(진한 글씨 필요)
  for (const k in EXPORT_GROUP_SHADES) if (EXPORT_GROUP_SHADES[k][2] === hex) return true;
  return false;
}
const EXPORT_MAINT_COLOR = { maint_: '#1e293b', repairstop_: '#64748b', repair_: '#0d9488', needrepair_: '#ca8a04' };
const EXPORT_DONE_COLOR = '#cbd5e1'; // 완료·미입고·지연(웹앱 bg-slate-300)
// V7.2: 웹앱에서 미입고·지연된 일정 → 흐리게
const EXPORT_DELAY_STATUSES = { '미입고': 1, '검증지연': 1, '지연': 1 };
const EXPORT_DELAY_COLOR = '#e2e8f0', EXPORT_DELAY_FONT = '#64748b';
function exportAutoResult(o) { // V7.4: 진행결과 칸 자동 표시 값(드롭다운 값으로 맞춤)
  if (!isExportDelayed(o)) return '';
  return o.status === '미입고' ? '미입고' : '지연';
}
function isExportDelayed(o) { return !o.virtual && !isExportMaintenance(o) && !!EXPORT_DELAY_STATUSES[o.status]; }
function exportDelayPrefix(o) { return (isExportDelayed(o) ? '[' + o.status + '] ' : '') + (o.seq ? o.seq + ' ' : ''); } // V8.6: 연계 번호
function seqNoText(n) { // V8.6: 웹앱과 같은 원문자(①~㊿, 그 뒤는 (51))
  if (n >= 1 && n <= 20) return String.fromCharCode(0x2460 + n - 1);
  if (n >= 21 && n <= 35) return String.fromCharCode(0x3251 + n - 21);
  if (n >= 36 && n <= 50) return String.fromCharCode(0x32B1 + n - 36);
  return '(' + n + ')';
}
function exportSeqMarks(items) { // V8.6: memberKey(master:장비::원문 / app:id) → 원문자
  let seqs = []; try { seqs = readSequences(); } catch (e) { return; }
  const mk = {};
  seqs.forEach(function (g) { if (!g.no) return; const t = seqNoText(Number(g.no)); g.members.forEach(function (m) { mk[String(m.memberKey)] = t; }); });
  items.forEach(function (o) {
    if (o.virtual) return;
    const key = o.src === 'master' ? 'master:' + buildProtectionKey(o.eqId, o.raw) : 'app:' + o.id;
    if (mk[key]) o.seq = mk[key];
  });
}
function exportBarColor(o, shade) {
  if (isExportDelayed(o)) return EXPORT_DELAY_COLOR; // V7.2
  if (o.virtual) return EXPORT_HM_SOAK_COLOR; // V6.0: 💧 방치
  for (const p in EXPORT_MAINT_COLOR) if (o.id.indexOf(p) === 0) return EXPORT_MAINT_COLOR[p];
  // V6.4: 웹앱 진행상태로 회색 처리하지 않음(진행여부는 현장 기록으로만 표시)
  if (shade != null) for (const ps in EXPORT_GROUP_SHADES) if (o.eqId.indexOf(ps) === 0) return EXPORT_GROUP_SHADES[ps][shade % 4]; // V7.7
  for (const p in EXPORT_GROUP_COLOR) if (o.eqId.indexOf(p) === 0) return EXPORT_GROUP_COLOR[p];
  return '#64748b';
}
// V5.6: 첫 줄(제목)이 바로 아래 줄에 똑같이 반복되면 한 번만(출력 표시용, 원본은 안 바꿈)
function dedupeLeadingTitle(text) {
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
  while (lines.length > 1 && lines[0].trim() !== '' && lines[1].trim() === lines[0].trim()) lines.splice(1, 1);
  return lines.join('\n');
}
const EXPORT_FIRST_MONTH = '2024-09';

function exportSpreadsheet(createIfMissing) {
  const p = props();
  let id = p.getProperty(PROP_EXPORT_ID);
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) { if (!createIfMissing) throw e; } }
  if (!createIfMissing) return null;
  const ss = SpreadsheetApp.create('시험계획표(웹앱 출력)_비교용');
  p.setProperty(PROP_EXPORT_ID, ss.getId());
  return ss;
}
function monthKeyOf(d) { return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM'); }
function ymdToDate(str) { const m = String(str).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }

// 저장 요청에서 바뀐 날짜 범위를 찾아 그 달들을 '다시 그릴 달'로 표시
function markExportDirtyFromRequest(action, body) {
  const SKIP = { login: 1, register: 1, requestPermission: 1, resolveRequest: 1, updateUserRole: 1, deleteUser: 1, changePassword: 1,
    addHistory: 1, reassignScheduleHistory: 1, saveMemo: 1, deleteMemo: 1, saveMemoCategory: 1, deleteMemoCategory: 1,
    markReminderDone: 1, saveSequenceGroup: 1, deleteSequenceGroup: 1, setMasterReview: 1, setMasterHours: 1,
    setMasterReschedule: 1, setMasterArrival: 1, exportNow: 1, retryMirror: 1, markNightShift: 1, markNightShiftBatch: 1 };
  if (SKIP[action]) return;
  if (!props().getProperty(PROP_EXPORT_ID)) return;
  const months = {};
  const addRange = function (o) {
    if (!o || !o.startDate) return;
    const st = ymdToDate(o.startDate); if (!st) return;
    const dur = Math.max(1, Math.min(400, parseInt(o.duration) || 1));
    const en = new Date(st); en.setDate(en.getDate() + dur - 1);
    const c = new Date(st.getFullYear(), st.getMonth(), 1);
    while (c <= en) { months[monthKeyOf(c)] = 1; c.setMonth(c.getMonth() + 1); }
  };
  addRange(body.schedule); addRange(body.original); addRange(body.before); addRange(body.after);
  (body.schedules || []).forEach(addRange);
  if (!Object.keys(months).length) { // id만 온 요청(진행상태·삭제 등) → 지난달~3개월 뒤
    const now = new Date();
    for (let k = -1; k <= 3; k++) months[monthKeyOf(new Date(now.getFullYear(), now.getMonth() + k, 1))] = 1;
  }
  months.LIST = 1;
  addExportDirty(Object.keys(months));
}
function addExportDirty(keys) {
  const p = props();
  let d = {}; try { d = JSON.parse(p.getProperty(PROP_EXPORT_DIRTY) || '{}'); } catch (e) {}
  const now = Date.now();
  keys.forEach(function (k) { d[k] = now; });
  p.setProperty(PROP_EXPORT_DIRTY, JSON.stringify(d));
}

// 출력용 일정 모음: 🔒 원본 + 앱 등록(삭제·설정 레코드 제외, 원본과 똑같은 쌍둥이 앱 일정은 하나만)
function collectExportData() {
  const tz = Session.getScriptTimeZone();
  let masters;
  if (isLocalMode()) masters = readLocalMaster();
  else { // V5.8: 캐시 없이 원본을 새로 읽음(실패 시에만 안전장치 경로)
    try { masters = readMasterSchedules(true); } catch (e) { masters = null; }
    if (!masters || !masters.length) masters = readMasterSchedulesSafe();
  }
  const shifts = readMasterShifts(), prots = readMasterProtections();
  masters.forEach(function (m) {
    const k = buildProtectionKey(m.eqId, m.rawContent);
    m.shiftOverride = shifts[k] ? (shifts[k].shift || '') : '';
    m.protected = !!(prots[k] && String(prots[k].protected).toUpperCase() === 'TRUE');
  });
  const apps = sheetToObjects(schedulesSheet()).filter(function (s) { return s.status !== 'deleted'; });
  const twin = {};
  masters.forEach(function (m) { twin[[m.eqId, m.startDate, m.duration, String(m.title).trim()].join('|')] = 1; });
  const items = [], holidays = [], events = [], attendance = [];
  const norm = function (s, src) {
    const st = ymdToDate(s.startDate); if (!st) return null;
    const dur = Math.max(1, parseInt(s.duration) || 1);
    const en = new Date(st); en.setDate(en.getDate() + dur - 1);
    const status = src === 'master' ? String(s.status || '') : String(s.progressStatus || '');
    return { id: String(s.id), src: src, eqId: String(s.eqId || ''), title: String(s.title || ''), owner: String(s.owner || ''),
      desc: String(s.desc || ''), start: st, end: en, dur: dur, status: status === '진행' ? '' : status,
      night: s.shiftOverride === 'night', prot: String(s.protected) === 'true' || s.protected === true || String(s.protected).toUpperCase() === 'TRUE',
      text: dedupeLeadingTitle(src === 'master' ? String(s.rawContent || s.title) : buildAppInputContent(s)), updatedAt: String(s.updatedAt || ''),
      raw: src === 'master' ? s.rawContent : '' }; // V8.6: 연계 키용
  };
  masters.forEach(function (m) { const o = norm(m, 'master'); if (o) items.push(o); });
  apps.forEach(function (s) {
    const eq = String(s.eqId || '');
    if (eq === 'attendance_config') return;
    const o = norm(s, 'app'); if (!o) return;
    if (eq === 'holiday') { holidays.push(o); return; }
    if (eq === 'event') { events.push(o); return; }
    if (eq === 'attendance') { attendance.push(o); return; }
    if (twin[[s.eqId, Utilities.formatDate(o.start, tz, 'yyyy-MM-dd'), o.dur, o.title.trim()].join('|')]) return;
    items.push(o);
  });
  exportSeqMarks(items); // V8.6
  addHumidityStorageVirtuals(items); // V6.0
  return { items: items, holidays: holidays, events: events, attendance: attendance };
}

// V6.0: 💧 습기시험 방치(웹앱 getHumidityStorageVirtuals와 같은 규칙) — 마지막날 6호(½일), 전날 7호, 그 앞은 8호
const EXPORT_HM_SOAK_COLOR = '#bae6fd', EXPORT_HM_SOAK_FONT = '#0c4a6e';
function addHumidityStorageVirtuals(items) {
  const add = [];
  items.forEach(function (o) {
    if (o.eqId.indexOf('hm_') !== 0 || o.eqId === 'hm_1' || o.virtual) return; // V9.1: 습기 1호는 기간 전체 사용(환경챔버 규칙) → 방치 없음
    if (isExportMaintenance(o)) return; // V6.1: 고장·보수 기록은 시료가 없으니 방치 없음
    if (o.status === '미입고' || o.status === '검증지연' || o.status === '지연') return;
    if (o.dur < 2) return;
    let cur = null;
    for (let i = 0; i < o.dur; i++) {
      const fromEnd = o.dur - 1 - i;
      const eqId = fromEnd === 0 ? 'env_6' : fromEnd === 1 ? 'env_7' : 'env_8';
      const day = new Date(o.start); day.setDate(day.getDate() + i);
      if (cur && cur.eqId === eqId && !cur.half) { cur.dur++; cur.end = new Date(day); continue; }
      const half = fromEnd === 0;
      cur = { id: 'hmv_' + o.id + '_' + i, src: 'virtual', virtual: true, half: half, eqId: eqId, title: o.title, owner: o.owner, desc: '',
        start: new Date(day), end: new Date(day), dur: 1, status: '', night: false, prot: false,
        text: (half ? '💧½ 방치(오전): ' : '💧 방치: ') + o.title, updatedAt: '' };
      add.push(cur);
    }
  });
  add.forEach(function (v) { items.push(v); });
}
function isExportMaintenance(o) { // V6.1: 웹앱 isMaintenanceRecord와 같은 기준(id 접두어)
  for (const p in EXPORT_MAINT_COLOR) if (String(o.id).indexOf(p) === 0) return true;
  return false;
}
function pastelOf(id) {
  let h = 0; const t = String(id);
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
  return hslToHex(h % 360, 55, 86);
}
function statusColor(st) {
  if (st === '완료') return '#bbf7d0';
  if (st === '미입고' || st === '검증지연' || st === '지연') return '#fecaca';
  return null;
}
function dayIndex(d, first) { return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - first) / 86400000); }

// V8.9: 🎬 숨김 작업 탭에 다 그린 뒤 실제 탭으로 한 번에 붙여넣기(작업자에게 그리는 과정이 안 보이게)
const STAGE_TAB = '_출력작업';
function stagingSheet(ess) {
  let st = ess.getSheetByName(STAGE_TAB);
  if (!st) { st = ess.insertSheet(STAGE_TAB, ess.getSheets().length); try { st.hideSheet(); } catch (e) {} protectExportSheet(st); }
  try { st.setFrozenRows(0); st.setFrozenColumns(0); } catch (e) {}
  const all = st.getRange(1, 1, st.getMaxRows(), st.getMaxColumns());
  try { all.breakApart(); } catch (e) {}
  st.clear();
  try { all.clearDataValidations(); all.clearNote(); } catch (e) {}
  try { st.setConditionalFormatRules([]); } catch (e) {}
  return st;
}
function remapRanges(target, ranges) { return (ranges || []).map(function (r) { return target.getRange(r.getA1Notation()); }); }
function commitStaged(stg, target, R, W, after) {
  const pr = Math.max(target.getMaxRows(), R), pc = Math.max(target.getMaxColumns(), W);
  if (stg.getMaxRows() < pr) stg.insertRowsAfter(stg.getMaxRows(), pr - stg.getMaxRows());
  if (stg.getMaxColumns() < pc) stg.insertColumnsAfter(stg.getMaxColumns(), pc - stg.getMaxColumns());
  const src = stg.getRange(1, 1, pr, pc), dst = target.getRange(1, 1, pr, pc);
  try { src.copyTo(dst); }
  catch (e) { Logger.log('한 번에 붙이기 실패 → 병합 풀고 다시(' + target.getName() + '): ' + e); try { dst.breakApart(); } catch (e2) {} src.copyTo(dst); }
  try { src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_COLUMN_WIDTHS, false); } catch (e) {}
  try { // 조건부 서식은 실제 탭 범위로 다시 지정
    target.setConditionalFormatRules(stg.getConditionalFormatRules().map(function (r) { return r.copy().setRanges(remapRanges(target, r.getRanges())).build(); }));
  } catch (e) { Logger.log('조건부 서식 옮기기 실패: ' + e); }
  try { target.getRange(1, 1, R, W).setNotes(stg.getRange(1, 1, R, W).getNotes()); } catch (e) {}
  target.setFrozenRows(stg.getFrozenRows()); target.setFrozenColumns(stg.getFrozenColumns());
  if (target.getMaxRows() > R + 5) target.deleteRows(R + 6, target.getMaxRows() - R - 5);
  if (target.getMaxColumns() > W) target.deleteColumns(W + 1, target.getMaxColumns() - W);
  if (after) after(target);
}
function renderMonthTab(ess, key, data, ctx) { // V6.4: ctx = 현장기록 보관소
  const y = +key.substring(0, 4), mo = +key.substring(5, 7) - 1;
  const first = new Date(y, mo, 1), last = new Date(y, mo + 1, 0);
  const days = last.getDate();
  const tabName = y + '년 ' + (mo + 1) + '월';
  const W = 3 + days * 2;
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  const inMonth = function (o) { return o.end >= first && o.start <= last; };
  const tz = Session.getScriptTimeZone();
  const holidaySet = {};
  data.holidays.filter(inMonth).forEach(function (h) {
    for (let d = new Date(h.start); d <= h.end; d.setDate(d.getDate() + 1)) holidaySet[Utilities.formatDate(d, tz, 'yyyy-MM-dd')] = h.title;
  });

  const values = [], bgs = [], fcs = [], notes = []; // V6.8: notes = 칸 메모(전체 내용)
  const blankRow = function () { const r = []; for (let c = 0; c < W; c++) r.push(''); return r; };
  const blankBg = function () { const r = []; for (let c = 0; c < W; c++) r.push(null); return r; };
  const push = function (v, b) { values.push(v); bgs.push(b || blankBg()); fcs.push(blankBg()); notes.push(blankRow()); };

  const r1 = blankRow(); r1[0] = tabName + ' 시험계획표 (웹앱 출력)'; push(r1);
  push(blankRow()); // V5.9: A2 안내 문구 삭제(행은 비워 둠)
  push(blankRow());
  const h1 = blankRow(), h2 = blankRow(), hb1 = blankBg(), hb2 = blankBg();
  h1[0] = '시험장비'; h1[1] = '장비번호'; h1[2] = '순번';
  for (let c = 0; c < 3; c++) { hb1[c] = '#e2e8f0'; hb2[c] = '#e2e8f0'; }
  for (let i = 0; i < days; i++) {
    const d = new Date(y, mo, i + 1), col = 3 + i * 2;
    h1[col] = (mo + 1) + '/' + (i + 1) + '(' + DOW[d.getDay()] + ')';
    h2[col] = '상세내용'; h2[col + 1] = '진행결과';
    const isHol = holidaySet[Utilities.formatDate(d, tz, 'yyyy-MM-dd')];
    const color = isHol || d.getDay() === 0 ? '#fecdd3' : d.getDay() === 6 ? '#dbeafe' : '#e2e8f0';
    hb1[col] = hb1[col + 1] = hb2[col] = hb2[col + 1] = color;
  }
  push(h1, hb1); push(h2, hb2);

  const dayFill = function (row, bgRow, list, color) {
    list.filter(inMonth).forEach(function (o) {
      for (let d = new Date(Math.max(o.start, first)); d <= o.end && d <= last; d.setDate(d.getDate() + 1)) {
        const col = 3 + (d.getDate() - 1) * 2;
        row[col] = row[col] ? row[col] + '\n' + o._label : o._label;
        bgRow[col] = (typeof color === 'function') ? color(o) : color;
      }
    });
  };
  data.holidays.forEach(function (o) { o._label = '🎌 ' + o.title; });
  data.events.forEach(function (o) { o._label = '📌 ' + o.title; });
  data.attendance.forEach(function (o) { o._label = (o.owner ? o.owner + ' ' : '') + o.title; });
  const ev = blankRow(), evb = blankBg(); ev[0] = '이벤트'; dayFill(ev, evb, data.holidays.concat(data.events), function (o) { return o.eqId === 'holiday' ? '#f43f5e' : '#f59e0b'; }); push(ev, evb);
  for (let c = 3; c < W; c++) if (evb[c]) fcs[fcs.length - 1][c] = '#ffffff';
  // V6.7: '근태' 줄 = 현장 입력 줄(웹앱 근태는 내보내지 않음, 날짜별 보관·복원)
  const fa = blankRow(), fab = blankBg(); fa[0] = ATT_FIELD_LABEL;
  const attRowNo = values.length + 1;
  if (ctx) ctx.newMap.push([tabName, attRowNo, 0, '__att__', '', '', '']);
  for (let i = 0; i < days; i++) {
    const col = 3 + i * 2;
    const dk = Utilities.formatDate(new Date(y, mo, i + 1), tz, 'yyyy-MM-dd');
    const rec = ctx && ctx.records['att|' + dk];
    fa[col] = rec ? rec.value : '';
    fab[col] = fab[col + 1] = '#ecfdf5';
  }
  fab[0] = fab[1] = fab[2] = '#ecfdf5';
  push(fa, fab);

  const groupBottoms = [];
  const startCells = []; // V8.1: 시험 시작 칸(A1 주소)
  const unitBlocks = []; // V5.9: [시작행, 행수] — 장비번호 병합용
  const nameBlocks = []; // V5.9: [시작행, 행수] — 시험장비명 병합용
  EXPORT_EQUIPMENTS.forEach(function (eq) {
    const list = data.items.filter(function (o) { return o.eqId === eq[0] && inMonth(o); })
      .sort(function (a, b) { return (a.start - b.start) || (b.dur - a.dur); });
    const laneEnd = []; // 레인별 마지막 종료일
    const lanePrev = []; // V8.1: 레인별 직전 시험 색
    list.forEach(function (o) {
      let lane = 0;
      while (lane < laneEnd.length && laneEnd[lane] >= o.start) lane++;
      laneEnd[lane] = o.end; o._lane = lane;
      lanePrev[lane] = assignTestColor(o, lanePrev[lane]);
    });
    const lanes = Math.max(EXPORT_MIN_LANES, laneEnd.length);
    const startRow = values.length;
    for (let l = 0; l < lanes; l++) {
      const r = blankRow(), b = blankBg();
      r[0] = eq[1]; r[1] = eq[2]; r[2] = l + 1;
      push(r, b);
    }
    list.forEach(function (o) {
      const st = exportItemStyle(o); // V8.1: 시험마다 다른 색
      const rowIdx = startRow + o._lane, color = st[0], font = st[1];
      const firstD = new Date(Math.max(o.start, first));
      startCells.push(sheetA1(rowIdx + 1, 3 + (firstD.getDate() - 1) * 2 + 1)); // 시작 칸 왼쪽 굵은 선
      const text = exportDelayPrefix(o) + (o.night ? '🌙 ' : '') + (o.prot ? '🛡️ ' : '') + o.text; // V7.2: [미입고] 등
      for (let d = new Date(Math.max(o.start, first)); d <= o.end && d <= last; d.setDate(d.getDate() + 1)) {
        const col = 3 + (d.getDate() - 1) * 2;
        values[rowIdx][col] = text; bgs[rowIdx][col] = color; fcs[rowIdx][col] = font;
        notes[rowIdx][col] = text; // V6.8
        bgs[rowIdx][col + 1] = color; fcs[rowIdx][col + 1] = font;
        if (!o.virtual && ctx) { // V6.4: 현장 기록 칸(💧 방치 표시는 제외)
          const dk = Utilities.formatDate(d, tz, 'yyyy-MM-dd');
          const rec = ctx.records[o.id + '|' + dk];
          const auto = exportAutoResult(o); // V7.4: 웹앱 미입고·지연 자동 표시(현장 기록 우선)
          values[rowIdx][col + 1] = rec ? rec.value : auto;
          ctx.newMap.push([tabName, rowIdx + 1, col + 2, o.id, dk, eq[1] + ' ' + eq[2], o.title, rec ? '' : auto]);
          ctx.placeable[o.id + '|' + dk] = 1;
        }
      }
    });
    groupBottoms.push(values.length);
    unitBlocks.push([startRow + 1, lanes]);
    const lastName = nameBlocks.length ? nameBlocks[nameBlocks.length - 1] : null;
    if (lastName && lastName.name === eq[1]) lastName[1] += lanes;
    else { const nb = [startRow + 1, lanes]; nb.name = eq[1]; nameBlocks.push(nb); }
  });

  let target = ess.getSheetByName(tabName); // V8.9: 실제 탭(마지막에 한 번에 붙여넣음)
  if (!target) {
    // 탭 순서: 달 순서대로
    const names = ess.getSheets().map(function (x) { return x.getName(); });
    let idx = 0;
    names.forEach(function (n, i) { const m = n.match(/^(\d{4})년 (\d{1,2})월$/); if (m && (+m[1] * 12 + +m[2]) < (y * 12 + mo + 1)) idx = i + 1; });
    target = ess.insertSheet(tabName, idx);
  }
  const sh = stagingSheet(ess); // V8.9: 여기서부터는 숨김 작업 탭에 그림
  try { sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).breakApart(); } catch (e) {} // V5.9: 이전 병합 해제
  sh.clear(); // 값·서식
  const R = values.length;
  if (sh.getMaxRows() < R) sh.insertRowsAfter(sh.getMaxRows(), R - sh.getMaxRows());
  if (sh.getMaxColumns() < W) sh.insertColumnsAfter(sh.getMaxColumns(), W - sh.getMaxColumns());
  if (sh.getMaxRows() > R + 5) sh.deleteRows(R + 6, sh.getMaxRows() - R - 5);
  if (sh.getMaxColumns() > W) sh.deleteColumns(W + 1, sh.getMaxColumns() - W);
  const all = sh.getRange(1, 1, R, W);
  all.setValues(values).setBackgrounds(bgs).setVerticalAlignment('top').setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP).setFontSize(9);
  all.setFontColors(fcs.map(function (r) { return r.map(function (c) { return c || '#000000'; }); })); // V5.7
  all.setFontFamily(EXPORT_FONT); // V5.9
  all.setNotes(notes); // V6.8: 마우스를 올리면 전체 내용
  // V7.3: 장비 줄(8행~)만 높이 고정 · 이벤트·근태(6~7행)는 줄바꿈 허용 + 자동 높이
  if (R >= 8) sh.setRowHeightsForced(8, R - 7, EXPORT_ROW_HEIGHT);
  sh.getRange(6, 4, 2, W - 3).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sh.autoResizeRows(6, 2);
  sh.getRange(4, 1, 2, W).setVerticalAlignment('middle');
  sh.getRange(1, 1).setFontSize(14).setFontWeight('bold');
  sh.getRange(4, 1, 2, W).setFontWeight('bold').setHorizontalAlignment('center');
  sh.getRange(6, 1, R - 5, 3).setFontWeight('bold').setHorizontalAlignment('center');
  sh.setFrozenRows(5); sh.setFrozenColumns(3);
  // V5.6: 열 너비는 매번 열마다 지정(계획내용 D·F·H… = EXPORT_CONTENT_WIDTH, 진행결과 = 52px)
  sh.setColumnWidth(1, EXPORT_COL_A_WIDTH); sh.setColumnWidth(2, 50); sh.setColumnWidth(3, 36);
  for (let i = 0; i < days; i++) { sh.setColumnWidth(4 + i * 2, EXPORT_CONTENT_WIDTH); sh.setColumnWidth(5 + i * 2, EXPORT_RESULT_WIDTH); }
  sh.getRange(4, 1, R - 3, W).setBorder(true, true, true, true, true, false, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
  groupBottoms.forEach(function (rb) { sh.getRange(rb, 1, 1, W).setBorder(null, null, true, null, null, null, '#475569', SpreadsheetApp.BorderStyle.SOLID_MEDIUM); });
  sh.getRange(7, 1, 1, W).setBorder(null, null, true, null, null, null, '#475569', SpreadsheetApp.BorderStyle.SOLID_MEDIUM); // V7.8: 근태 줄 아래 굵은 구분선
  drawStartLines(sh, startCells); // V8.1
  // V5.9: 같은 시험장비명 / 같은 장비번호 세로 병합(가운데 정렬)
  nameBlocks.forEach(function (b) { if (b[1] > 1) sh.getRange(b[0], 1, b[1], 1).merge(); });
  unitBlocks.forEach(function (b) { if (b[1] > 1) sh.getRange(b[0], 2, b[1], 1).merge(); });
  sh.getRange(6, 1, R - 5, 2).setVerticalAlignment('middle');
  // V6.4: 진행결과 칸(장비 행) — 드롭다운 · 값별 색 · 보호 해제
  const firstEqRow = 8, nEq = R - firstEqRow + 1; // V6.7: 7행 = 근태(현장 입력)
  const resultRanges = [];
  const attOpen = [];
  for (let i = 0; i < days; i++) attOpen.push(sh.getRange(7, 4 + i * 2, 1, 2)); // 근태 날짜 칸 열어 둠
  sh.getRange(7, 1, 1, 3).merge();
  sh.getRange(7, 4, 1, W - 3).setFontColor('#065f46').setHorizontalAlignment('left');
  if (nEq > 0) {
    const body = sh.getRange(firstEqRow, 1, nEq, W);
    body.clearDataValidations();
    const rule = SpreadsheetApp.newDataValidation().requireValueInList(FIELD_STATUSES, true).setAllowInvalid(false)
      .setHelpText('현장 진행여부를 고르세요(웹앱에는 반영되지 않음)').build();
    const dv = [];
    for (let r = 0; r < nEq; r++) { const row = []; for (let c = 0; c < W; c++) row.push(c >= 3 && (c - 3) % 2 === 1 ? rule : null); dv.push(row); }
    body.setDataValidations(dv);
    for (let i = 0; i < days; i++) resultRanges.push(sh.getRange(firstEqRow, 5 + i * 2, nEq, 1));
    sh.getRange(6, 4, R - 5, W - 3).setHorizontalAlignment('left'); // V6.5: 계획 칸 왼쪽 정렬
    sh.getRangeList(resultRanges.map(function (rg) { return rg.getA1Notation(); }))
      .setHorizontalAlignment('center').setVerticalAlignment('middle'); // 진행결과 칸만 가운데
    sh.setConditionalFormatRules(fieldStatusRules(resultRanges));
  }
  // V8.7: 오늘 하이라이트(조건부 서식 — 날짜가 바뀌면 자동) + 오늘 열 빨간 테두리 + 📍 오늘로 이동 링크
  const dayExpr = function (a1) { return 'DATE(' + y + ',' + (mo + 1) + ',INT((COLUMN(' + a1 + ')-4)/2)+1)=TODAY()'; };
  const cfr = sh.getConditionalFormatRules();
  cfr.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=' + dayExpr('D4'))
    .setBackground('#f59e0b').setFontColor('#ffffff').setBold(true).setRanges([sh.getRange(4, 4, 2, W - 3)]).build());
  if (R > 5) cfr.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(D6="",' + dayExpr('D6') + ')')
    .setBackground('#fef9c3').setRanges([sh.getRange(6, 4, R - 5, W - 3)]).build());
  sh.setConditionalFormatRules(cfr);
  const tnow = new Date();
  if (tnow.getFullYear() === y && tnow.getMonth() === mo)
    sh.getRange(4, 4 + (tnow.getDate() - 1) * 2, R - 3, 2).setBorder(true, true, true, true, null, null, '#dc2626', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sh.getRange('A2').setFormula(todayLinkFormula()).setFontWeight('bold').setFontColor('#b45309').setFontSize(10);
  const dvRows = nEq > 0 ? sh.getRange(firstEqRow, 1, nEq, W).getDataValidations() : null;
  commitStaged(sh, target, R, W, function (t) { // V8.9: 한 번에 붙여넣기 + 줄 높이·드롭다운 확인
    if (R >= 8) t.setRowHeightsForced(8, R - 7, EXPORT_ROW_HEIGHT);
    try { t.autoResizeRows(6, 2); } catch (e) {}
    if (dvRows) t.getRange(firstEqRow, 1, nEq, W).setDataValidations(dvRows);
  });
  protectExportSheet(target, remapRanges(target, resultRanges.concat(attOpen))); // V6.2 (V6.4: 진행결과 칸 · V6.6: 근태(현장) 칸은 열어 둠)
  return tabName;
}
// V8.7: 📍 오늘로 이동 — '_탭목록'(yyyy-mm → 탭 번호)에서 이번 달 탭을 찾아 오늘 칸으로
const TAB_INDEX_TAB = '_탭목록';
function todayLinkFormula() {
  return '=IFERROR(HYPERLINK("#gid="&VLOOKUP(TEXT(TODAY(),"yyyy-mm"),\'' + TAB_INDEX_TAB + '\'!$A:$B,2,FALSE)&"&range="&ADDRESS(4,4+(DAY(TODAY())-1)*2,4),"📍 오늘로 이동"),"📍 이번 달 탭 없음")';
}
function writeTabIndex(ess) {
  const rows = [];
  ess.getSheets().forEach(function (x) {
    const m = x.getName().match(/^(\d{4})년 (\d{1,2})월$/);
    if (m) rows.push([m[1] + '-' + ('0' + m[2]).slice(-2), x.getSheetId()]);
  });
  const ts = hiddenTab(ess, TAB_INDEX_TAB, ['월', '탭번호']);
  if (ts.getLastRow() > 1) ts.getRange(2, 1, ts.getLastRow() - 1, 2).clearContent();
  if (rows.length) { ts.getRange(2, 1, rows.length, 1).setNumberFormat('@'); ts.getRange(2, 1, rows.length, 2).setValues(rows); }
  try { protectExportSheet(ts); } catch (e) {}
}
// ---------------- V6.4: 현장 진행여부 기록 ----------------
const FIELD_REC_TAB = '_현장기록', FIELD_MAP_TAB = '_셀맵', UNPLACED_TAB = '미반영 기록';
const ATT_FIELD_LABEL = '근태'; // V6.7: 현장 입력 근태 줄 이름표
const ATT_FIELD_LABEL_V66 = '근태(현장)'; // V6.6 배치 호환
const PROP_FIELD_HARVEST = 'FIELD_HARVEST_AT';
function hiddenTab(ess, name, header) {
  let sh = ess.getSheetByName(name);
  if (!sh) { sh = ess.insertSheet(name); sh.getRange(1, 1, 1, header.length).setValues([header]); }
  try { sh.hideSheet(); } catch (e) {}
  return sh;
}
function loadFieldCtx(ess) {
  const rs = hiddenTab(ess, FIELD_REC_TAB, ['key', 'id', 'date', 'eq', 'title', 'value', 'updatedAt']);
  const ms = hiddenTab(ess, FIELD_MAP_TAB, ['tab', 'row', 'col', 'id', 'date', 'eq', 'title', 'auto']);
  const records = {};
  if (rs.getLastRow() >= 2) rs.getRange(2, 1, rs.getLastRow() - 1, 7).getValues().forEach(function (r) {
    if (r[0]) records[String(r[0])] = { id: String(r[1]), date: String(r[2]), eq: String(r[3]), title: String(r[4]), value: String(r[5]), updatedAt: String(r[6]) };
  });
  const mapByTab = {};
  if (ms.getLastRow() >= 2) ms.getRange(2, 1, ms.getLastRow() - 1, Math.max(7, Math.min(8, ms.getLastColumn()))).getValues().forEach(function (r) {
    const t = String(r[0]); if (!t) return;
    (mapByTab[t] = mapByTab[t] || []).push(r);
  });
  return { records: records, mapByTab: mapByTab, newMap: [], renderedTabs: {}, placeable: {}, changed: false };
}
// 탭의 진행결과 칸을 읽어 보관소에 반영: 위치표에 있는 칸 = 그 일정·날짜 기록(비우면 삭제), 위치표에 없는 칸 = 일정 없는 칸 기록
function harvestFieldTab(ess, tabName, ctx) {
  const sh = ess.getSheetByName(tabName);
  if (!sh || sh.getLastRow() < 8) return;
  if (!ctx.mapByTab[tabName]) return; // 위치표가 없는 탭(V6.3 이전에 그린 탭)은 읽지 않음 — 웹앱 상태 글자를 현장 기록으로 착각하지 않게
  const R = sh.getLastRow(), W = sh.getLastColumn();
  const vals = sh.getRange(1, 1, R, W).getValues();
  const now = new Date().toISOString();
  const mapped = {};
  (ctx.mapByTab[tabName] || []).forEach(function (m) {
    if (String(m[3]) === '__att__') return; // V6.7: 근태 줄 표시(아래에서 따로 읽음)
    const row = +m[1], col = +m[2], key = String(m[3]) + '|' + String(m[4]);
    mapped[row + ',' + col] = 1;
    const v = row <= R && col <= W ? String(vals[row - 1][col - 1] || '').trim() : '';
    const old = ctx.records[key];
    const auto = String(m[7] || '');
    if (auto && !old && (v === auto || v === '')) return; // V7.4: 웹앱 자동 표시 값 그대로(또는 지움) → 현장 기록 아님
    if (v) {
      if (!old || old.value !== v) { ctx.records[key] = { id: String(m[3]), date: String(m[4]), eq: String(m[5]), title: String(m[6]), value: v, updatedAt: now }; ctx.changed = true; }
    } else if (old) { delete ctx.records[key]; ctx.changed = true; } // 현장에서 지움
  });
  const ym = tabName.match(/^(\d{4})년 (\d{1,2})월$/);
  if (!ym) return;
  // 현장 근태 줄 찾기: V6.7 배치는 위치표의 '__att__' 표시, V6.6 배치는 '근태(현장)' 이름표
  // (V6.5 이전 배치의 '근태' 줄은 웹앱 근태라 읽지 않음)
  let attRow = 0;
  (ctx.mapByTab[tabName] || []).forEach(function (m) { if (String(m[3]) === '__att__') attRow = +m[1]; });
  if (!attRow) for (let r = 6; r <= Math.min(R, 12); r++) if (String(vals[r - 1][0]) === ATT_FIELD_LABEL_V66) { attRow = r; break; }
  if (attRow) {
    for (let c = 4; c <= W; c += 2) {
      const day = (c - 2) / 2;
      const date = ym[1] + '-' + ('0' + ym[2]).slice(-2) + '-' + ('0' + day).slice(-2);
      const parts = [String(vals[attRow - 1][c - 1] || '').trim(), c < W ? String(vals[attRow - 1][c] || '').trim() : ''].filter(String);
      const v = parts.join('\n'), key = 'att|' + date, old = ctx.records[key];
      if (v) { if (!old || old.value !== v) { ctx.records[key] = { id: '', date: date, eq: '근태', title: '근태(현장)', value: v, updatedAt: now }; ctx.changed = true; } }
      else if (old) { delete ctx.records[key]; ctx.changed = true; }
    }
  }
  // 위치표에 없는 칸(일정 없는 칸)에 적은 값 → 미반영 기록으로
  let curEq = '', curNo = '';
  for (let r = attRow ? attRow + 1 : 8; r <= R; r++) {
    if (vals[r - 1][0]) curEq = String(vals[r - 1][0]);
    if (vals[r - 1][1]) curNo = String(vals[r - 1][1]);
    for (let c = 5; c <= W; c += 2) {
      const v = String(vals[r - 1][c - 1] || '').trim();
      if (!v || mapped[r + ',' + c]) continue;
      const day = (c - 3) / 2;
      const date = ym[1] + '-' + ('0' + ym[2]).slice(-2) + '-' + ('0' + day).slice(-2);
      const key = 'x|' + date + '|' + curEq + ' ' + curNo + '|' + r;
      if (!ctx.records[key] || ctx.records[key].value !== v) {
        ctx.records[key] = { id: '', date: date, eq: curEq + ' ' + curNo, title: '(일정 없는 칸)', value: v, updatedAt: now };
        ctx.changed = true;
      }
    }
  }
}
function saveFieldCtx(ess, ctx) {
  const rs = ess.getSheetByName(FIELD_REC_TAB), ms = ess.getSheetByName(FIELD_MAP_TAB);
  const recRows = Object.keys(ctx.records).sort().map(function (k) { const r = ctx.records[k]; return [k, r.id, r.date, r.eq, r.title, r.value, r.updatedAt]; });
  writeTable(rs, ['key', 'id', 'date', 'eq', 'title', 'value', 'updatedAt'], recRows);
  // 위치표: 이번에 다시 그린 탭은 새 위치로 교체, 나머지 탭은 그대로
  const mapRows = [];
  Object.keys(ctx.mapByTab).forEach(function (t) { if (!ctx.renderedTabs[t]) ctx.mapByTab[t].forEach(function (r) { mapRows.push(r); }); });
  ctx.newMap.forEach(function (r) { mapRows.push(r); });
  writeTable(ms, ['tab', 'row', 'col', 'id', 'date', 'eq', 'title', 'auto'], mapRows.map(function (r) { const x = r.slice(0, 8); while (x.length < 8) x.push(''); return x; }));
  // 다음 회차를 위해 최신 위치표로 교체
  ctx.mapByTab = {}; mapRows.forEach(function (r) { (ctx.mapByTab[String(r[0])] = ctx.mapByTab[String(r[0])] || []).push(r); });
  ctx.newMap = []; ctx.renderedTabs = {};
}
function writeTable(sh, header, rows) {
  sh.clearContents();
  const all = [header].concat(rows);
  if (sh.getMaxRows() < all.length) sh.insertRowsAfter(sh.getMaxRows(), all.length - sh.getMaxRows());
  if (sh.getMaxColumns() < header.length) sh.insertColumnsAfter(sh.getMaxColumns(), header.length - sh.getMaxColumns());
  sh.getRange(1, 1, all.length, header.length).setNumberFormat('@').setValues(all.map(function (r) { return r.map(function (v) { return v == null ? '' : String(v); }); }));
}
function fieldSummary(ctx, id) {
  if (!ctx) return '';
  const out = [];
  Object.keys(ctx.records).forEach(function (k) {
    const r = ctx.records[k];
    if (r.id === String(id)) out.push([r.date, (+r.date.substring(5, 7)) + '/' + (+r.date.substring(8, 10)) + ' ' + r.value]);
  });
  return out.sort(function (a, b) { return a[0] < b[0] ? -1 : 1; }).map(function (x) { return x[1]; }).join(', ');
}
// 놓을 자리가 없는 기록 목록(일정 이동·삭제 / 일정 없는 칸) — '삭제' 체크하면 다음 정리 때 기록에서 지움
function renderUnplacedTab(ess, data, ctx) {
  const tz = Session.getScriptTimeZone();
  const live = {}; // 지금 존재하는 [일정 id|날짜]
  data.items.forEach(function (o) {
    if (o.virtual) return;
    for (let d = new Date(o.start); d <= o.end; d.setDate(d.getDate() + 1)) live[o.id + '|' + Utilities.formatDate(d, tz, 'yyyy-MM-dd')] = 1;
  });
  let sh = ess.getSheetByName(UNPLACED_TAB);
  // 삭제 체크된 줄 먼저 정리
  if (sh && sh.getLastRow() >= 3) {
    const v = sh.getRange(3, 1, sh.getLastRow() - 2, 8).getValues();
    v.forEach(function (r) { if (r[7] === true && ctx.records[String(r[0])]) { delete ctx.records[String(r[0])]; ctx.changed = true; } });
    if (ctx.changed) saveFieldCtx(ess, ctx);
  }
  const rows = [];
  Object.keys(ctx.records).forEach(function (k) {
    const r = ctx.records[k];
    let why = '';
    if (k.indexOf('att|') === 0) return; // V6.6: 현장 근태는 날짜 기준이라 항상 제자리
    if (k.indexOf('x|') === 0) why = '일정 없는 칸에 입력';
    else if (!live[k]) why = '일정이 다른 날로 옮겨졌거나 삭제됨';
    if (why) rows.push([k, r.date, r.eq, r.title, r.value, r.updatedAt ? Utilities.formatDate(new Date(r.updatedAt), tz, 'yyyy-MM-dd HH:mm') : '', why, false]);
  });
  rows.sort(function (a, b) { return a[1] < b[1] ? -1 : 1; });
  if (!sh) {
    const lst = ess.getSheetByName('전체목록');
    sh = ess.insertSheet(UNPLACED_TAB, lst ? lst.getIndex() : ess.getSheets().length);
  }
  sh.clear();
  try { sh.getRange(1, 1, sh.getMaxRows(), 8).clearDataValidations(); } catch (e) {}
  sh.getRange('A1').setValue('현장 기록 중 월별 탭에 다시 놓을 자리가 없는 것 — 필요하면 웹앱에서 확인 후, [삭제]에 체크하면 다음 출력 때 정리됩니다. (' + rows.length + '건)');
  const header = ['key', '날짜', '장비', '시험명', '진행여부', '기록시각', '사유', '삭제'];
  const all = [header].concat(rows);
  if (sh.getMaxRows() < all.length + 2) sh.insertRowsAfter(sh.getMaxRows(), all.length + 2 - sh.getMaxRows());
  sh.getRange(2, 1, all.length, 8).setValues(all).setFontFamily(EXPORT_FONT).setFontSize(9);
  sh.getRange(2, 1, 1, 8).setFontWeight('bold').setBackground('#e2e8f0');
  sh.getRange('A1').setFontWeight('bold').setFontColor('#475569');
  if (rows.length) {
    sh.getRange(3, 8, rows.length, 1).insertCheckboxes();
    sh.setConditionalFormatRules(fieldStatusRules([sh.getRange(3, 5, rows.length, 1)]));
  } else sh.setConditionalFormatRules([]);
  sh.hideColumns(1);
  [1, 90, 110, 280, 70, 120, 220, 50].forEach(function (w, i) { if (i) sh.setColumnWidth(i + 1, w); });
  sh.setFrozenRows(2);
  protectExportSheet(sh, rows.length ? [sh.getRange(3, 8, rows.length, 1)] : []);
}
// 5분마다: 이번 달·전후 달 탭의 현장 기록만 읽어 보관(다시 그리지 않음) → 바뀌었으면 캘린더·목록·미반영 갱신 예약
function harvestRecentField() {
  const ess = exportSpreadsheet(false);
  if (!ess) return;
  const ctx = loadFieldCtx(ess);
  const now = new Date();
  for (let k = -1; k <= 1; k++) {
    const d = new Date(now.getFullYear(), now.getMonth() + k, 1);
    harvestFieldTab(ess, d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월', ctx);
  }
  const um = ess.getSheetByName(UNPLACED_TAB);
  let wantClean = false;
  if (um && um.getLastRow() >= 3) wantClean = um.getRange(3, 8, um.getLastRow() - 2, 1).getValues().some(function (r) { return r[0] === true; });
  if (ctx.changed) saveFieldCtx(ess, ctx);
  if (ctx.changed || wantClean) addExportDirty(['LIST']);
}

// V8.1: A1 주소 / 시작 칸 왼쪽 굵은 선(여러 칸을 한 번에)
function sheetA1(row, col) {
  let c = '', n = col;
  while (n > 0) { const m = (n - 1) % 26; c = String.fromCharCode(65 + m) + c; n = Math.floor((n - 1) / 26); }
  return c + row;
}
function drawStartLines(sh, cells) {
  for (let i = 0; i < cells.length; i += 400) {
    try { sh.getRangeList(cells.slice(i, i + 400)).setBorder(null, true, null, null, null, null, EXPORT_START_LINE, SpreadsheetApp.BorderStyle.SOLID_THICK); }
    catch (e) { Logger.log('시작선 표시 실패: ' + e); }
  }
}

// ---------------- V8.0: 📊 간트차트 ----------------
const GANTT_TAB = '📊 간트차트';
const GANTT_DAY_WIDTH = 26;  // 하루 칸 너비(px)
const GANTT_ROW_HEIGHT = 18; // 줄 높이(px)
// V8.8: 웹앱 parseVehicleAndItem과 같은 규칙 — 차종=[ ] 안, 품목=그 뒤 첫 단어, 사양=STD/OPT/XLINE/EXP/GT/GTL/BASIS/SA로 시작하는 단어
function exportParseVIS(title) {
  const t = String(title || '');
  const vm = t.match(/\[([^\]]+)\]/); if (!vm) return null;
  const vehicle = vm[1].trim();
  const after = t.slice(vm.index + vm[0].length).trim();
  const sm = after.match(/\b(XLINE|GTL|STD|OPT|EXP|GT|BASIS|SA\b)/);
  const first = after.split(/\s+/)[0] || '';
  if (!first || (sm && sm.index === 0)) return { vehicle: vehicle, item: '', spec: sm ? after.slice(sm.index).split(/\s+/)[0] : '' };
  return { vehicle: vehicle, item: first, spec: sm ? after.slice(sm.index).split(/\s+/)[0] : '' };
}
function exportVisNorm(v) { return String(v || '').trim().toUpperCase().replace(/\s+/g, ' '); }
const GANTT_FILTER_LABELS = ['차종', '품목', '사양'];
function ganttFilterCol(k, isValue) { return 2 + 11 + k * 7 + (isValue ? 2 : 0) + 1; } // 1부터 세는 열 번호(C0=2 기준)
function renderGanttTab(ess, data) {
  const tz = Session.getScriptTimeZone();
  // V8.8: 이전에 고른 차종·품목·사양(다시 그려도 유지)
  const prevSel = ['', '', ''];
  try { const ps = ess.getSheetByName(GANTT_TAB); if (ps && ps.getMaxColumns() >= ganttFilterCol(2, true)) for (let k = 0; k < 3; k++) prevSel[k] = String(ps.getRange(1, ganttFilterCol(k, true)).getValue() || ''); } catch (e) {}
  const visOpts = [{}, {}, {}];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(today); start.setDate(start.getDate() - 7);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // 월요일로 맞춤
  const end = new Date(today); end.setDate(end.getDate() + 56);
  end.setDate(end.getDate() + (7 - end.getDay()) % 7); // 일요일로 맞춤
  const days = Math.round((end - start) / 86400000) + 1;
  const C0 = 2, W = C0 + days; // A=장비, B=호기, C~=날짜
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  const dayIdx = function (d) { return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 86400000); };
  const holidaySet = {};
  data.holidays.forEach(function (h) { for (let d = new Date(h.start); d <= h.end; d.setDate(d.getDate() + 1)) holidaySet[Utilities.formatDate(d, tz, 'yyyy-MM-dd')] = h.title; });
  const values = [], bgs = [], fcs = [], notes = [];
  const blank = function (v) { const r = []; for (let c = 0; c < W; c++) r.push(v); return r; };
  const push = function (v, b, f, n) { values.push(v); bgs.push(b || blank(null)); fcs.push(f || blank(null)); notes.push(n || blank('')); };
  const t1 = blank(''); t1[C0] = '📊 간트차트 · 출력 ' + Utilities.formatDate(new Date(), tz, 'M/d HH:mm'); // V8.8: 짧게(오른쪽에 선택 칸)
  for (let k = 0; k < 3; k++) { t1[ganttFilterCol(k, false) - 1] = GANTT_FILTER_LABELS[k] + ' ▶'; t1[ganttFilterCol(k, true) - 1] = prevSel[k]; }
  t1[ganttFilterCol(2, true) - 1 + 5] = '※ 노란 칸에서 고르면 해당 시험만 진하게(비우거나 전체 = 모두)';
  push(t1);
  // 머리글: 주(월요일 날짜) / 날짜 / 요일
  const hw = blank(''), hd = blank(''), hy = blank(''), hb = blank('#e2e8f0'), hf = blank('#334155');
  hw[0] = '시험장비'; hw[1] = '호기';
  for (let i = 0; i < days; i++) {
    const d = new Date(start); d.setDate(d.getDate() + i);
    const c = C0 + i;
    if (d.getDay() === 1) hw[c] = (d.getMonth() + 1) + '/' + d.getDate() + ' 주';
    hd[c] = d.getDate() === 1 ? (d.getMonth() + 1) + '/1' : String(d.getDate());
    hy[c] = DOW[d.getDay()];
    const isHol = holidaySet[Utilities.formatDate(d, tz, 'yyyy-MM-dd')];
    if (isHol || d.getDay() === 0) { hb[c] = '#fecdd3'; hf[c] = '#be123c'; } else if (d.getDay() === 6) { hb[c] = '#dbeafe'; hf[c] = '#1d4ed8'; }
  }
  const dayBg = blank(null); // V8.4: 계획 칸 주말·공휴일 음영
  for (let i = 0; i < days; i++) { const d = new Date(start); d.setDate(d.getDate() + i); if (holidaySet[Utilities.formatDate(d, tz, 'yyyy-MM-dd')] || d.getDay() === 0) dayBg[C0 + i] = '#fff1f2'; else if (d.getDay() === 6) dayBg[C0 + i] = '#eff6ff'; }
  const hn = blank(''); for (let i = 0; i < days; i++) { const d = new Date(start); d.setDate(d.getDate() + i); const h = holidaySet[Utilities.formatDate(d, tz, 'yyyy-MM-dd')]; if (h) hn[C0 + i] = '🎌 ' + h; }
  push(hw, hb.slice(), hf.slice()); push(hd, hb.slice(), hf.slice(), hn); push(hy, hb.slice(), hf.slice());
  const HEAD = values.length; // 4
  const unitBlocks = [], nameBlocks = [], groupBottoms = [], gStartCells = [];
  EXPORT_EQUIPMENTS.forEach(function (eq) {
    const list = data.items.filter(function (o) { return o.eqId === eq[0] && o.end >= start && o.start <= end; })
      .sort(function (a, b) { return (a.start - b.start) || (b.dur - a.dur); });
    const laneEnd = [], lanePrev = [];
    list.forEach(function (o) {
      let lane = 0;
      while (lane < laneEnd.length && laneEnd[lane] >= o.start) lane++;
      laneEnd[lane] = o.end; o._glane = lane;
      lanePrev[lane] = assignTestColor(o, lanePrev[lane]); // V8.1
    });
    const lanes = Math.max(1, laneEnd.length);
    const startRow = values.length;
    for (let l = 0; l < lanes; l++) { const r = blank(''); r[0] = eq[1]; r[1] = eq[2]; push(r, dayBg.slice()); }
    list.forEach(function (o) {
      const st = exportItemStyle(o); // V8.1
      const row = startRow + o._glane, color = st[0], font = st[1];
      const a = Math.max(0, dayIdx(o.start)), b = Math.min(days - 1, dayIdx(o.end));
      gStartCells.push(sheetA1(row + 1, C0 + a + 1));
      const label = exportDelayPrefix(o) + (o.night ? '🌙 ' : '') + (o.virtual ? (o.half ? '💧½ ' : '💧 ') : '') + o.title;
      // V8.2: 막대 안 글자 없음 — 메모(전체 내용)를 막대 모든 칸에
      const note = (o.virtual ? label + '\n' : exportDelayPrefix(o)) + o.text + '\n(' + Utilities.formatDate(o.start, tz, 'M/d') + ' ~ ' + Utilities.formatDate(o.end, tz, 'M/d') + ', ' + o.dur + '일)';
      const vis = exportParseVIS(o.title) || { vehicle: '', item: '', spec: '' }; // V8.8: 숨은 글자(선택 판별용)
      const vv = [exportVisNorm(vis.vehicle), exportVisNorm(vis.item), exportVisNorm(vis.spec)];
      vv.forEach(function (x, k) { if (x) visOpts[k][x] = 1; });
      const key = '|V=' + vv[0] + '|I=' + vv[1] + '|S=' + vv[2] + '|';
      for (let i = a; i <= b; i++) { bgs[row][C0 + i] = color; fcs[row][C0 + i] = color; values[row][C0 + i] = key; }
      notes[row][C0 + a] = note; // V8.3: 메모는 첫 칸에만
    });
    unitBlocks.push([startRow + 1, lanes]);
    const ln = nameBlocks.length ? nameBlocks[nameBlocks.length - 1] : null;
    if (ln && ln.name === eq[1]) ln[1] += lanes; else { const nb = [startRow + 1, lanes]; nb.name = eq[1]; nameBlocks.push(nb); }
    groupBottoms.push(values.length);
  });
  // 시트 준비
  let target = ess.getSheetByName(GANTT_TAB); // V8.9: 실제 탭(마지막에 한 번에 붙여넣음)
  if (!target) {
    const cal = ess.getSheetByName(CAL_TAB);
    target = ess.insertSheet(GANTT_TAB, cal ? cal.getIndex() : 0);
  }
  const sh = stagingSheet(ess);
  try { sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).breakApart(); } catch (e) {}
  sh.clear();
  const R = values.length;
  if (sh.getMaxRows() < R) sh.insertRowsAfter(sh.getMaxRows(), R - sh.getMaxRows());
  if (sh.getMaxColumns() < W) sh.insertColumnsAfter(sh.getMaxColumns(), W - sh.getMaxColumns());
  if (sh.getMaxRows() > R + 5) sh.deleteRows(R + 6, sh.getMaxRows() - R - 5);
  if (sh.getMaxColumns() > W) sh.deleteColumns(W + 1, sh.getMaxColumns() - W);
  const all = sh.getRange(1, 1, R, W);
  all.setValues(values).setBackgrounds(bgs)
    .setFontColors(fcs.map(function (r) { return r.map(function (c) { return c || '#000000'; }); }))
    .setNotes(notes).setFontFamily(EXPORT_FONT).setFontSize(9).setVerticalAlignment('middle')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.OVERFLOW); // 제목이 막대 위로 이어져 보이게
  sh.getRange(1, C0 + 1).setFontSize(13).setFontWeight('bold');
  // V8.7: 📍 오늘로 이동(A1) · 날짜 머리글 오늘 주황(조건부 서식)
  const sY = start.getFullYear(), sM = start.getMonth() + 1, sD = start.getDate();
  const gToday = 'DATE(' + sY + ',' + sM + ',' + sD + ')';
  sh.getRange(1, 1, 1, 2).merge().setFormula('=IF(AND(TODAY()>=' + gToday + ',TODAY()-' + gToday + '<' + days + '),HYPERLINK("#gid=' + target.getSheetId()
    + '&range="&ADDRESS(3,' + (C0 + 1) + '+(TODAY()-' + gToday + '),4),"📍 오늘로 이동"),"")')
    .setFontWeight('bold').setFontColor('#b45309').setFontSize(10).setHorizontalAlignment('center');
  // V8.8: 차종·품목·사양 선택 칸 + 맞지 않는 막대 흐리게
  const selA1 = [0, 1, 2].map(function (k) { const a = sheetA1(1, ganttFilterCol(k, true)); return '$' + a.replace(/\d+$/, '') + '$1'; });
  const keyCell = sheetA1(HEAD + 1, C0 + 1);
  const field = ['V', 'I', 'S'];
  const miss = [0, 1, 2].map(function (k) {
    return 'AND(' + selA1[k] + '<>"",' + selA1[k] + '<>"전체",ISERROR(FIND("|' + field[k] + '="&UPPER(' + selA1[k] + ')&"|",' + keyCell + ')))';
  });
  const selOpen = [];
  for (let k = 0; k < 3; k++) {
    sh.getRange(1, ganttFilterCol(k, false), 1, 2).merge().setFontWeight('bold').setHorizontalAlignment('right').setFontSize(10);
    const vr = sh.getRange(1, ganttFilterCol(k, true), 1, 5).merge();
    vr.setBackground('#fef08a').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');
    const opts = ['전체'].concat(Object.keys(visOpts[k]).sort());
    if (prevSel[k] && opts.indexOf(prevSel[k]) === -1) opts.push(prevSel[k]);
    vr.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(opts.slice(0, 500), true).setAllowInvalid(true).build());
    selOpen.push(vr);
  }
  sh.getRange(1, ganttFilterCol(2, true) + 5).setFontColor('#64748b').setFontSize(9);
  const gRules = [SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=' + gToday + '+COLUMN(' + sheetA1(3, C0 + 1) + ')-' + (C0 + 1) + '=TODAY()')
    .setBackground('#f59e0b').setFontColor('#ffffff').setBold(true).setRanges([sh.getRange(3, C0 + 1, 2, days)]).build()];
  if (R > HEAD) {
    gRules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(' + keyCell + '<>"",OR(' + miss.join(',') + '))')
      .setBackground('#f1f5f9').setFontColor('#f1f5f9').setRanges([sh.getRange(HEAD + 1, C0 + 1, R - HEAD, days)]).build());
    sh.getRange(HEAD + 1, C0 + 1, R - HEAD, days).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP).setFontSize(6); // 숨은 글자 넘침 방지
  }
  sh.setConditionalFormatRules(gRules);
  sh.getRange(2, 1, 3, W).setFontWeight('bold').setHorizontalAlignment('center').setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sh.getRange(2, C0 + 1, 1, W - C0).setHorizontalAlignment('left');
  sh.getRange(HEAD + 1, 1, R - HEAD, 2).setFontWeight('bold').setHorizontalAlignment('center').setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sh.setFrozenRows(HEAD); sh.setFrozenColumns(C0);
  sh.setColumnWidth(1, 90); sh.setColumnWidth(2, 44);
  sh.setColumnWidths(C0 + 1, days, GANTT_DAY_WIDTH);
  if (R > HEAD) sh.setRowHeightsForced(HEAD + 1, R - HEAD, GANTT_ROW_HEIGHT);
  // 주 경계(월요일 앞) 세로선 · 장비 구분 가로선 · 오늘 열 빨간 테두리
  sh.getRange(2, 1, R - 1, W).setBorder(true, true, true, true, null, null, '#94a3b8', SpreadsheetApp.BorderStyle.SOLID);
  for (let i = 0; i < days; i++) {
    const d = new Date(start); d.setDate(d.getDate() + i);
    if (d.getDay() === 1) sh.getRange(2, C0 + 1 + i, R - 1, 1).setBorder(null, true, null, null, null, null, '#94a3b8', SpreadsheetApp.BorderStyle.SOLID);
  }
  groupBottoms.forEach(function (rb) { sh.getRange(rb, 1, 1, W).setBorder(null, null, true, null, null, null, '#475569', SpreadsheetApp.BorderStyle.SOLID_MEDIUM); });
  drawStartLines(sh, gStartCells); // V8.1
  const ti = dayIdx(today);
  if (ti >= 0 && ti < days) sh.getRange(2, C0 + 1 + ti, R - 1, 1).setBorder(null, true, null, true, null, null, '#dc2626', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  // 병합: 장비명·호기·주 머리글
  nameBlocks.forEach(function (b) { if (b[1] > 1) sh.getRange(b[0], 1, b[1], 1).merge(); });
  unitBlocks.forEach(function (b) { if (b[1] > 1) sh.getRange(b[0], 2, b[1], 1).merge(); });
  for (let i = 0; i < days; i++) {
    const d = new Date(start); d.setDate(d.getDate() + i);
    if (d.getDay() === 1) sh.getRange(2, C0 + 1 + i, 1, Math.min(7, days - i)).merge();
  }
  sh.getRange(2, 1, 3, 1).merge(); sh.getRange(2, 2, 3, 1).merge();
  // 맨 앞쪽(캘린더 바로 뒤)으로
  const cal = ess.getSheetByName(CAL_TAB);
  const want = cal ? cal.getIndex() + 1 : 1;
  const selDv = selOpen.map(function (r) { return r.getDataValidation(); });
  commitStaged(sh, target, R, W, function (t) { // V8.9
    if (R > HEAD) t.setRowHeightsForced(HEAD + 1, R - HEAD, GANTT_ROW_HEIGHT);
    selOpen.forEach(function (r, i) { if (selDv[i]) t.getRange(r.getA1Notation()).setDataValidation(selDv[i]); });
  });
  if (target.getIndex() !== want) { ess.setActiveSheet(target); ess.moveActiveSheet(want); }
  protectExportSheet(target, remapRanges(target, selOpen)); // V8.8: 선택 칸만 열어 둠
}

// ---------------- V6.3: 📅 장비별 캘린더 ----------------
const CAL_TAB = '📅 장비별 캘린더', CAL_DATA_TAB = '_캘린더데이터';
function renderCalendarTab(ess, data, months, ctx) {
  const tz = Session.getScriptTimeZone();
  try { ess.setSpreadsheetTimeZone(tz); } catch (e) {}
  const eqName = {}; EXPORT_EQUIPMENTS.forEach(function (e) { eqName[e[0]] = e[1] + ' ' + e[2]; });
  // ① 숨김 데이터 탭: 시작일 | 종료일 | 장비('*'=휴일·이벤트, 모든 장비에 표시) | 표시글
  const rows = [];
  data.items.forEach(function (o) {
    const nm = eqName[o.eqId]; if (!nm) return;
    const label = o.virtual ? (o.half ? '💧½ ' : '💧 ') + o.title : exportDelayPrefix(o) + (o.night ? '🌙 ' : '') + o.title; // V7.2
    rows.push([o.start, o.end, nm, label]);
  });
  // V6.4: 현장 기록(그 날짜에 한 줄: 아이콘+값+제목)
  const liveIds = {}; data.items.forEach(function (o) { if (!o.virtual) liveIds[o.id] = o; });
  if (ctx) Object.keys(ctx.records).forEach(function (k) {
    const r = ctx.records[k]; if (!r || !r.eq || !r.date) return;
    const o = liveIds[r.id]; // 미반영(일정 이동·삭제 / 일정 없는 칸) 기록은 캘린더에 표시하지 않음
    if (!o || Utilities.formatDate(o.start, tz, 'yyyy-MM-dd') > r.date || Utilities.formatDate(o.end, tz, 'yyyy-MM-dd') < r.date) return;
    const d = ymdToDate(r.date); if (!d) return;
    const st = FIELD_STYLE[r.value] || { icon: '•' };
    rows.push([d, d, r.eq, '  ' + st.icon + r.value + ' · ' + r.title]);
  });
  data.holidays.forEach(function (o) { rows.push([o.start, o.end, '*', '🎌 ' + o.title]); });
  data.events.forEach(function (o) { rows.push([o.start, o.end, '*', '📌 ' + o.title]); }); // V7.9: 다시 표시
  rows.sort(function (a, b) { return (a[2] === '*' ? 0 : 1) - (b[2] === '*' ? 0 : 1) || (a[0] - b[0]) || (String(a[3]).indexOf('  ') === 0 ? 1 : 0) - (String(b[3]).indexOf('  ') === 0 ? 1 : 0); });
  let ds = ess.getSheetByName(CAL_DATA_TAB);
  if (!ds) ds = ess.insertSheet(CAL_DATA_TAB);
  ds.clear();
  const all = [['시작일', '종료일', '장비', '표시']].concat(rows);
  if (ds.getMaxRows() < all.length) ds.insertRowsAfter(ds.getMaxRows(), all.length - ds.getMaxRows());
  ds.getRange(1, 1, all.length, 4).setValues(all);
  if (rows.length) ds.getRange(2, 1, rows.length, 2).setNumberFormat('yyyy-mm-dd');
  protectExportSheet(ds);
  try { ds.hideSheet(); } catch (e) {}

  // ② 캘린더 탭(처음 한 번 만들고, 이후엔 드롭다운 목록만 갱신 — 고른 값 유지)
  let sh = ess.getSheetByName(CAL_TAB);
  const isNew = !sh;
  if (!sh) sh = ess.insertSheet(CAL_TAB, 0);
  if (isNew) buildCalendarLayout(sh, monthKeyOf(new Date())); // 틀은 처음 한 번만(이후 고른 값 유지)
  const monthList = (months && months.length ? months : [monthKeyOf(new Date())]).slice();
  const curMonth = monthKeyOf(new Date());
  if (monthList.indexOf(curMonth) === -1) monthList.push(curMonth);
  monthList.sort();
  sh.getRange('B2').setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(EXPORT_EQUIPMENTS.map(function (e) { return e[1] + ' ' + e[2]; }), true).setAllowInvalid(false).build());
  sh.getRange('E2').setNumberFormat('@').setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(monthList, true).setAllowInvalid(false).build());
  try { // V8.7: 오늘 칸 노랑(조건부 서식, 맨 앞 우선순위) — 기존 탭에도 한 번 넣어 줌
    const cr = sh.getConditionalFormatRules().filter(function (r) {
      const bc = r.getBooleanCondition(); return !(bc && String(bc.getCriteriaValues()[0] || '').indexOf('TODAY()') > -1);
    });
    cr.unshift(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(A5<>"",$I$2+(ROW(A5)-5)*7+COLUMN(A5)-1=TODAY())')
      .setBackground('#fde68a').setBold(true).setRanges([sh.getRange(5, 1, 6, 7)]).build());
    sh.setConditionalFormatRules(cr);
  } catch (eCf) { Logger.log('캘린더 오늘 표시 실패: ' + eCf); }
  sh.getRange('A1').setValue('📅 장비별 캘린더 (웹앱 출력)   ·   최종 출력 ' + Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm'));
  // 맨 앞으로
  if (sh.getIndex() !== 1) { ess.setActiveSheet(sh); ess.moveActiveSheet(1); }
  // 보호: 고르는 칸(B2, E2)만 열어 둠
  try {
    let pr = sh.getProtections(SpreadsheetApp.ProtectionType.SHEET)[0];
    if (!pr) pr = sh.protect().setDescription('장비별 캘린더 — 노란 칸(B2·E2)만 선택 가능');
    pr.setUnprotectedRanges([sh.getRange('B2'), sh.getRange('E2')]);
    const me = Session.getEffectiveUser().getEmail();
    const others = pr.getEditors().filter(function (u) { return u.getEmail() !== me; });
    if (others.length) pr.removeEditors(others);
    if (pr.canDomainEdit()) pr.setDomainEdit(false);
  } catch (e) { Logger.log('캘린더 보호 실패: ' + e); }
}
function buildCalendarLayout(sh, curMonth) {
  const D = "'" + CAL_DATA_TAB + "'";
  sh.clear();
  if (sh.getMaxColumns() < 9) sh.insertColumnsAfter(sh.getMaxColumns(), 9 - sh.getMaxColumns());
  if (sh.getMaxRows() < 12) sh.insertRowsAfter(sh.getMaxRows(), 12 - sh.getMaxRows());
  sh.getRange('A2').setValue('시험장비 ▶');
  sh.getRange('B2').setValue('배광 1호');
  sh.getRange('D2').setValue('월 ▶');
  sh.getRange('E2').setNumberFormat('@').setValue(curMonth); // 글자로(날짜로 바뀌지 않게)
  sh.getRange('F2').setValue('※ 노란 칸에서 장비와 월을 고르세요(같은 시트를 여럿이 보면 마지막에 고른 값으로 함께 바뀝니다)');
  // 계산용(I열, 숨김): I1 = 그 달 1일, I2 = 달력 첫 칸(일요일)
  sh.getRange('I1').setFormula('=DATEVALUE($E$2&"-01")');
  sh.getRange('I2').setFormula('=$I$1-WEEKDAY($I$1,1)+1');
  sh.getRange('A3').setFormula('=$B$2&"  ·  "&TEXT($I$1,"yyyy년 m월")');
  const dows = ['일', '월', '화', '수', '목', '금', '토'];
  sh.getRange(4, 1, 1, 7).setValues([dows]);
  const f = [];
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let c = 0; c < 7; c++) {
      const k = w * 7 + c;
      const d = '($I$2+' + k + ')'; // 실제 구글 시트에서 검증한 형태(닫힌 범위 2~10000행)
      const R = function (c) { return D + '!$' + c + '$2:$' + c + '$10000'; };
      row.push('=IF(MONTH(' + d + ')<>MONTH($I$1),"",DAY(' + d + ')&IFERROR(CHAR(10)&TEXTJOIN(CHAR(10),TRUE,FILTER(' + R('D') + ','
        + R('A') + '<=' + d + ',' + R('B') + '>=' + d + ',((' + R('C') + '=$B$2)+(' + R('C') + '="*"))>0)),""))');
    }
    f.push(row);
  }
  const grid = sh.getRange(5, 1, 6, 7);
  grid.setFormulas(f).setVerticalAlignment('top').setWrap(true).setFontSize(9);
  sh.getRange(1, 1, 12, 9).setFontFamily(EXPORT_FONT);
  sh.getRange('A1').setFontSize(14).setFontWeight('bold');
  sh.getRange('A3').setFontSize(12).setFontWeight('bold');
  sh.getRange('A2:F2').setFontWeight('bold');
  sh.getRange('B2').setBackground('#fef08a'); sh.getRange('E2').setBackground('#fef08a');
  sh.getRange('F2').setFontColor('#64748b').setFontWeight('normal');
  const head = sh.getRange(4, 1, 1, 7);
  head.setBackground('#e2e8f0').setFontWeight('bold').setHorizontalAlignment('center');
  sh.getRange('A4').setFontColor('#e11d48'); sh.getRange('G4').setFontColor('#2563eb');
  for (let c = 1; c <= 7; c++) sh.setColumnWidth(c, 190);
  sh.setRowHeightsForced(5, 6, 130);
  grid.setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
  sh.hideColumns(9);
  sh.setFrozenRows(4);
  // 조건부 서식: 달 밖 칸 회색 · 휴일 장미색 · 일요일 날짜 빨강
  const rules = [
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=A5=""').setBackground('#f1f5f9').setRanges([grid]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=REGEXMATCH(A5,"🎌")').setBackground('#ffe4e6').setRanges([grid]).build()
  ];
  sh.setConditionalFormatRules(rules);
}

// V6.2: 출력 탭 보호(나만 편집) — 스크립트를 실행하는 소유자만 편집 가능
function protectExportSheet(sh, openRanges) {
  try {
    let pr = sh.getProtections(SpreadsheetApp.ProtectionType.SHEET)[0];
    if (!pr) pr = sh.protect().setDescription('웹앱 출력 탭 — 자동 생성(직접 수정 불가)');
    pr.setUnprotectedRanges(openRanges || []); // V6.4
    const me = Session.getEffectiveUser().getEmail();
    const others = pr.getEditors().filter(function (u) { return u.getEmail() !== me; });
    if (others.length) pr.removeEditors(others);
    if (pr.canDomainEdit()) pr.setDomainEdit(false);
  } catch (e) { Logger.log('보호 설정 실패(' + sh.getName() + '): ' + e); }
}

function renderListTab(ess, data, ctx) {
  const tz = Session.getScriptTimeZone();
  let sh = ess.getSheetByName('전체목록');
  if (!sh) sh = ess.insertSheet('전체목록', 0);
  const eqName = {};
  EXPORT_EQUIPMENTS.forEach(function (e) { eqName[e[0]] = e[1] + ' ' + e[2]; });
  const rows = data.items.filter(function (o) { return !o.virtual; }).concat(data.holidays, data.events) // V6.0: 방치 표시는 목록 제외
    .sort(function (a, b) { return (a.start - b.start) || a.eqId.localeCompare(b.eqId); })
    .map(function (o) {
      return [Utilities.formatDate(o.start, tz, 'yyyy-MM-dd'), Utilities.formatDate(o.end, tz, 'yyyy-MM-dd'), o.dur,
        o.eqId === 'holiday' ? '휴일' : o.eqId === 'event' ? '이벤트' : (eqName[o.eqId] || o.eqId),
        (o.seq ? o.seq + ' ' : '') + o.title, o.owner, dedupeLeadingTitle(o.title + '\n' + o.desc).split('\n').slice(1).join('\n'), fieldSummary(ctx, o.id), o.night ? '야간' : '', o.prot ? '보호' : '',
        o.src === 'master' ? '원본 이관' : '웹앱 등록', o.id];
    });
  const header = ['시작일', '종료일', '기간(일)', '장비', '제목', '담당자', '상세내용', '현장기록', '주/야간', '보호', '구분', 'id'];
  if (sh.getFilter()) sh.getFilter().remove();
  sh.clear();
  const R = rows.length + 1, W = header.length;
  if (sh.getMaxRows() < R) sh.insertRowsAfter(sh.getMaxRows(), R - sh.getMaxRows());
  if (sh.getMaxColumns() < W) sh.insertColumnsAfter(sh.getMaxColumns(), W - sh.getMaxColumns());
  sh.getRange(1, 1, R, W).setValues([header].concat(rows)).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP).setFontSize(9).setFontFamily(EXPORT_FONT);
  sh.getRange(1, 1, 1, W).setFontWeight('bold').setBackground('#e2e8f0');
  sh.setFrozenRows(1);
  sh.getRange(1, 1, R, W).createFilter();
  protectExportSheet(sh); // V6.2
  [90, 90, 55, 90, 260, 70, 260, 70, 55, 45, 75, 120].forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });
}

// 표시된 달만 다시 그림(시간 예산 안에서). 다 못 그린 달은 다음 회차에
function exportDirty(deadline) {
  const p = props();
  let dirty = {}; try { dirty = JSON.parse(p.getProperty(PROP_EXPORT_DIRTY) || '{}'); } catch (e) {}
  let keys = Object.keys(dirty);
  if (!keys.length) return 0;
  const ess = exportSpreadsheet(false);
  if (!ess) return 0;
  const data0 = collectExportData();
  const allowed = exportMonthRange(data0);
  const allowedSet = {}; allowed.forEach(function (k) { allowedSet[k] = 1; });
  if (dirty.ALL) {
    const all = allowed;
    removeOutOfRangeTabs(ess, allowedSet); // V5.5: 범위 밖 월별 탭 정리
    delete dirty.ALL;
    all.forEach(function (k) { if (!dirty[k]) dirty[k] = Date.now(); });
    dirty.LIST = Date.now();
    p.setProperty(PROP_EXPORT_DIRTY, JSON.stringify(dirty));
    keys = Object.keys(dirty);
  }
  const startedAt = Date.now();
  const data = data0;
  const doneKeys = [];
  const nowKey = monthKeyOf(new Date());
  const months = keys.filter(function (k) { return /^\d{4}-\d{2}$/.test(k) && allowedSet[k]; })
    .sort(function (a, b) { // V5.5: 이번 달 → 다음 달들(가까운 순) → 지난 달들(가까운 순)
      const fa = a >= nowKey, fb = b >= nowKey;
      if (fa !== fb) return fa ? -1 : 1;
      return fa ? (a < b ? -1 : 1) : (a > b ? -1 : 1);
    });
  const recheckDone = {}; // V5.8
  let recheck = {}; try { recheck = JSON.parse(p.getProperty(PROP_EXPORT_RECHECK) || '{}'); } catch (e) {}
  const ctx = loadFieldCtx(ess); // V6.4: 현장 기록
  for (let i = 0; i < months.length; i++) {
    if (Date.now() > deadline) break;
    const mk = months[i], tabName = +mk.substring(0, 4) + '년 ' + (+mk.substring(5, 7)) + '월';
    harvestFieldTab(ess, tabName, ctx); // 다시 그리기 직전에 현장 입력값 보관
    ctx.renderedTabs[tabName] = 1;
    renderMonthTab(ess, mk, data, ctx);
    saveFieldCtx(ess, ctx); // 탭마다 바로 저장(중간에 멈춰도 위치표가 어긋나지 않게)
    doneKeys.push(months[i]);
    if (!isLocalMode() && !dirty.__recheck) recheck[months[i]] = Date.now() + EXPORT_RECHECK_MS; // 2분 뒤 한 번 더
  }
  if (!isLocalMode() && !dirty.__recheck) p.setProperty(PROP_EXPORT_RECHECK, JSON.stringify(recheck));
  keys.forEach(function (k) { if (!/^\d{4}-\d{2}$/.test(k) && k !== 'LIST') doneKeys.push(k); }); // 알 수 없는 키 정리(__recheck 포함)
  keys.forEach(function (k) { if (/^\d{4}-\d{2}$/.test(k) && !allowedSet[k]) doneKeys.push(k); }); // 범위 밖 달은 그리지 않고 정리
  saveFieldCtx(ess, ctx); // V6.4
  try { writeTabIndex(ess); } catch (eTi) { Logger.log('탭목록 갱신 실패: ' + eTi); } // V8.7
  if (dirty.LIST && Date.now() < deadline + 30000) {
    renderListTab(ess, data, ctx);
    try { renderCalendarTab(ess, data, allowed, ctx); } catch (eCal) { Logger.log('캘린더 탭 갱신 실패: ' + eCal); } // V6.3
    try { renderGanttTab(ess, data); } catch (eG) { Logger.log('간트차트 탭 갱신 실패: ' + eG); } // V8.0
    try { renderUnplacedTab(ess, data, ctx); } catch (eUn) { Logger.log('미반영 기록 탭 갱신 실패: ' + eUn); } // V6.4
    doneKeys.push('LIST');
  }
  const def = ess.getSheetByName('Sheet1') || ess.getSheetByName('시트1');
  if (def && ess.getSheets().length > 1) { try { ess.deleteSheet(def); } catch (e) {} }
  // 그리는 동안 새로 표시된 달은 남김(표시 시각이 시작 시각 이후)
  const lock = LockService.getScriptLock();
  const locked = lock.tryLock(5000);
  try {
    let cur = {}; try { cur = JSON.parse(p.getProperty(PROP_EXPORT_DIRTY) || '{}'); } catch (e) {}
    doneKeys.forEach(function (k) { if (cur[k] && cur[k] <= startedAt) delete cur[k]; });
    p.setProperty(PROP_EXPORT_DIRTY, JSON.stringify(cur));
    p.setProperty(PROP_EXPORT_LAST, new Date().toISOString());
  } finally { if (locked) lock.releaseLock(); }
  return doneKeys.length;
}
// V5.5: 시험 일정(장비 일정)이 있는 달만 — 휴일·이벤트·근태는 몇 년 치가 미리 등록돼 있어 범위 계산에서 제외. 최대 오늘+24개월
function exportMonthRange(data) {
  data = data || collectExportData();
  const now = new Date();
  const maxKey = monthKeyOf(new Date(now.getFullYear(), now.getMonth() + 24, 1));
  let min = null, max = null;
  data.items.forEach(function (o) {
    if (!min || o.start < min) min = o.start;
    if (!max || o.end > max) max = o.end;
  });
  const out = [];
  if (!min) return out;
  const c = new Date(min.getFullYear(), min.getMonth(), 1);
  while (c <= max) { const k = monthKeyOf(c); if (k >= EXPORT_FIRST_MONTH && k <= maxKey) out.push(k); c.setMonth(c.getMonth() + 1); }
  return out;
}
function removeOutOfRangeTabs(ess, allowedSet) {
  ess.getSheets().forEach(function (sh) {
    const m = sh.getName().match(/^(\d{4})년 (\d{1,2})월$/);
    if (!m) return;
    const k = m[1] + '-' + ('0' + m[2]).slice(-2);
    if (!allowedSet[k] && ess.getSheets().length > 1) { try { ess.deleteSheet(sh); } catch (e) {} }
  });
}
// V7.0: 지금 바로 출력(전체 다시 그리기 예약 + 약 45초 동안 이번 달부터 그림, 나머지는 트리거)
function handleExportRunNow(body) {
  const p = props();
  if (!p.getProperty(PROP_EXPORT_ID)) return { status: 'fail', message: '출력 시트가 아직 없습니다. 편집기에서 setupExportOnly를 먼저 실행해주세요.' };
  addExportDirty(['ALL']);
  const running = parseInt(p.getProperty(PROP_BG_RUNNING) || '0', 10);
  if (running && Date.now() - running < 6 * 60000) {
    return { status: 'success', queued: true, done: 0, remaining: -1, message: '다른 출력이 진행 중이라 예약했습니다 — 1~3분 안에 반영됩니다.' };
  }
  p.setProperty(PROP_BG_RUNNING, String(Date.now()));
  let done = 0;
  try { done = exportDirty(Date.now() + 45000); }
  finally { p.deleteProperty(PROP_BG_RUNNING); }
  let remaining = 0;
  try { const d = JSON.parse(p.getProperty(PROP_EXPORT_DIRTY) || '{}'); remaining = Object.keys(d).filter(function (k) { return /^\d{4}-\d{2}$/.test(k); }).length; } catch (e) {}
  return { status: 'success', done: done, remaining: remaining, lastExportAt: p.getProperty(PROP_EXPORT_LAST) || '',
    message: remaining ? ('이번 달부터 출력 완료 — 남은 ' + remaining + '개월은 1~3분 안에 이어서 반영됩니다.') : '출력 시트 전체를 최신으로 갱신했습니다.' };
}
function handleExportNow(body) {
  if (!props().getProperty(PROP_EXPORT_ID)) return { status: 'fail', message: '출력 시트가 아직 없습니다. 편집기에서 setupV53을 먼저 실행해주세요.' };
  addExportDirty(body && body.all ? ['ALL'] : (function () {
    const now = new Date(), ks = ['LIST'];
    for (let k = -1; k <= 3; k++) ks.push(monthKeyOf(new Date(now.getFullYear(), now.getMonth() + k, 1)));
    return ks;
  })());
  return { status: 'success', message: '출력 예약 완료 — 1분 안에 출력 시트가 갱신됩니다.' };
}

// ---------------- 트리거 ----------------
function bgTick() { // 1분마다: ① 원본 반영 대기열 ② 출력 시트 갱신
  const p = props();
  promoteDueRechecks(p); // V5.8
  const dirtyText = p.getProperty(PROP_EXPORT_DIRTY) || '{}';
  const hasMirror = isLocalMode() && !isDisconnected() && p.getProperty(PROP_MIRROR_FLAG) === '1'; // V7.5: 차단 시 미러 안 함
  const hr = new Date().getHours();
  const harvestDue = !!p.getProperty(PROP_EXPORT_ID) && hr >= 6 && hr < 22 // V6.4: 06~22시에만(실행시간 할당량 절약)
    && Date.now() - parseInt(p.getProperty(PROP_FIELD_HARVEST) || '0', 10) > 5 * 60000;
  if (!hasMirror && !harvestDue && (dirtyText === '{}' || dirtyText === '')) return; // 할 일 없음 → 즉시 종료
  const running = parseInt(p.getProperty(PROP_BG_RUNNING) || '0', 10);
  if (running && Date.now() - running < 6 * 60000) return; // 이전 회차가 아직 도는 중
  p.setProperty(PROP_BG_RUNNING, String(Date.now()));
  try {
    const deadline = Date.now() + 4 * 60000;
    if (harvestDue) { // V6.4: 5분마다 현장 기록 수집(다른 회차와 겹치지 않게 실행 표시를 잡은 뒤)
      p.setProperty(PROP_FIELD_HARVEST, String(Date.now()));
      try { harvestRecentField(); } catch (eH) { Logger.log('현장 기록 수집 실패: ' + eH); }
    }
    if (hasMirror) processMirrorQueue(Date.now() + 2.5 * 60000);
    exportDirty(deadline);
  } finally { p.deleteProperty(PROP_BG_RUNNING); }
}
// V5.8: 다시 그릴 시각이 된 달을 '다시 그릴 달'로 옮김(이때 그린 달은 또 예약하지 않음 → 한 번만)
function promoteDueRechecks(p) {
  const text = p.getProperty(PROP_EXPORT_RECHECK);
  if (!text || text === '{}') return;
  let rc = {}; try { rc = JSON.parse(text); } catch (e) { p.deleteProperty(PROP_EXPORT_RECHECK); return; }
  const now = Date.now(), due = [];
  Object.keys(rc).forEach(function (k) { if (rc[k] <= now) { due.push(k); delete rc[k]; } });
  if (!due.length) return;
  p.setProperty(PROP_EXPORT_RECHECK, JSON.stringify(rc));
  let d = {}; try { d = JSON.parse(p.getProperty(PROP_EXPORT_DIRTY) || '{}'); } catch (e) {}
  const onlyRecheck = !Object.keys(d).length;
  due.forEach(function (k) { if (!d[k]) d[k] = now; });
  if (onlyRecheck) d.__recheck = now; // 재확인만 하는 회차 표시
  p.setProperty(PROP_EXPORT_DIRTY, JSON.stringify(d));
}
function nightlyFullExport() { // 매일 03시: 전체 다시 출력 + 처리 끝난 대기열 정리(7일 경과)
  addExportDirty(['ALL']);
  try { cleanupMirrorQueue(7); } catch (e) {}
  bgTick();
}
function installV53Triggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    const h = t.getHandlerFunction();
    if (h === 'bgTick' || h === 'nightlyFullExport') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('bgTick').timeBased().everyMinutes(1).create();
  ScriptApp.newTrigger('nightlyFullExport').timeBased().atHour(3).everyDays(1).create();
}

// ---------------- 설치 / 되돌리기 (편집기에서 직접 실행) ----------------
function setupV53() {
  const ss = getSS();
  let local = ss.getSheetByName(LOCAL_MASTER_SHEET);
  if (!local || local.getLastRow() < 3) {
    // ① 원본 '시험계획누적'을 행 번호 그대로 복사(매크로 재집계 중이면 잠시 기다렸다 재시도)
    let data = null;
    for (let attempt = 0; attempt < 4; attempt++) {
      const src = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME);
      data = src.getDataRange().getValues();
      if (data.length > 50) break;
      Utilities.sleep(15000);
    }
    if (!data || data.length <= 50) throw new Error("원본 '시험계획누적'이 비어 있습니다(매크로 재집계 중일 수 있음). 1~2분 뒤 다시 실행해주세요.");
    if (!local) local = ss.insertSheet(LOCAL_MASTER_SHEET);
    local.clear();
    const W = Math.min(10, data[0].length);
    const grid = data.map(function (r) { return r.slice(0, W); });
    if (local.getMaxRows() < grid.length) local.insertRowsAfter(local.getMaxRows(), grid.length - local.getMaxRows());
    local.getRange(1, 1, grid.length, W).setValues(grid);
    local.getRange(1, 1).setValue('V5.3 이관: ' + new Date().toISOString() + ' — 이 탭이 웹앱의 원본입니다. 행을 지우거나 끼워넣지 마세요(행 번호 = 일정 id).');
    Logger.log('원본 이관 완료: ' + (grid.length - 2) + '행');
  } else {
    Logger.log("'" + LOCAL_MASTER_SHEET + "' 탭이 이미 있어 복사는 건너뜀(다시 이관하려면 탭 이름을 바꾸거나 지운 뒤 실행)");
  }
  props().setProperty(PROP_MODE, 'local');
  LOCAL_MODE_CACHE = true;
  invalidateMasterFastCache();
  queueSheet();
  const ess = exportSpreadsheet(true);
  Logger.log('출력 시트: ' + ess.getUrl());
  installV53Triggers();
  addExportDirty(['ALL']);
  exportDirty(Date.now() + 4 * 60000); // 남은 달은 1분 트리거가 이어서 그림
  Logger.log('✅ V5.3 전환 완료. 웹앱을 새로고침하세요.');
}
// V5.4: 원본 연동은 그대로 두고 출력 시트만 추가(비교 운영용). 여러 번 실행해도 안전.
function setupExportOnly() {
  if (isLocalMode()) Logger.log('※ 이미 로컬 모드(setupV53 실행됨)입니다. 원본 직접 연동으로 돌아가려면 rollbackToOriginalMode를 실행하세요.');
  const ess = exportSpreadsheet(true);
  Logger.log('출력 시트: ' + ess.getUrl());
  installV53Triggers();
  addExportDirty(['ALL']);
  exportDirty(Date.now() + 4 * 60000); // 남은 달은 1분 트리거가 이어서 그림
  Logger.log('✅ 출력 시트 추가 완료(원본 연동은 그대로). 웹앱을 새로고침하세요.');
}
function rollbackToOriginalMode() {
  props().setProperty(PROP_MODE, 'original');
  props().deleteProperty(PROP_DISCONNECTED); // V7.5
  LOCAL_MODE_CACHE = false; DISCONNECTED_CACHE = false;
  invalidateMasterFastCache();
  Logger.log('V5.2 방식(원본 직접 연동)으로 되돌렸습니다. OriginalQueue에 남은 대기 작업은 bgTick이 계속 처리하지 않으니 시트에서 확인하세요.');
}
// ---------------- V7.5: 원본 시험계획표와 완전 차단 ----------------
// 편집기에서 1회 실행. 여러 번 실행해도 안전(이미 이관돼 있으면 복사는 건너뜀).
function disconnectOriginal() {
  const p = props();
  const startedAt = Date.now(); // V7.6: 편집기 실행 6분 제한 안에 끝나도록 시간 계산
  // V7.6: 트리거 출력이 끝날 때까지 기다림(최대 3분)
  const waitUntil = Date.now() + 3 * 60000;
  while (true) {
    const running = parseInt(p.getProperty(PROP_BG_RUNNING) || '0', 10);
    if (!running || Date.now() - running >= 6 * 60000) break; // 진행 중 아님 / 오래된 표시(비정상 종료)
    if (Date.now() > waitUntil) throw new Error('출력 작업이 3분 넘게 끝나지 않습니다. 잠시 뒤 다시 실행해주세요.');
    Logger.log('출력 작업이 끝나길 기다리는 중...');
    Utilities.sleep(10000);
  }
  p.setProperty(PROP_BG_RUNNING, String(Date.now())); // 이관하는 동안 트리거가 끼어들지 않게
  try {
    // ① 1회 이관(원본 '시험계획누적' → '원본일정(웹앱)', 행 번호 그대로)
    const ss = getSS();
    let local = ss.getSheetByName(LOCAL_MASTER_SHEET);
    if (!local || local.getLastRow() < 3) {
      let data = null;
      for (let attempt = 0; attempt < 4; attempt++) {
        data = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME).getDataRange().getValues();
        if (data.length > 50) break;
        Utilities.sleep(15000);
      }
      if (!data || data.length <= 50) throw new Error("원본 '시험계획누적'이 비어 있습니다(매크로 재집계 중일 수 있음). 1~2분 뒤 다시 실행해주세요.");
      if (!local) local = ss.insertSheet(LOCAL_MASTER_SHEET);
      local.clear();
      const W = Math.min(10, data[0].length);
      const grid = data.map(function (r) { return r.slice(0, W); });
      if (local.getMaxRows() < grid.length) local.insertRowsAfter(local.getMaxRows(), grid.length - local.getMaxRows());
      local.getRange(1, 1, grid.length, W).setValues(grid);
      local.getRange(1, 1).setValue('V7.5 이관: ' + new Date().toISOString() + ' — 이 탭이 웹앱의 원본입니다. 행을 지우거나 끼워넣지 마세요(행 번호 = 일정 id).');
      Logger.log('① 원본 이관 완료: ' + (grid.length - 2) + '행');
    } else Logger.log("① '" + LOCAL_MASTER_SHEET + "' 탭이 이미 있어 복사는 건너뜀");
    // ② 차단
    p.setProperty(PROP_MODE, 'local');
    p.setProperty(PROP_DISCONNECTED, '1');
    p.deleteProperty(PROP_MIRROR_FLAG);
    LOCAL_MODE_CACHE = true; DISCONNECTED_CACHE = true;
    invalidateMasterFastCache();
    Logger.log('② 원본 시험계획표 연결 차단(읽기·쓰기 모두 안 함)');
    // ③ 출력 시트 현장 기록 id 보정
    const ess = exportSpreadsheet(false);
    if (ess) {
      const n = remapFieldRecordsToLocal(ess);
      Logger.log('③ 현장 기록 id 보정: ' + n + '건');
    }
  } finally { p.deleteProperty(PROP_BG_RUNNING); }
  // ④ 전체 다시 출력(남은 시간만큼, 남은 달은 1분 트리거가 이어서)
  p.setProperty(PROP_BG_RUNNING, String(Date.now()));
  try { addExportDirty(['ALL']); exportDirty(Math.max(startedAt + 5 * 60000, Date.now() + 20000)); }
  finally { p.deleteProperty(PROP_BG_RUNNING); }
  Logger.log('✅ 완료 — 웹앱을 새로고침하세요. 이제 웹앱이 유일한 원본입니다.');
}
// 이관 때 🔒 일정 id(행 번호)가 마지막 출력 때와 달라졌을 수 있어, [장비·제목·날짜]로 다시 찾아 id를 맞춤
function remapFieldRecordsToLocal(ess) {
  const tz = Session.getScriptTimeZone();
  const eqName = {}; EXPORT_EQUIPMENTS.forEach(function (e) { eqName[e[0]] = e[1] + ' ' + e[2]; });
  const masters = readLocalMaster();
  const byId = {}, byEqTitle = {};
  masters.forEach(function (m) {
    const st = Utilities.formatDate(new Date(m.startDate), tz, 'yyyy-MM-dd');
    const en = (function () { const d = ymdToDate(m.startDate); d.setDate(d.getDate() + (parseInt(m.duration) || 1) - 1); return Utilities.formatDate(d, tz, 'yyyy-MM-dd'); })();
    const o = { id: m.id, eq: eqName[m.eqId] || '', title: String(m.title || '').trim(), st: m.startDate, en: en };
    byId[m.id] = o;
    const k = o.eq + '|' + o.title;
    (byEqTitle[k] = byEqTitle[k] || []).push(o);
  });
  const fits = function (o, eq, title, date) { return o && o.eq === eq && o.title === String(title || '').trim() && o.st <= date && o.en >= date; };
  const findNew = function (oldId, eq, title, date) {
    if (fits(byId[oldId], eq, title, date)) return oldId;
    const c = (byEqTitle[eq + '|' + String(title || '').trim()] || []).filter(function (o) { return o.st <= date && o.en >= date; });
    return c.length === 1 ? c[0].id : null;
  };
  const ctx = loadFieldCtx(ess);
  let changed = 0;
  const rec2 = {};
  Object.keys(ctx.records).forEach(function (k) {
    const r = ctx.records[k];
    if (String(r.id).indexOf('master_') !== 0) { rec2[k] = r; return; }
    const nid = findNew(r.id, r.eq, r.title, r.date);
    if (nid && nid !== r.id) { r.id = nid; rec2[nid + '|' + r.date] = r; changed++; }
    else rec2[k] = r;
  });
  ctx.records = rec2;
  Object.keys(ctx.mapByTab).forEach(function (t) {
    ctx.mapByTab[t].forEach(function (m) {
      if (String(m[3]).indexOf('master_') !== 0) return;
      const nid = findNew(String(m[3]), String(m[5]), String(m[6]), String(m[4]));
      if (nid && nid !== String(m[3])) m[3] = nid;
    });
  });
  saveFieldCtx(ess, ctx);
  return changed;
}
function exportAllNow() { // V6.4: 트리거 회차와 겹치지 않게 실행 표시
  const p = props();
  p.setProperty(PROP_BG_RUNNING, String(Date.now()));
  try { addExportDirty(['ALL']); exportDirty(Date.now() + 5 * 60000); }
  finally { p.deleteProperty(PROP_BG_RUNNING); }
}
