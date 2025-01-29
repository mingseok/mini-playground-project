document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.grid-container');
    const cards = document.querySelectorAll('.job-card');

    const postItColors = ['#FFF6B8', '#FFD3B8', '#A9D4FF', '#FFC2C2', '#F4E2FF'];

    // 랜덤 배경색 설정
    cards.forEach(card => {
        const randomColor = postItColors[Math.floor(Math.random() * postItColors.length)];
        card.style.backgroundColor = randomColor;
    });

    // 크기 계산 함수
    function calculateSize(views, baseWidth) {
        const minSize = baseWidth / 32;
        const maxSize = baseWidth / 4;

        let width = minSize;
        let height = minSize * 0.75;

        for (let i = 1; i <= views; i++) {
            if (i % 2 === 1) {
                width = Math.min(maxSize, width * 2);
            } else {
                height = Math.min(maxSize * 0.75, height * 2);
            }
        }

        return { width, height };
    }

    // 레이아웃 적용 함수
    function applyLayout(cards) {
        const baseWidth = container.offsetWidth > 0 ? container.offsetWidth : 1024;

        cards.forEach(card => {
            const views = parseInt(card.getAttribute('data-views'), 10) || 0;
            const { width, height } = calculateSize(views, baseWidth);

            card.style.width = `${width}px`;
            card.style.height = `${height}px`;
            card.style.position = "relative";

            console.log(`카드 ID: ${card.getAttribute('data-id')}, 조회수: ${views}, width: ${width}, height: ${height}`);
        });
    }

    // 클릭 수 증가 요청 함수
    function increaseClickCount(jobId) {
        console.log(`increaseClickCount 호출됨. 대상 Job ID: ${jobId}`);
        fetch(`/api/job-postings/${jobId}/click`, {
            method: 'POST',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to update click count: ${response.statusText}`);
                }
                return response.json();
            })
            .then(updatedJob => {
                console.log(`서버 응답: ${JSON.stringify(updatedJob)}`);
                if (updatedJob && updatedJob.id && updatedJob.clickCount !== undefined) {
                    const card = document.querySelector(`.job-card[data-id="${updatedJob.id}"]`);
                    if (card) {
                        card.setAttribute('data-views', updatedJob.clickCount);
                        card.querySelector('.view-count').textContent = `조회수: ${updatedJob.clickCount}`;
                        applyLayout(cards);
                    }
                } else {
                    console.error('서버 응답 데이터가 올바르지 않습니다:', updatedJob);
                    alert('조회수 데이터를 업데이트할 수 없습니다. 다시 시도해주세요.');
                }
            })
            .catch(error => {
                console.error('조회수 업데이트 중 오류 발생:', error);
                alert('조회수를 업데이트하는 데 문제가 발생했습니다. 다시 시도해주세요.');
            });
    }

    // 카드 클릭 이벤트 추가
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const jobId = card.getAttribute('data-id');
            increaseClickCount(jobId);
        });
    });

    // 초기 레이아웃 설정
    applyLayout(cards);

    // 창 크기 변경 시 레이아웃 재적용
    window.addEventListener('resize', () => applyLayout(cards));
});
