const APP_DATA = {
    auth: false,
    students: {
        '201': ["Аманбаев Ернұр","Ахмадинова Мерей","Дарханов Шынғыс","Досанова Аянат","Елубаев Бекарыс","Әбдешова Дана","Жаксылыкoва Жанерке","Жубаныш Раушан","Көбейсин Анель","Қонақбаев Ислам","Қуаныш Аяна","Марат Абдiрахман","Мергенбай Мержан","Микишев Артур","Нағашыбаев Асылжан","Нұржанов Максат","Сапарова Көркем","Сақтаған Гулерке","Султанова Камила","Турсынбаева Гулназ","Тугелбаев Нурали","Хасанов Бек","Харисова Алита"],
        '202': ["Белан Иван","Белоусова Елизавета","Гриценюк Руслан","Кучминский Герман","Ледакова Екатирина","Лилова Елена","Ломовцев Илья","Мыц Ринат","Рахимова Фатима","Сергеев Антон","Сиротенко Егор","Скалацкий Богдан","Таласов Руслан","Лаптеева Кристина"],
        '203': ["Айбеккызы Аружан","Амангазы Жансерик","Абилкасынкызы Нурсезим","Багонбай Аягуль","Батырханкызы Аяулым","Бахитова Дана","Боранбай Данабек","Дайынов Дамир","Дуйсенбай Марал","Елемесов Жадигер","Жакенов Ерсин","Жалгас Жанас"],
        '301': ["Адилханов Ислам Уалиханович","Әбдрахман Кенжегүл Серікқызы","Изатов Мадияр Мерекеұлы","Кази Канат Асланулы","Кыдырбаев Дидар Медетулы","Муратова Айым Кайраткызы","Орынбасар Тілек Бекжанулы","Орынбасаров Нуркуйса Аскарович","Сатыбалды Акдидар Сериккызы","Серіков Темірлан Тимурулы","Кадрашева Жаннур Жулдызбековна"]
    }
};

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = new Date().getDate(); // Әдепкі бойынша бүгінгі күн
let currentGroup = '';

// --- КІРУ ЖӘНЕ ЭКРАНДАР ---
function login() {
    const user = document.getElementById('login').value;
    if(user === 'kemal') {
        showScreen('schedule');
    } else {
        alert('Логин қате!');
    }
}
function logout() {
    // Пайдаланушыны логин экранына қайтару
    showScreen('login');
    
    // Енгізілген құпиясөзді тазалау
    const passwordInput = document.getElementById('password');
    if (passwordInput) passwordInput.value = '';
    
    console.log("Жүйеден шығу орындалды");
}
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id + 'Screen').classList.add('active');
    if (id === 'schedule') renderSchedule();
}

// --- УАҚЫТТЫ БАСҚАРУ ---
function isCurrentLesson(dayIndex, startTimeStr, endTimeStr) {
    const now = new Date();
    const currentDay = now.getDay(); 
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const getMinutes = (timeStr) => {
        const [h, m] = timeStr.trim().split(':').map(Number);
        return h * 60 + m;
    };

    return (currentDay === dayIndex + 1) && (currentTime >= getMinutes(startTimeStr) && currentTime <= getMinutes(endTimeStr));
}

function renderSchedule() {
    const grid = document.getElementById('scheduleGrid');
    const T1 = { 1: "08:00-09:30", 2: "09:40-11:10", 3: "11:25-12:55", 4: "13:00-14:30" };
    const T2 = { 1: "13:00-14:30", 2: "15:40-16:10", 3: "16:25-17:55", 4: "18:00-19:30" };
    const days = ['Дүйсенбі','Сейсенбі','Сәрсенбі','Бейсенбі','Жұма'];
    
    grid.innerHTML = `<div class="day-header">Топ / Күн</div>` + days.map(d => `<div class="day-header">${d}</div>`).join('');

    const scheduleConfig = [
        { name: '201', subject: 'КМ03', lessons: [T1[2], T1[1], T1[1], T1[1], T1[2]] },
        { name: '203', subject: 'КМ03', lessons: [T1[3], T1[4], T1[3], T1[2], T1[3]] },
        { name: '202', subject: 'КМ03', lessons: [T2[1], T2[2], T2[3], T2[4], T2[2]] },
        // 301 тобы үшін КМ06 және КМ07 кезектесіп келеді (мысалы ретінде):
        { name: '301', subject: 'КМ06/07', lessons: [T2[3], T2[4], T2[1], T2[2], T2[4]] }
    ];

    scheduleConfig.forEach(g => {
        grid.innerHTML += `<div class="group-label">${g.name} РПО</div>`;
        g.lessons.forEach((time, idx) => {
            const [start, end] = time.split('-').map(s => s.trim());
            const activeClass = isCurrentLesson(idx, start, end) ? 'active-lesson' : '';
            
            // 301 тобы үшін пән атын анықтау (Дүйсенбі, Сәрсенбі - КМ06, қалған күндері - КМ07)
            let currentSubject = g.subject;
            if (g.name === '301') {
                currentSubject = (idx === 0 || idx === 2) ? 'КМ 06' : 'КМ 07';
            }

            grid.innerHTML += `
                <div class="lesson ${activeClass}" onclick="openJournal('${g.name}','${days[idx]}','${time}')">
                    <strong>${currentSubject}</strong>
                    <small>${time}</small>
                </div>`;
        });
    });
}

