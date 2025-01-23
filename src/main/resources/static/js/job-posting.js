document.addEventListener('DOMContentLoaded', () => {
    const baseWidth = 1024; // 기준 화면 너비

    // 크기 계산 함수 (5, 10, 15 단위로 증가, 초기 크기를 키움)
    function calculateSize(views, baseWidth) {
        const minWidth = baseWidth / 8; // 초기 가로 크기 증가 (기존 12 → 8)
        const minHeight = minWidth * 0.75; // 초기 세로 크기 (4:3 비율)
        const maxWidth = baseWidth / 1.2; // 최대 가로 크기 (기존 1.5 → 1.2)
        const step = Math.floor(views / 5); // 5단위 증가
        const width = Math.min(maxWidth, minWidth + step * (baseWidth / 20)); // 가로 크기 증가
        const height = width * 0.75; // 세로 크기는 가로 크기의 4:3 비율로 설정
        return { width, height };
    }

    // 각 카드의 크기를 동적으로 설정
    document.querySelectorAll('.job-card').forEach(card => {
        const views = parseInt(card.getAttribute('data-views'), 10);
        const size = calculateSize(views, baseWidth);

        // 초기 크기와 비율 설정
        card.style.width = `${size.width}px`;
        card.style.height = `${size.height}px`;

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
                card.style.width = `${newSize.width}px`;
                card.style.height = `${newSize.height}px`;
            })
            .catch(error => console.error(error));
    }
});
