document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.grid-container');
    const cards = document.querySelectorAll('.job-card');

    // 크기 계산 함수 (조회수 기반)
    function calculateSize(views) {
        const baseWidth = 150; // 초기 가로 크기
        const baseHeight = baseWidth * 0.75; // 초기 세로 크기 (4:3 비율)
        const step = Math.floor(views / 5); // 5단위 증가
        const maxWidth = 300; // 최대 가로 크기
        const width = Math.min(maxWidth, baseWidth + step * 30); // 가로 크기 증가
        const height = width * 0.75; // 세로 크기
        return { width, height };
    }

    // 카드 배치 계산 함수 (겹침 방지 처리)
    function calculateGridLayout(cards, containerWidth, containerHeight) {
        const layout = [];
        const rows = 3; // Y축 행 수
        const cols = 5; // X축 열 수
        const baseGapX = 50; // 기본 가로 간격
        const baseGapY = 50; // 기본 세로 간격

        const rowHeights = new Array(rows).fill(0); // 각 행의 최대 높이
        const colWidths = new Array(cols).fill(0); // 각 열의 최대 너비

        // 초기 위치 계산 (카드 크기 반영 전)
        cards.forEach((card, index) => {
            const views = parseInt(card.getAttribute('data-views'), 10) || 0;
            const size = calculateSize(views);

            const row = Math.floor(index / cols); // 행 번호
            const col = index % cols; // 열 번호

            const prevRowHeight = row > 0 ? rowHeights.slice(0, row).reduce((sum, h) => sum + h, 0) : 0;
            const prevColWidth = col > 0 ? colWidths.slice(0, col).reduce((sum, w) => sum + w, 0) : 0;

            // 기존 카드와 겹치는 경우 간격 조정
            const gapX = col > 0 && size.width + baseGapX > colWidths[col - 1] ? size.width / 4 : baseGapX;
            const gapY = row > 0 && size.height + baseGapY > rowHeights[row - 1] ? size.height / 4 : baseGapY;

            layout.push({
                x: prevColWidth + gapX, // X 좌표
                y: prevRowHeight + gapY, // Y 좌표
                width: size.width,
                height: size.height,
            });

            rowHeights[row] = Math.max(rowHeights[row], size.height + gapY); // 행 높이 업데이트
            colWidths[col] = Math.max(colWidths[col], size.width + gapX); // 열 너비 업데이트
        });

        // 그리드 중앙 정렬
        const totalWidth = colWidths.reduce((sum, w) => sum + w, 0);
        const totalHeight = rowHeights.reduce((sum, h) => sum + h, 0);
        const offsetX = (containerWidth - totalWidth) / 2; // X축 중앙 기준
        const offsetY = (containerHeight - totalHeight) / 2; // Y축 중앙 기준

        layout.forEach(pos => {
            pos.x += offsetX;
            pos.y += offsetY;
        });

        return layout;
    }

    // 레이아웃 적용 함수
    function applyLayout(layout, cards) {
        layout.forEach((pos, index) => {
            const card = cards[index];
            card.style.width = `${pos.width}px`;
            card.style.height = `${pos.height}px`;
            card.style.position = "absolute";
            card.style.left = `${pos.x}px`;
            card.style.top = `${pos.y}px`;
        });
    }

    // 레이아웃 설정 함수
    function setLayout() {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const layout = calculateGridLayout(cards, containerWidth, containerHeight);
        applyLayout(layout, cards);
    }

    // 초기 레이아웃 설정
    setLayout();

    // 창 크기 변경 시 레이아웃 재설정
    window.addEventListener('resize', setLayout);

    // 클릭 수 증가 요청 함수
    function increaseClickCount(jobId) {
        fetch(`/api/job-postings/${jobId}/click`, {
            method: 'POST',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update click count');
                }
                return response.json();
            })
            .then((updatedJob) => {
                const card = document.querySelector(`.job-card[data-id="${updatedJob.id}"]`);
                if (card) {
                    // 조회수 업데이트
                    card.setAttribute('data-views', updatedJob.clickCount);
                    card.querySelector('.view-count').textContent = `조회수: ${updatedJob.clickCount}`;
                }

                // 레이아웃 재설정
                setLayout();
            })
            .catch((error) => console.error('Error updating click count:', error));
    }

    // 클릭 이벤트 리스너 추가
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const jobId = card.getAttribute('data-id');
            increaseClickCount(jobId);
        });
    });
});
