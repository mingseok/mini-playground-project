document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.grid-container');
    const cards = document.querySelectorAll('.job-card');

    // 랜덤 색상 배열
    const postItColors = ['#FFF6B8', '#FFD3B8', '#A9D4FF', '#FFC2C2', '#F4E2FF'];

    // 카드에 랜덤 배경색 적용
    cards.forEach(card => {
        const randomColor = postItColors[Math.floor(Math.random() * postItColors.length)];
        card.style.backgroundColor = randomColor; // **랜덤 배경색 추가**
    });


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

    // 레이아웃 적용 함수 (조회수 조건에 따른 처리 추가)
    function applyLayout(layout, cards) {
        layout.forEach((pos, index) => {
            const card = cards[index];
            const views = parseInt(card.getAttribute('data-views'), 10) || 0;

            card.style.width = `${pos.width}px`;
            card.style.height = `${pos.height}px`;
            card.style.position = "absolute";
            card.style.left = `${pos.x}px`;
            card.style.top = `${pos.y}px`;

            // 글자 크기 동적 설정
            const fontSize = Math.max(12, (pos.width / 10));
            card.style.fontSize = `${fontSize}px`;

            // 제목, 회사명, 위치, 설명 별도 스타일 크기 비율 적용
            const titleElement = card.querySelector(".title");
            const companyElement = card.querySelector(".company");
            const locationElement = card.querySelector(".location");
            const descriptionElement = card.querySelector(".description");

            // 제목 처리 (title)
            if (titleElement) {
                titleElement.style.display = "block";
                titleElement.textContent = card.getAttribute("data-title") || "Untitled";
                titleElement.style.fontSize = `${fontSize * 1.2}px`;
                adjustFontSize(titleElement, pos.width - 20); // 카드 폭에 맞춰 글자 크기 조정
            }

            if (companyElement) {
                companyElement.style.fontSize = `${fontSize}px`;
                adjustFontSize(companyElement, pos.width - 20); // 카드 폭에 맞춰 글자 크기 조정
            }

            // location 설정
            if (locationElement) {
                if (views <= 4) {
                    locationElement.style.display = "none"; // 조회수 0~4일 때 숨김
                } else {
                    locationElement.style.display = "block"; // 5 이상일 때 표시
                    locationElement.textContent = card.getAttribute("data-location") || "";
                }
            }

            // description 설정
            if (descriptionElement) {
                if (views <= 4) {
                    descriptionElement.textContent = "...";
                } else {
                    descriptionElement.textContent = card.getAttribute("data-description") || "";
                    adjustFontSize(descriptionElement, pos.width - 20); // 카드 폭에 맞춰 글자 크기 조정
                }
            }
        });
    }

    function adjustFontSize(element, maxWidth) {
        const initialFontSize = parseFloat(window.getComputedStyle(element).fontSize);
        let currentFontSize = initialFontSize;
        element.style.whiteSpace = "nowrap"; // 줄바꿈 비활성화

        while (element.scrollWidth > maxWidth && currentFontSize > 12) {
            currentFontSize -= 1;
            element.style.fontSize = `${currentFontSize}px`;
        }

        element.style.whiteSpace = "normal"; // 줄바꿈 활성화
    }

    // 레이아웃 설정 함수
    function setLayout() {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const layout = calculateGridLayout(cards, containerWidth, containerHeight);

        layout.forEach((pos, index) => {
            const card = cards[index];
            const views = parseInt(card.getAttribute('data-views'), 10) || 0;

            card.style.width = `${pos.width}px`;
            card.style.height = `${pos.height}px`;
            card.style.position = "absolute";
            card.style.left = `${pos.x}px`;
            card.style.top = `${pos.y}px`;

            // 글자 크기 동적 설정
            const fontSize = Math.max(12, (pos.width / 10)); // 글자 크기 비율 설정
            card.style.fontSize = `${fontSize}px`;

            // 제목, 회사명, 위치, 설명 별도 스타일 크기 비율 적용
            const titleElement = card.querySelector(".title");
            const companyElement = card.querySelector(".company");
            const locationElement = card.querySelector(".location");
            const descriptionElement = card.querySelector(".description");

            // 제목 설정 (항상 출력)
            if (titleElement) {
                titleElement.style.display = "block";
                titleElement.textContent = card.getAttribute("data-title") || "Untitled";
                titleElement.style.fontSize = `${fontSize * 1.2}px`;
                adjustFontSize(titleElement, pos.width - 20); // 카드 폭에 맞춰 글자 크기 조정
            }

            if (companyElement) {
                companyElement.style.fontSize = `${fontSize}px`;
                adjustFontSize(companyElement, pos.width - 20); // 카드 폭에 맞춰 글자 크기 조정
            }

            // location 설정
            if (locationElement) {
                if (views <= 4) {
                    locationElement.style.display = "none"; // 조회수 0~4일 때 숨김
                } else {
                    locationElement.style.display = "block"; // 5 이상일 때 표시
                    locationElement.textContent = card.getAttribute("data-location") || "";
                }
            }

            if (descriptionElement) {
                if (views <= 4) {
                    descriptionElement.textContent = "...";
                } else {
                    descriptionElement.textContent = card.getAttribute("data-description") || "";
                    adjustFontSize(descriptionElement, pos.width - 20); // 카드 폭에 맞춰 글자 크기 조정
                }
            }
        });

        // applyLayout 호출 (레이아웃 적용)
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

                    // location 업데이트
                    const locationElement = card.querySelector('.location');
                    if (locationElement) {
                        if (updatedJob.clickCount <= 4) {
                            locationElement.style.display = "none"; // 조회수 0~4일 때 숨김
                        } else {
                            locationElement.style.display = "block"; // 5 이상일 때 표시
                            locationElement.textContent = updatedJob.location;
                        }
                    }

                    // description 업데이트
                    const descriptionElement = card.querySelector('.description');
                    if (descriptionElement) {
                        if (updatedJob.clickCount <= 4) {
                            descriptionElement.textContent = "..."; // 조회수 0~4일 때 "..." 표시
                        } else {
                            descriptionElement.textContent = updatedJob.description; // 5 이상일 때 설명 표시
                        }
                    }
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