// --- ЖУРНАЛ ЖӘНЕ КАЛЕНДАРЬ ---
function openJournal(group, day, time) {
    currentGroup = group;
    document.getElementById('journalTitle').textContent = `${group} РПО | Журнал`;
    document.getElementById('currentGroupInfo').innerHTML = `<h3>${group} РПО</h3><p>${day} | ${time}</p>`;
    showScreen('journal');
    renderCalendar();
    loadStudentsTable();
}

function renderCalendar() {
    const monthYearText = document.getElementById('monthYear');
    const calendarGrid = document.getElementById('calendarDays');
    const months = ["Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым", "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан"];
    
    monthYearText.textContent = `${months[currentMonth]} ${currentYear}`;
    calendarGrid.innerHTML = '';

    // Айдың бірінші күні аптаның қай күні екенін анықтау (0-Жексенбі, 1-Дүйсенбі...)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    // Қазақша күнтізбе үшін (Дүйсенбіден бастау)
    const startingPoint = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    // Бос ұяшықтар (ай басталғанға дейінгі күндер)
    for (let i = 0; i < startingPoint; i++) {
        calendarGrid.innerHTML += `<div></div>`;
    }

    // Күндерді шығару
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = today.getDate() === d && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
        const isSelected = selectedDate === d;
        
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`;
        dayDiv.textContent = d;
        
        dayDiv.onclick = () => {
            selectedDate = d;
            renderCalendar();
            loadStudentsTable(); // Күн өзгергенде тізімді жаңарту
        };
        calendarGrid.appendChild(dayDiv);
    }
}

// --- СТУДЕНТТЕР КЕСТЕСІН ЖҮКТЕУ ---
function loadStudentsTable() {
    const tbody = document.getElementById('studentsTable');
    tbody.innerHTML = '';
    
    const dateKey = `${selectedDate}-${currentMonth}-${currentYear}-${currentGroup}`;
    const savedGrades = JSON.parse(localStorage.getItem(dateKey)) || {};

    APP_DATA.students[currentGroup].forEach((student, index) => {
        const grade = savedGrades[student] || '';
        
        // Түс класын анықтау
        let colorClass = '';
        let n = parseInt(grade);
        if (grade.toUpperCase() === 'НБ') colorClass = 'grade-nb';
        else if (n < 70) colorClass = 'grade-low';
        else if (n >= 70 && n <= 89) colorClass = 'grade-mid';
        else if (n >= 90) colorClass = 'grade-high';

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td style="text-align:left;">${student}</td>
                <td>
                    <input type="text" class="mark-input ${colorClass}" 
                        value="${grade}" 
                        oninput="updateGradeColor(this)"
                        data-student="${student}">
                </td>
                <td><input type="text" class="note-input"></td>
            </tr>`;
    });
}

// Жаңа жазғанда түсті бірден өзгерту үшін көмекші функция
function updateGradeColor(input) {
    input.value = input.value.toUpperCase();
    if(input.value === 'Н') input.value = 'НБ';
    
    // Ескі кластарды өшіру
    input.classList.remove('grade-nb', 'grade-low', 'grade-mid', 'grade-high');
    
    let val = input.value;
    let n = parseInt(val);
    
    if (val === 'НБ') input.classList.add('grade-nb');
    else if (n < 70) input.classList.add('grade-low');
    else if (n >= 70 && n <= 89) input.classList.add('grade-mid');
    else if (n >= 90) input.classList.add('grade-high');
}

// --- САҚТАУ ФУНКЦИЯСЫ ---
function saveJournal() {
    const dateKey = `${selectedDate}-${currentMonth}-${currentYear}-${currentGroup}`;
    const grades = {};
    
    document.querySelectorAll('.mark-input').forEach(input => {
        grades[input.dataset.student] = input.value;
    });

    localStorage.setItem(dateKey, JSON.stringify(grades));
    alert('Бағалар сақталды!');
}

function prevMonth() { currentMonth--; if(currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(); }
function nextMonth() { currentMonth++; if(currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(); }
function goBack() { showScreen('schedule'); }
function exportExcel() {
    const students = APP_DATA.students[currentGroup] || [];
    const dateKey = `${selectedDate}-${currentMonth}-${currentYear}-${currentGroup}`;
    const savedGrades = JSON.parse(localStorage.getItem(dateKey)) || {};

    let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8">
        <style>
            .nb { background: #ff0000; color: white; } /* НБ - Қызыл */
            .low { background: #ffff00; }             /* <70 - Сары */
            .mid { background: #0000ff; color: white; } /* 70-89 - Көк */
            .high { background: #00ff00; }            /* 90-100 - Жасыл */
            td { border: 1px solid #000; padding: 5px; }
        </style>
        </head>
        <body>
            <table>
                <tr><th colspan="3">Топ: ${currentGroup} | Күні: ${selectedDate}.${currentMonth+1}</th></tr>
                <tr><th>#</th><th>Студент аты</th><th>Баға</th></tr>
    `;

    students.forEach((s, i) => {
        let val = savedGrades[s] || "";
        let styleClass = "";
        
        // Түстерді анықтау логикасы
        let n = parseInt(val);
        if (val.toUpperCase() === 'НБ') styleClass = 'class="nb"';
        else if (n < 70) styleClass = 'class="low"';
        else if (n >= 70 && n <= 89) styleClass = 'class="mid"';
        else if (n >= 90) styleClass = 'class="high"';

        html += `<tr><td>${i+1}</td><td>${s}</td><td ${styleClass}>${val}</td></tr>`;
    });

    html += `</table></body></html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Журнал_${currentGroup}.xls`;
    link.click();
}