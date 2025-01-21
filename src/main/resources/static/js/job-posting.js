document.addEventListener('DOMContentLoaded', () => {
    const baseWidth = 1024; // 기준 화면 너비

    // 크기 계산 함수
    function calculateSize(views, baseWidth) {
        const minSize = baseWidth / 32; // 최소 크기
        const maxSize = baseWidth / 4;  // 최대 크기
        const size = Math.min(maxSize, minSize * Math.pow(2, Math.log2(views)));
        return Math.max(minSize, size);
    }

    // 각 카드의 크기를 동적으로 설정
    document.querySelectorAll('.job-card').forEach(card => {
        const views = parseInt(card.getAttribute('data-views'), 10);
        const size = calculateSize(views, baseWidth);

        // 가로와 세로 크기 번갈아가며 증가
        const isWidthIncreased = views % 2 === 0;

        const gridColumnSpan = isWidthIncreased ? Math.ceil(size / (baseWidth / 32)) : 1;
        const gridRowSpan = isWidthIncreased ? 1 : Math.ceil(size / (baseWidth / 32));

        card.style.gridColumn = `span ${gridColumnSpan}`;
        card.style.gridRow = `span ${gridRowSpan}`;

        // 클릭 이벤트 리스너 추가
        card.addEventListener('click', () => {
            const jobId = card.getAttribute('data-id');
            increaseClickCount(jobId);
        });
    });

    // 클릭 수 증가 요청 함수
    function increaseClickCount(jobId) {
        fetch(`/api/job-postings/${jobId}/click`, {
            method: 'POST'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update click count');
                }
                return response.json();
            })
            .then(updatedJob => {
                const card = document.querySelector(`.job-card[data-id="${updatedJob.id}"]`);
                card.setAttribute('data-views', updatedJob.clickCount);
                card.querySelector('.view-count').textContent = `조회수: ${updatedJob.clickCount}`;

                // 크기 재계산 후 스타일 업데이트
                const newSize = calculateSize(updatedJob.clickCount, baseWidth);
                const isWidthIncreased = updatedJob.clickCount % 2 === 0;

                const gridColumnSpan = isWidthIncreased ? Math.ceil(newSize / (baseWidth / 32)) : 1;
                const gridRowSpan = isWidthIncreased ? 1 : Math.ceil(newSize / (baseWidth / 32));

                card.style.gridColumn = `span ${gridColumnSpan}`;
                card.style.gridRow = `span ${gridRowSpan}`;
            })
            .catch(error => console.error(error));
    }
});
