document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.grid-container');
    const cards = document.querySelectorAll('.job-card');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // 크기 계산 함수
    function calculateSize(views, baseWidth) {
        const minWidth = baseWidth / 8; // 초기 가로 크기 증가
        const minHeight = minWidth * 0.75; // 초기 세로 크기 (4:3 비율)
        const maxWidth = baseWidth / 2; // 최대 가로 크기
        const step = Math.floor(views / 5); // 5단위 증가
        const width = Math.min(maxWidth, minWidth + step * (baseWidth / 20)); // 가로 크기 증가
        const height = width * 0.75; // 세로 크기
        return { width, height };
    }

    // 카드 배치 계산 함수 (중앙 배치 및 간격 확보)
    function calculateCenteredLayout(cards, containerWidth, containerHeight) {
        const layout = [];
        const gapX = 100; // 가로 간격 증가
        const gapY = 80; // 세로 간격 증가
        const rowWidthLimit = containerWidth - gapX; // 행 너비 한계
        let currentX = (containerWidth - rowWidthLimit) / 2; // 중앙 정렬 시작 X 좌표
        let currentY = (containerHeight / 2) - 150; // 중앙 정렬 시작 Y 좌표
        let rowHeight = 0;

        cards.forEach((card, index) => {
            const views = parseInt(card.getAttribute('data-views'), 10);
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

    // 초기 레이아웃 설정
    const initialLayout = calculateCenteredLayout(cards, containerWidth, containerHeight);
    applyLayout(initialLayout, cards);

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
                card.setAttribute('data-views', updatedJob.clickCount);
                card.querySelector('.view-count').textContent = `조회수: ${updatedJob.clickCount}`;

                // 크기 재계산 후 전체 레이아웃 재배치
                const updatedLayout = calculateCenteredLayout(cards, containerWidth, containerHeight);
                applyLayout(updatedLayout, cards);
            })
            .catch((error) => console.error(error));
    }

    // 클릭 이벤트 리스너 추가
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const jobId = card.getAttribute('data-id');
            increaseClickCount(jobId);
        });
    });
});
