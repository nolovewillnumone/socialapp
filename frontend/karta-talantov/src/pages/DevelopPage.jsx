import { useState, useEffect, useRef } from "react";
import Nav from "../components/Nav";

const TALENT_DATA = {
  logic:      { icon:"🧠", color:"#1565C0", bg:"#E3F2FD", name:{ru:"Логика",uz:"Mantiq",en:"Logic"}, desc:{ru:"Твой мозг — настоящий процессор! Ты видишь закономерности там, где другие видят хаос.",uz:"Sizning miyangiz haqiqiy protsessor!",en:"Your brain is a real processor! You see patterns where others see chaos."}, careers:{ru:["Программист","Data Scientist","Математик","Инженер","Учёный","Архитектор","Пилот"],uz:["Dasturchi","Data Scientist","Matematik","Muhandis","Olim"],en:["Programmer","Data Scientist","Mathematician","Engineer","Scientist","Architect","Pilot"]}, tips:{ru:["Решай задачи на LeetCode или Codeforces ежедневно","Изучи Python или JavaScript — начни с Khan Academy","Играй в шахматы, го или стратегические игры","Читай книги по алгоритмам и логике","Участвуй в олимпиадах по математике и информатике"],en:["Solve daily problems on LeetCode or Codeforces","Learn Python or JavaScript — start with Khan Academy","Play chess, go or strategy games","Read books on algorithms and logic","Join math and programming olympiads"]}, courses:{ru:["CS50 (Harvard, бесплатно)","Khan Academy — Математика","Coursera — Алгоритмы (Stanford)","Scratch.mit.edu","Code.org"],en:["CS50 (Harvard, free)","Khan Academy — Mathematics","Coursera — Algorithms (Stanford)","Scratch.mit.edu","Code.org"]}, universities:{ru:["🇺🇸 MIT — Computer Science","🇺🇸 Stanford — AI & ML","🇷🇺 ИТМО — Олимпиадное программирование","🇺🇿 INHA University Tashkent","🇺🇸 Carnegie Mellon"],en:["🇺🇸 MIT — Computer Science","🇺🇸 Stanford — AI & ML","🇬🇧 Oxford — Mathematics","🇺🇿 INHA University Tashkent","🇺🇸 Carnegie Mellon"]}, weekly:{ru:["Пн: 30 мин LeetCode","Вт: Читай алгоритмы","Ср: Строй проект на Python","Чт: Шахматы онлайн","Пт: Новая тема CS50","Сб: Олимпиадная задача","Вс: Разбор ошибок"],en:["Mon: 30min LeetCode","Tue: Read algorithms","Wed: Build Python project","Thu: Chess online","Fri: New CS50 topic","Sat: Olympiad problem","Sun: Review mistakes"]} },
  creativity: { icon:"🎨", color:"#E64A19", bg:"#FBE9E7", name:{ru:"Творчество",uz:"Ijodkorlik",en:"Creativity"}, desc:{ru:"Ты видишь мир не таким, какой он есть, а таким, каким он может быть. Это редкий дар!",uz:"Siz dunyoni bor holida emas, balki bo'lishi mumkin bo'lgan holda ko'rasiz.",en:"You see the world not as it is, but as it could be. That's a rare gift!"}, careers:{ru:["Дизайнер","UX/UI","Художник","Архитектор","Режиссёр","Геймдизайнер","Аниматор"],uz:["Dizayner","UX/UI","Rassom","Arxitektor","Rejissyor","Animator"],en:["Designer","UX/UI","Artist","Architect","Director","Game Designer","Animator"]}, tips:{ru:["Рисуй каждый день — хотя бы 15 минут","Изучи Figma, Canva или Adobe XD","Веди скетчбук — записывай идеи","Смотри фильмы и анализируй визуальный стиль","Создай собственный проект"],en:["Draw every day — even 15 minutes","Learn Figma, Canva or Adobe XD","Keep a sketchbook — record ideas","Watch films and analyse visual style","Create your own project"]}, courses:{ru:["Canva Design School (бесплатно)","Figma — официальные туториалы","Skillshare — иллюстрация","Adobe Creative Cloud","Behance — портфолио"],en:["Canva Design School (free)","Figma — official tutorials","Skillshare — illustration","Adobe Creative Cloud","Behance — portfolio"]}, universities:{ru:["🇺🇸 Rhode Island School of Design","🇬🇧 Central Saint Martins","🇺🇿 O'zDSMI Tashkent","🇩🇪 Bauhaus-Universität Weimar"],en:["🇺🇸 Rhode Island School of Design","🇬🇧 Central Saint Martins","🇺🇸 Parsons School of Design","🇩🇪 Bauhaus-Universität Weimar"]}, weekly:{ru:["Пн: 15 мин рисования","Вт: Новый инструмент Figma","Ср: Анализ дизайна сайта","Чт: Создай мудборд","Пт: Новый скетч-проект","Сб: Documentary о дизайне","Вс: Обновить портфолио"],en:["Mon: 15min drawing","Tue: New Figma tool","Wed: Analyse website design","Thu: Create a moodboard","Fri: New sketch project","Sat: Design documentary","Sun: Update portfolio"]} },
  memory:     { icon:"🃏", color:"#7E57C2", bg:"#EDE7F6", name:{ru:"Память",uz:"Xotira",en:"Memory"}, desc:{ru:"Твоя память — настоящее хранилище знаний! Ты легко запоминаешь детали, факты и события.",uz:"Sizning xotirangiz haqiqiy bilimlar ombori!",en:"Your memory is a true knowledge vault! You easily remember details, facts and events."}, careers:{ru:["Врач","Юрист","Переводчик","Историк","Учёный","Нотариус","Фармацевт"],uz:["Shifokor","Yurist","Tarjimon","Tarixchi","Olim"],en:["Doctor","Lawyer","Translator","Historian","Scientist","Notary","Pharmacist"]}, tips:{ru:["Используй метод 'Дворца памяти'","Повторяй материал через интервалы (Anki)","Учи стихи и тексты наизусть","Играй в игры на запоминание карточек","Веди подробный дневник"],en:["Use the Memory Palace technique","Review material at intervals (Anki)","Memorise poems and texts","Play card memory games","Keep a detailed journal"]}, courses:{ru:["Anki — интервальные повторения (бесплатно)","Coursera — Learning How to Learn","YouTube — метод Дворца памяти","Duolingo — языки через повторение"],en:["Anki — spaced repetition (free)","Coursera — Learning How to Learn","YouTube — Memory Palace method","Duolingo — languages through repetition"]}, universities:{ru:["🇺🇸 Harvard Medical School","🇬🇧 Oxford — Psychology","🇷🇺 МГУ — Психология","🇺🇿 NUUz — Медицина"],en:["🇺🇸 Harvard Medical School","🇬🇧 Oxford — Psychology","🇺🇸 Johns Hopkins — Medicine","🇺🇿 NUUz — Medicine"]}, weekly:{ru:["Пн: 20 карточек Anki","Вт: Выучи стихотворение","Ср: Дворец памяти — новая комната","Чт: Повтори прошлую неделю","Пт: Игра на запоминание","Сб: 10 новых слов","Вс: Дневник достижений"],en:["Mon: 20 Anki cards","Tue: Memorise a poem","Wed: Memory Palace new room","Thu: Review last week","Fri: Memory game","Sat: 10 new words","Sun: Achievement journal"]} },
  leadership: { icon:"👑", color:"#F9A825", bg:"#FFF8E1", name:{ru:"Лидерство",uz:"Liderlik",en:"Leadership"}, desc:{ru:"Ты рождён вести за собой! Люди тянутся к тебе, ты умеешь вдохновлять и организовывать.",uz:"Siz rahbarlik qilish uchun tug'ilgansiz!",en:"You were born to lead! People are drawn to you, you know how to inspire."}, careers:{ru:["Предприниматель","CEO","Политик","Менеджер","HR-директор","Дипломат","Тренер"],uz:["Tadbirkor","CEO","Siyosatchi","Menejer","Diplomat"],en:["Entrepreneur","CEO","Politician","Manager","HR Director","Diplomat","Coach"]}, tips:{ru:["Организуй мероприятие в школе","Вступи в дебатный клуб или студсовет","Читай биографии великих лидеров","Учись активному слушанию","Веди команду в групповых проектах"],en:["Organise an event at school","Join a debate club or student council","Read biographies of great leaders","Learn active listening","Lead a team in group projects"]}, courses:{ru:["Coursera — Leadership (Yale)","edX — Emotional Intelligence (Harvard)","YouTube — TED Talks о лидерстве","Toastmasters — публичные выступления"],en:["Coursera — Leadership (Yale)","edX — Emotional Intelligence (Harvard)","YouTube — TED Talks on Leadership","Toastmasters — public speaking"]}, universities:{ru:["🇺🇸 Harvard Business School","🇺🇸 Wharton (UPenn)","🇬🇧 London Business School","🇺🇿 Westminster Tashkent"],en:["🇺🇸 Harvard Business School","🇺🇸 Wharton (UPenn)","🇬🇧 London Business School","🇸🇬 INSEAD"]}, weekly:{ru:["Пн: Глава биографии лидера","Вт: Возьми инициативу в группе","Ср: TED Talk + разбор идей","Чт: Напиши план проекта","Пт: Практика выступления","Сб: Встреча с командой","Вс: Рефлексия недели"],en:["Mon: Leader biography chapter","Tue: Take initiative in a group","Wed: TED Talk + idea breakdown","Thu: Write your project plan","Fri: Public speaking practice","Sat: Team meeting","Sun: Weekly reflection"]} },
  languages:  { icon:"🌍", color:"#00838F", bg:"#E0F7FA", name:{ru:"Языки",uz:"Tillar",en:"Languages"}, desc:{ru:"Языки — твоя суперсила! Каждый новый язык открывает целый новый мир мышления.",uz:"Tillar — sizning superkuchingiz!",en:"Languages are your superpower! Every new language opens a whole new world."}, careers:{ru:["Переводчик","Дипломат","Журналист","Писатель","Лингвист","Учитель языков"],uz:["Tarjimon","Diplomat","Jurnalist","Yozuvchi","Tilshunos"],en:["Translator","Diplomat","Journalist","Writer","Linguist","Language Teacher"]}, tips:{ru:["Смотри фильмы без субтитров","Используй Duolingo каждый день","Найди носителя языка для практики","Читай книги на языке который учишь","Веди дневник на иностранном языке"],en:["Watch films without subtitles","Use Duolingo daily","Find a native speaker for practice","Read books in target language","Keep a diary in a foreign language"]}, courses:{ru:["Duolingo (бесплатно)","italki — уроки с носителями","Coursera — Linguistics (UPenn)","BBC Learning English"],en:["Duolingo (free)","italki — native speaker lessons","Coursera — Linguistics (UPenn)","BBC Learning English"]}, universities:{ru:["🇺🇸 Georgetown — Дипломатия","🇷🇺 МГИМО","🇬🇧 Cambridge — Лингвистика","🇺🇿 O'zDJTU"],en:["🇺🇸 Georgetown — Diplomacy","🇬🇧 Cambridge — Linguistics","🇫🇷 Sciences Po Paris","🇺🇿 O'zDJTU"]}, weekly:{ru:["Пн: 20 мин Duolingo","Вт: Сериал на языке","Ср: 15 мин разговорной практики","Чт: Статья на языке","Пт: 10 новых слов","Сб: Параграф на языке","Вс: Разбор грамматики"],en:["Mon: 20min Duolingo","Tue: Episode in target language","Wed: 15min conversation practice","Thu: Article in the language","Fri: 10 new words","Sat: Write a paragraph","Sun: Grammar review"]} },
  music:      { icon:"🎵", color:"#2E7D32", bg:"#E8F5E9", name:{ru:"Музыка",uz:"Musiqa",en:"Music"}, desc:{ru:"Музыкальный интеллект — особый дар! Музыканты имеют более развитые нейронные связи.",uz:"Musiqiy intellekt — bu alohida sovg'a!",en:"Musical intelligence is a special gift! Musicians have stronger neural connections."}, careers:{ru:["Музыкант","Композитор","Певец","Звукорежиссёр","Дирижёр","Музыкальный продюсер"],uz:["Musiqachi","Bastakor","Qo'shiqchi","Ovoz rejissyori","Musiqa produseri"],en:["Musician","Composer","Singer","Sound Engineer","Conductor","Music Producer"]}, tips:{ru:["Занимайся на инструменте 30 минут в день","Слушай разные жанры — классика, джаз, фолк","Записывай свои мелодии и идеи","Изучи нотную грамоту","Участвуй в концертах"],en:["Practice an instrument 30 minutes daily","Listen to different genres","Record your melodies and ideas","Learn music notation","Participate in concerts"]}, courses:{ru:["Simply Piano (iPhone/Android)","Yousician — гитара, пианино","Coursera — Music Theory (Berklee)","musictheory.net"],en:["Simply Piano (iPhone/Android)","Yousician — guitar, piano","Coursera — Music Theory (Berklee)","musictheory.net"]}, universities:{ru:["🇺🇸 Berklee College of Music","🇺🇸 Juilliard School","🇬🇧 Royal Academy of Music","🇺🇿 Государственная Консерватория"],en:["🇺🇸 Berklee College of Music","🇺🇸 Juilliard School","🇬🇧 Royal Academy of Music","🇺🇿 State Conservatory of Uzbekistan"]}, weekly:{ru:["Пн: 30 мин инструмента","Вт: Разбор любимой песни","Ср: Запись своей мелодии","Чт: Слушай классику","Пт: Один урок теории","Сб: Мини-выступление","Вс: Новые жанры"],en:["Mon: 30min instrument","Tue: Analyse favourite song","Wed: Record your melody","Thu: Listen to classical music","Fri: One theory lesson","Sat: Mini-performance","Sun: New genres playlist"]} },
  sport:      { icon:"🏃", color:"#BF360C", bg:"#FBE9E7", name:{ru:"Спорт",uz:"Sport",en:"Sport"}, desc:{ru:"Физическая сила и выносливость — это не просто тело, это дисциплина и характер!",uz:"Jismoniy kuch va chidamlilik — bu nafaqat tana, bu intizom va xarakter!",en:"Physical strength and endurance — it's discipline and character, not just a body!"}, careers:{ru:["Профессиональный спортсмен","Тренер","Спортивный психолог","Физиотерапевт","Диетолог"],uz:["Professional sportchi","Murabbiy","Sport psixologi","Fizioterapevt"],en:["Professional Athlete","Coach","Sports Psychologist","Physiotherapist","Dietitian"]}, tips:{ru:["Тренируйся 4-5 раз в неделю с планом","Изучи спортивную психологию","Веди дневник тренировок","Питайся правильно — 70% результата","Участвуй в местных соревнованиях"],en:["Train 4-5 times a week with a plan","Study sports psychology","Keep a training journal","Eat right — it's 70% of results","Compete in local events"]}, courses:{ru:["Nike Training Club (бесплатно)","Coursera — Sports Science","YouTube — AthleanX","edX — Спортивное питание"],en:["Nike Training Club (free)","Coursera — Sports Science","YouTube — AthleanX","edX — Athlete Nutrition"]}, universities:{ru:["🇺🇸 Ohio State — Sports Science","🇬🇧 Loughborough University","🇺🇸 UCLA — Kinesiology","🇺🇿 O'zDSIM Tashkent"],en:["🇺🇸 Ohio State — Sports Science","🇬🇧 Loughborough University","🇺🇸 UCLA — Kinesiology","🇺🇿 UzSIPC Tashkent"]}, weekly:{ru:["Пн: Силовая тренировка","Вт: Восстановление + растяжка","Ср: Кардио + техника","Чт: Командная игра","Пт: Выносливость","Сб: Соревнование","Вс: Дневник + план"],en:["Mon: Strength training","Tue: Recovery + stretching","Wed: Cardio + technique","Thu: Team game","Fri: Endurance training","Sat: Competition","Sun: Journal + planning"]} },
  nature:     { icon:"🌿", color:"#1B5E20", bg:"#E8F5E9", name:{ru:"Природа",uz:"Tabiat",en:"Nature"}, desc:{ru:"Ты чувствуешь связь с живым миром! Это фундаментальный интеллект который помогал выжить тысячи лет.",uz:"Siz tirik dunyo bilan bog'liqlikni his qilasiz!",en:"You feel a connection to the living world! This intelligence helped humans survive for millennia."}, careers:{ru:["Биолог","Эколог","Ветеринар","Ботаник","Зоолог","Учёный-природовед"],uz:["Biolog","Ekolog","Veterinar","Botanik","Zoolog"],en:["Biologist","Ecologist","Veterinarian","Botanist","Zoologist","Environmental Scientist"]}, tips:{ru:["Веди дневник наблюдений за природой","Используй iNaturalist для определения видов","Читай о биологии и экологии","Участвуй в экологических проектах","Выращивай растения дома"],en:["Keep a nature observation journal","Use iNaturalist for species ID","Read about biology and ecology","Join environmental projects","Grow plants at home"]}, courses:{ru:["Khan Academy — Биология (бесплатно)","Coursera — Ecology (Duke University)","iNaturalist — определение видов","YouTube — SciShow Nature"],en:["Khan Academy — Biology (free)","Coursera — Ecology (Duke University)","iNaturalist — species ID","YouTube — SciShow Nature"]}, universities:{ru:["🇺🇸 UC Berkeley — Biology","🇬🇧 Cambridge — Natural Sciences","🇺🇸 Cornell — Ecology","🇺🇿 NUUz — Биология"],en:["🇺🇸 UC Berkeley — Biology","🇬🇧 Cambridge — Natural Sciences","🇺🇸 Cornell — Ecology","🇺🇿 NUUz — Biology"]}, weekly:{ru:["Пн: Прогулка — 3 новых растения","Вт: Khan Academy — биология","Ср: iNaturalist — загрузи наблюдение","Чт: Читай о любимом животном","Пт: Один урок экологии","Сб: Волонтёрство в природоохране","Вс: Дневник наблюдений"],en:["Mon: Walk — find 3 new plants","Tue: Khan Academy — biology","Wed: iNaturalist — upload observation","Thu: Read about favourite animal","Fri: One ecology lesson","Sat: Nature conservation volunteering","Sun: Observation journal"]} },
  social:     { icon:"🤝", color:"#4527A0", bg:"#EDE7F6", name:{ru:"Общение",uz:"Muloqot",en:"Social"}, desc:{ru:"Ты понимаешь людей лучше, чем они понимают себя! Это мощный эмоциональный интеллект.",uz:"Siz odamlarni ularning o'zidan ko'ra yaxshiroq tushunasiz!",en:"You understand people better than they understand themselves! This is powerful emotional intelligence."}, careers:{ru:["Психолог","Социолог","HR-менеджер","Педагог","Дипломат","Журналист","Тренер"],uz:["Psixolog","Sotsiolog","HR-menejer","Pedagog","Diplomat"],en:["Psychologist","Sociologist","HR Manager","Educator","Diplomat","Journalist","Coach"]}, tips:{ru:["Практикуй активное слушание","Читай книги по психологии","Волонтёрь — это прокачивает эмпатию","Участвуй в дебатах и публичных выступлениях","Веди дневник эмоций"],en:["Practice active listening","Read books on psychology","Volunteer — it develops empathy","Participate in debates","Keep an emotion journal"]}, courses:{ru:["Coursera — Emotional Intelligence (Yale)","edX — Psychology (Harvard)","Toastmasters — публичные выступления","YouTube — TED Talks о психологии"],en:["Coursera — Emotional Intelligence (Yale)","edX — Psychology (Harvard)","Toastmasters — public speaking","YouTube — TED Talks on psychology"]}, universities:{ru:["🇺🇸 Harvard — Psychology","🇺🇸 Stanford — Sociology","🇬🇧 Oxford — PPE","🇺🇿 NUUz — Психология"],en:["🇺🇸 Harvard — Psychology","🇺🇸 Stanford — Sociology","🇬🇧 Oxford — PPE","🇺🇿 NUUz — Psychology"]}, weekly:{ru:["Пн: Глава по психологии","Вт: Активное слушание","Ср: Дневник эмоций дня","Чт: TED Talk о людях","Пт: Помоги кому-то с проблемой","Сб: Групповое мероприятие","Вс: Рефлексия отношений"],en:["Mon: Psychology chapter","Tue: Active listening practice","Wed: Emotion journal","Thu: TED Talk on people","Fri: Help someone solve a problem","Sat: Group event","Sun: Relationship reflection"]} },
};

