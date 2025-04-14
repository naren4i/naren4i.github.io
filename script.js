const musicData = [
    {
        title: 'Hinonaka 「Luminous」',
        url: 'https://youtu.be/ijiYvLPw4Mo?si=fpeyo_j10-5HnqT_&t=1495',
        info: '作曲・編曲',
        date: '2025-03-29'
    },
    {
        title: 'Aubemare 「도화（刀火）」',
        url: 'https://youtu.be/joDk1gs7m6g',
        info: '作曲・編曲',
        date: '2024-10-25'
    },
    {
        title: 'Aubemare 「백야（Midnight Sun）」',
        url: 'https://youtu.be/oN4OhS6gHuY',
        info: '作曲・編曲',
        date: '2024-07-19'
    },
    {
        title: 'Celestial Squad 「활로( 活路 )」',
        url: 'https://youtu.be/8rfsofOQeXs',
        info: '作曲・編曲',
        date: '2024-03-24'
    },
    {
        title: 'LyuU 「レグルス」',
        url: 'https://youtu.be/AZ5VLJRaYgU',
        info: '作詞・作曲・編曲',
        date: '2016-04-22'
    }
];

// 연도별로 그룹화하고 최신순 정렬
const groupedByYear = {};

// 데이터를 한 번만 처리하여 연도와 날짜를 추출
const processedData = musicData.map(item => {
    const date = new Date(item.date);
    return {
        ...item,
        year: date.getFullYear(),
        timestamp: date.getTime()  // Date 객체를 밀리초로 변환
    };
});

// 연도순 최신 -> 오래된 순, 동일 연도 내에서는 날짜순 오래된 순으로 정렬
processedData.sort((a, b) => {
    // 연도순으로 최신순 정렬
    if (a.year !== b.year) return b.year - a.year;
    
    // 같은 연도 내에서는 날짜순으로 오래된 순 정렬
    return a.timestamp - b.timestamp;
});

// 그룹화 작업
processedData.forEach(item => {
    if (!groupedByYear[item.year]) {
        groupedByYear[item.year] = [];
    }
    groupedByYear[item.year].push(item);
});


// 렌더링
const musicList = document.querySelector('.music-list');
musicList.innerHTML = ''; // 초기화

for (const year of Object.keys(groupedByYear).sort((a, b) => b - a)) {
    const yearHeader = document.createElement('h2');
    yearHeader.className = 'year-header';
    yearHeader.textContent = year;
    musicList.appendChild(yearHeader);

    const grid = document.createElement('div');
    grid.className = 'music-grid';

    groupedByYear[year].forEach(item => {
        const videoId = new URL(item.url).searchParams.get('v') || item.url.split('/').pop().split('?')[0];
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';

        musicItem.innerHTML = `
            <a href="${item.url}" target="_blank">
                <img src="${thumbnailUrl}" alt="${item.title}" class="thumbnail">
            </a>
            <div class="music-details">
                <a href="${item.url}" target="_blank" class="title">${item.title}</a>
                <p class="music-info">${item.info}</p>
                <p class="music-date">${item.date}</p>
            </div>
        `;

        grid.appendChild(musicItem);
    });

    musicList.appendChild(grid);
}

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function animateBackground() {
    // 배경 색상: 부드러운 베이지 색
    ctx.fillStyle = 'rgba(245, 245, 220, 1)'; // 베이지 색 (배경)
    ctx.fillRect(0, 0, width, height);

    // 스크롤에 따라 도형의 크기와 색상 변화
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight === 0 ? 0 : scrollTop / docHeight;

    // 도형 색상 설정
    const hue = Math.floor(scrollPercent * 360);
    const fillColor = `hsl(${hue}, 70%, 60%)`; // 스크롤에 따라 색상 변화

    // 다각형 (삼각형) 애니메이션 예시
    const triangleSize = (scrollPercent * 100) + 30; // 스크롤에 따라 삼각형 크기 변화
    ctx.beginPath();
    ctx.moveTo(width / 2 - triangleSize, height / 2 + triangleSize);
    ctx.lineTo(width / 2 + triangleSize, height / 2 + triangleSize);
    ctx.lineTo(width / 2, height / 2 - triangleSize);
    ctx.closePath();
    ctx.fillStyle = `hsl(${(hue + 180) % 360}, 70%, 60%)`; // 다른 색상
    ctx.fill();

    requestAnimationFrame(animateBackground);
}

animateBackground();
