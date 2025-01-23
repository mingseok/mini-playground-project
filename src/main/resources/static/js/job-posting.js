document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.grid-container');
    const cards = document.querySelectorAll('.job-card');

    // 크기 계산 함수 (초기 크기 및 증가 단위 조정)
    function calculateSize(views, baseWidth) {
        const minWidth = baseWidth / 16; // 초기 가로 크기 (기존 8 → 16, 크기 줄임)
        const maxWidth = baseWidth / 3; // 최대 가로 크기
        const step = Math.floor(views / 5); // 5단위 증가
        const width = Math.min(maxWidth, minWidth + step * (baseWidth / 40)); // 가로 크기 증가 단위 감소
        const height = width * 0.75; // 세로 크기
        return { width, height };
    }

    // 카드 배치 계산 함수 (중앙 배치 및 간격 확보)
    function calculateCenteredLayout(cards, containerWidth, containerHeight) {
        const layout = [];
        const gapX = 50; // 가로 간격 조정
        const gapY = 40; // 세로 간격 조정
        const rowWidthLimit = containerWidth - gapX; // 행 너비 한계
        let currentX = (containerWidth - rowWidthLimit) / 2; // 중앙 정렬 시작 X 좌표
        let currentY = (containerHeight / 2) - 150; // 중앙 정렬 시작 Y 좌표
        let rowHeight = 0;

        cards.forEach((card) => {
            const views = parseInt(card.getAttribute('data-views'), 10) || 0;
            const size = calculateSize(views, containerWidth);

            // 줄바꿈 처리
            if (currentX + size.width > rowWidthLimit) {
                currentX = (containerWidth - rowWidthLimit) / 2; // 다음 행 시작 X 좌표
                currentY += rowHeight + gapY; // 다음 행 Y 좌표
                rowHeight = 0;
            }

            layout.push({
                x: currentX,
                y: currentY,
                width: size.width,
                height: size.height,
            });

            currentX += size.width + gapX; // 다음 카드 X 좌표
            rowHeight = Math.max(rowHeight, size.height); // 행 높이 업데이트
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
        const initialLayout = calculateCenteredLayout(cards, containerWidth, containerHeight);
        applyLayout(initialLayout, cards);
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
                    // 조회수 및 data-views 업데이트
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