const DAYS = {
  ru:["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
  uz:["Du","Se","Ch","Pa","Ju","Sh","Ya"],
  en:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
};

const SECTION_ICONS = { tips:"💡", courses:"📚", careers:"🚀", universities:"🎓", weekly:"📅" };

export default function DevelopPage({ setPage, results, lang, dark }) {
  const scores       = results?.scores || {};
  const sortedTalents= Object.keys(TALENT_DATA).sort((a,b)=>(scores[b]||0)-(scores[a]||0));
  const [activeTab,  setActiveTab]  = useState(0);
  const [section,    setSection]    = useState("tips");
  const [animKey,    setAnimKey]    = useState(0);
  const hasResults   = Object.keys(scores).length > 0;

  const talent = sortedTalents[activeTab];
  const td     = TALENT_DATA[talent] || TALENT_DATA.logic;
  const score  = Math.round(scores[talent] || 0);

  const changeTab = (i) => { setActiveTab(i); setSection("tips"); setAnimKey(k=>k+1); };

  const L = {
    ru:{ title:"Развивай таланты", sub:"Персональный план на основе твоих результатов", noResults:"Пройди тест, чтобы получить персональный план!", takeQuiz:"Пройти тест →", score:"результат", sections:{ tips:"Советы", courses:"Курсы", careers:"Карьеры", universities:"Университеты", weekly:"Неделя" }, retake:"🔄 Пройти заново" },
    uz:{ title:"Iste'dodlarni rivojlantiring", sub:"Natijalaringizga asoslangan shaxsiy reja", noResults:"Shaxsiy reja olish uchun testni topshiring!", takeQuiz:"Testni topshirish →", score:"natija", sections:{ tips:"Maslahatlar", courses:"Kurslar", careers:"Kasblar", universities:"Universitetlar", weekly:"Hafta" }, retake:"🔄 Qayta topshirish" },
    en:{ title:"Develop Your Talents", sub:"Personalised development plan based on your results", noResults:"Take the quiz to get your personalised plan!", takeQuiz:"Take quiz →", score:"score", sections:{ tips:"Tips", courses:"Courses", careers:"Careers", universities:"Universities", weekly:"Weekly" }, retake:"🔄 Retake quiz" },
  }[lang] || {};

  const bg   = dark?"#060E09":"#F8FBF9";
  const card = dark?"#0D1A11":"#fff";
  const bdr  = dark?"rgba(93,202,165,0.1)":"rgba(15,110,86,0.08)";
  const muted= dark?"#7DB99A":"#78909C";

  // No results
  if (!hasResults) return (
    <div className="page-wrap" style={{ background:bg, paddingTop:64 }}>
      <Nav page="develop" setPage={setPage} lang={lang} dark={dark}/>
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, padding:"24px", textAlign:"center" }}>
        <div style={{ fontSize:"5rem", animation:"float 3s ease-in-out infinite" }}>🎯</div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"clamp(1.6rem,4vw,2.2rem)", color:dark?"#E1F5EE":"#04342C" }}>{L.noResults}</h2>
        <p style={{ color:muted, fontWeight:600, maxWidth:400, lineHeight:1.6 }}>
          {lang==="ru"?"Пройди тест из 30 вопросов и получи персональный план развития по 9 талантам":lang==="uz"?"30 savollik testni topshiring va 9 ta iste'dod bo'yicha shaxsiy reja oling":"Take the 30-question quiz and get a personalised development plan for 9 talents"}
        </p>
        <button onClick={()=>setPage("quiz")} style={{ padding:"15px 36px", background:"linear-gradient(135deg,#0F6E56,#1D9E75)", color:"#fff", border:"none", borderRadius:99, fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", cursor:"pointer", boxShadow:"0 6px 20px rgba(15,110,86,0.35)", transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(15,110,86,0.5)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 6px 20px rgba(15,110,86,0.35)";}}>
          {L.takeQuiz}
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-wrap" style={{ background:bg, paddingTop:64 }}>
      <style>{`
        @keyframes fadeSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .dev-tab{transition:all 0.2s;}
        .dev-tab:hover{background:rgba(15,110,86,0.06)!important;}
        .sec-pill{transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);}
        .sec-pill:hover{transform:translateY(-2px)!important;}
        .tip-row{transition:all 0.2s;}
        .tip-row:hover{transform:translateX(6px)!important;}
        .career-chip{transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);}
        .career-chip:hover{transform:translateY(-3px) scale(1.05)!important;}
        .uni-card{transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);}
        .uni-card:hover{transform:translateY(-4px)!important;box-shadow:0 12px 32px rgba(15,110,86,0.12)!important;}
        .course-card{transition:all 0.2s;}
        .course-card:hover{border-color:var(--c)!important;transform:translateY(-3px)!important;}
      `}</style>
      <Nav page="develop" setPage={setPage} lang={lang} dark={dark}/>

      {/* ── Page Header ── */}
      <div style={{ background:`linear-gradient(135deg,${td.color}ee,${td.color}99)`, padding:"32px 24px 28px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.08)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-40, left:-40, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }}/>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.15)", borderRadius:99, padding:"5px 16px", fontSize:"0.72rem", fontWeight:800, color:"#fff", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12 }}>
          ✦ {lang==="ru"?"Персональный план":lang==="uz"?"Shaxsiy reja":"Personalised Plan"}
        </div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"clamp(1.8rem,4vw,2.4rem)", color:"#fff", marginBottom:8, textShadow:"0 2px 20px rgba(0,0,0,0.15)" }}>{L.title}</h1>
        <p style={{ color:"rgba(255,255,255,0.8)", fontWeight:600, fontSize:"0.92rem" }}>{L.sub}</p>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display:"flex", maxWidth:1100, margin:"0 auto", gap:0 }}>

        {/* ── Sidebar ── */}
        <div style={{ width:200, flexShrink:0, borderRight:`1px solid ${bdr}`, paddingTop:16, paddingBottom:24, background: dark?"rgba(13,26,17,0.6)":card }}>
          <div style={{ padding:"0 12px 12px", fontSize:"0.68rem", fontWeight:800, color:muted, textTransform:"uppercase", letterSpacing:"0.12em" }}>
            {lang==="ru"?"Таланты":lang==="uz"?"Iste'dodlar":"Talents"}
          </div>
          {sortedTalents.map((t, i) => {
            const m  = TALENT_DATA[t];
            const sc = Math.round(scores[t]||0);
            const isActive = i===activeTab;
            return (
              <button key={t} className="dev-tab" onClick={()=>changeTab(i)}
                style={{ width:"100%", padding:"10px 12px", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10, background:isActive?`${m.color}12`:"transparent", borderRight:`3px solid ${isActive?m.color:"transparent"}`, textAlign:"left", position:"relative" }}>
                {/* Icon */}
                <div style={{ width:34, height:34, borderRadius:10, background:isActive?m.color:`${m.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0, transition:"all 0.2s" }}>
                  {m.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"0.8rem", fontWeight:800, color:isActive?m.color:dark?"#9FE1CB":"#2E4057", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {m.name[lang]||m.name.en}
                    {i===0 && <span style={{ marginLeft:5, fontSize:"0.55rem", background:"#EF9F27", color:"#fff", borderRadius:4, padding:"1px 5px", fontWeight:900, verticalAlign:"middle" }}>TOP</span>}
                  </div>
                  <div style={{ marginTop:4, height:3, background:dark?"rgba(255,255,255,0.06)":"#F0F4F8", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${sc}%`, background:m.color, borderRadius:99 }}/>
                  </div>
                  <div style={{ fontSize:"0.65rem", fontWeight:800, color:m.color, marginTop:2 }}>{sc}%</div>
                </div>
              </button>
            );
          })}
          <div style={{ padding:"12px", marginTop:4, borderTop:`1px solid ${bdr}` }}>
            <button onClick={()=>setPage("quiz")} style={{ width:"100%", padding:"8px", border:`1.5px solid ${dark?"rgba(239,159,39,0.3)":"rgba(239,159,39,0.4)"}`, borderRadius:10, background:"transparent", color:"#EF9F27", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.75rem", cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,159,39,0.08)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
              {L.retake}
            </button>
          </div>
        </div>

        {/* ── Content panel ── */}
        <div style={{ flex:1, padding:"24px", minWidth:0 }} key={`${talent}-${animKey}`}>

          {/* Talent hero card */}
          <div style={{ background:`linear-gradient(135deg,${td.color}10,${td.color}06)`, border:`1.5px solid ${td.color}33`, borderRadius:20, padding:"20px 22px", marginBottom:20, display:"flex", alignItems:"center", gap:16, animation:"fadeSlide 0.35s ease both" }}>
            <div style={{ width:56, height:56, borderRadius:18, background:td.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.8rem", flexShrink:0, boxShadow:`0 8px 24px ${td.color}44` }}>
              {td.icon}
            </div>
            <div style={{ flex:1 }}>
              <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.35rem", color:td.color, marginBottom:4 }}>
                {td.name[lang]||td.name.en}
              </h2>
              <p style={{ fontSize:"0.84rem", color:muted, fontWeight:600, lineHeight:1.5, margin:0 }}>
                {td.desc[lang]||td.desc.en}
              </p>
            </div>
            <div style={{ textAlign:"center", background:td.color, color:"#fff", borderRadius:14, padding:"12px 18px", flexShrink:0, boxShadow:`0 6px 20px ${td.color}44` }}>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", lineHeight:1 }}>{score}%</div>
              <div style={{ fontSize:"0.62rem", fontWeight:800, opacity:0.85, textTransform:"uppercase", letterSpacing:"0.08em" }}>{L.score}</div>
            </div>
          </div>

          {/* Section tabs */}
          <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
            {Object.entries(L.sections||{}).map(([key, label]) => {
              const isActive = section===key;
              return (
                <button key={key} className="sec-pill" onClick={()=>setSection(key)}
                  style={{ padding:"8px 18px", border:`2px solid ${isActive?td.color:dark?"rgba(255,255,255,0.08)":"#E8F5EE"}`, borderRadius:99, background:isActive?td.color:"transparent", color:isActive?"#fff":muted, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.82rem", cursor:"pointer", display:"flex", alignItems:"center", gap:6, boxShadow:isActive?`0 4px 14px ${td.color}44`:"none" }}>
                  <span style={{ fontSize:"0.9rem" }}>{SECTION_ICONS[key]}</span>
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── TIPS ── */}
          {section==="tips" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10, animation:"fadeSlide 0.3s ease both" }}>
              {(td.tips[lang]||td.tips.en||[]).map((tip,i) => (
                <div key={i} className="tip-row"
                  style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"14px 18px", background:card, borderRadius:14, border:`1.5px solid ${bdr}`, animation:`popIn 0.3s ease ${i*0.06}s both` }}>
                  <div style={{ width:30, height:30, borderRadius:10, background:td.color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fredoka One',cursive", fontSize:"0.9rem", flexShrink:0, boxShadow:`0 4px 10px ${td.color}44` }}>{i+1}</div>
                  <span style={{ fontWeight:700, color:dark?"#E1F5EE":"#2E4057", lineHeight:1.6, fontSize:"0.9rem", paddingTop:4 }}>{tip}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── COURSES ── */}
          {section==="courses" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, animation:"fadeSlide 0.3s ease both" }}>
              {(td.courses[lang]||td.courses.en||[]).map((c,i) => (
                <div key={i} className="course-card"
                  style={{ padding:"16px 18px", background:card, borderRadius:14, border:`1.5px solid ${bdr}`, display:"flex", alignItems:"center", gap:12, animation:`popIn 0.3s ease ${i*0.07}s both`, "--c":td.color }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${td.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0 }}>📖</div>
                  <span style={{ fontWeight:700, color:dark?"#E1F5EE":"#2E4057", fontSize:"0.85rem", lineHeight:1.4 }}>{c}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── CAREERS ── */}
          {section==="careers" && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, animation:"fadeSlide 0.3s ease both" }}>
              {(td.careers[lang]||td.careers.en||[]).map((c,i) => (
                <div key={i} className="career-chip"
                  style={{ padding:"10px 20px", background:`${td.color}12`, border:`1.5px solid ${td.color}44`, borderRadius:99, fontWeight:800, color:td.color, fontSize:"0.88rem", animation:`popIn 0.3s ease ${i*0.05}s both`, boxShadow:`0 2px 8px ${td.color}20` }}>
                  {c}
                </div>
              ))}
            </div>
          )}

          {/* ── UNIVERSITIES ── */}
          {section==="universities" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, animation:"fadeSlide 0.3s ease both" }}>
              {(td.universities[lang]||td.universities.en||[]).map((u,i) => (
                <div key={i} className="uni-card"
                  style={{ padding:"16px 18px", background:card, borderRadius:14, border:`1.5px solid ${bdr}`, fontWeight:700, color:dark?"#E1F5EE":"#2E4057", fontSize:"0.88rem", animation:`popIn 0.3s ease ${i*0.07}s both` }}>
                  {u}
                </div>
              ))}
            </div>
          )}

          {/* ── WEEKLY ── */}
          {section==="weekly" && (
            <div style={{ animation:"fadeSlide 0.3s ease both" }}>
              <p style={{ fontSize:"0.75rem", fontWeight:800, color:muted, marginBottom:14, textTransform:"uppercase", letterSpacing:"0.1em" }}>
                📅 {lang==="ru"?"Твой план на эту неделю":lang==="uz"?"Bu hafta uchun rejangiz":"Your plan for this week"}
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
                {(td.weekly[lang]||td.weekly.en||[]).map((day,i) => (
                  <div key={i}
                    style={{ background:card, borderRadius:14, padding:"12px 6px", textAlign:"center", border:`1.5px solid ${td.color}33`, animation:`popIn 0.3s ease ${i*0.05}s both` }}>
                    <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"0.82rem", color:td.color, marginBottom:6 }}>{DAYS[lang]?.[i]||DAYS.en[i]}</div>
                    <div style={{ fontSize:"0.65rem", fontWeight:700, color:muted, lineHeight:1.4 }}>{day}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
