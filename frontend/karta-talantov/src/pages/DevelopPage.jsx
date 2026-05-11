import { useState } from "react";
import Nav from "../components/Nav";

// ── Full talent development database ──────────────────────────────────────────
const TALENT_DATA = {
  logic: {
    icon:"🧠", color:"#1565C0",
    name:{ ru:"Логика", uz:"Mantiq", en:"Logic" },
    desc:{ ru:"Твой мозг — настоящий процессор! Ты видишь закономерности там, где другие видят хаос.", uz:"Sizning miyangiz haqiqiy protsessor! Siz boshqalar aralashib ketgan joyda qonuniyatlarni ko'rasiz.", en:"Your brain is a real processor! You see patterns where others see chaos." },
    careers:{ ru:["Программист","Data Scientist","Математик","Инженер","Финансист","Учёный","Архитектор","Пилот"], uz:["Dasturchi","Data Scientist","Matematik","Muhandis","Moliyachi","Olim"], en:["Programmer","Data Scientist","Mathematician","Engineer","Financier","Scientist","Architect","Pilot"] },
    tips:{ ru:["Решай задачи на LeetCode или Codeforces ежедневно","Изучи Python или JavaScript — начни с Khan Academy","Играй в шахматы, го или стратегические игры","Читай книги по алгоритмам и логике","Участвуй в олимпиадах по математике и информатике"], uz:["LeetCode yoki Codeforces da kundalik masalalar yeching","Python yoki JavaScript o'rganing — Khan Academy dan boshlang","Shaxmat, go yoki strategik o'yinlar o'ynang","Algoritmlar va mantiq bo'yicha kitoblar o'qing"], en:["Solve daily problems on LeetCode or Codeforces","Learn Python or JavaScript — start with Khan Academy","Play chess, go or strategy games","Read books on algorithms and logic","Join math and programming olympiads"] },
    courses:{ ru:["CS50 (Harvard, бесплатно)","Khan Academy — Математика","Coursera — Алгоритмы (Stanford)","Scratch.mit.edu — начало программирования","Code.org — для начинающих"], uz:["CS50 (Harvard, bepul)","Khan Academy — Matematika","Coursera — Algoritmlar (Stanford)","Scratch.mit.edu","Code.org"], en:["CS50 (Harvard, free)","Khan Academy — Mathematics","Coursera — Algorithms (Stanford)","Scratch.mit.edu","Code.org"] },
    universities:{ ru:["🇺🇸 MIT — Computer Science","🇺🇸 Stanford — AI & ML","🇷🇺 ИТМО — Олимпиадное программирование","🇺🇿 INHA University Tashkent","🇺🇸 Carnegie Mellon — CS"], uz:["🇺🇸 MIT — Computer Science","🇺🇸 Stanford — AI & ML","🇺🇿 INHA University Toshkent","🇷🇺 ITMO — Olimpiada dasturlash"], en:["🇺🇸 MIT — Computer Science","🇺🇸 Stanford — AI & ML","🇬🇧 Oxford — Mathematics","🇺🇿 INHA University Tashkent","🇺🇸 Carnegie Mellon"] },
    weekly:{ ru:["Пн: 30 мин LeetCode","Вт: Читай алгоритмы","Ср: Строй проект на Python","Чт: Шахматы онлайн","Пт: Новая тема CS50","Сб: Олимпиадная задача","Вс: Разбор ошибок недели"], en:["Mon: 30min LeetCode","Tue: Read algorithms","Wed: Build Python project","Thu: Chess online","Fri: New CS50 topic","Sat: Olympiad problem","Sun: Review week's mistakes"] },
  },
  creativity: {
    icon:"🎨", color:"#E64A19",
    name:{ ru:"Творчество", uz:"Ijodkorlik", en:"Creativity" },
    desc:{ ru:"Ты видишь мир не таким, какой он есть, а таким, каким он может быть. Это редкий дар!", uz:"Siz dunyoni bor holida emas, balki bo'lishi mumkin bo'lgan holda ko'rasiz. Bu kamyob sovg'a!", en:"You see the world not as it is, but as it could be. That's a rare gift!" },
    careers:{ ru:["Дизайнер","UX/UI","Художник","Архитектор","Режиссёр","Геймдизайнер","Иллюстратор","Аниматор","Модельер"], uz:["Dizayner","UX/UI","Rassom","Arxitektor","Rejissyor","O'yin dizayneri","Illustrator","Animator"], en:["Designer","UX/UI","Artist","Architect","Director","Game Designer","Illustrator","Animator","Fashion Designer"] },
    tips:{ ru:["Рисуй каждый день — хотя бы 15 минут","Изучи Figma, Canva или Adobe XD","Веди скетчбук — записывай идеи и зарисовки","Смотри фильмы и анализируй визуальный стиль","Создай собственный проект — сайт, комикс, игру"], uz:["Har kuni chizing — kamida 15 daqiqa","Figma, Canva yoki Adobe XD o'rganing","Sketchbook yuriing — g'oyalar va rasmlar","Filmlar tomosha qiling va vizual uslubni tahlil qiling"], en:["Draw every day — even 15 minutes","Learn Figma, Canva or Adobe XD","Keep a sketchbook — record ideas and sketches","Watch films and analyse visual style","Create your own project — website, comic, game"] },
    courses:{ ru:["Canva Design School (бесплатно)","Figma — официальные туториалы","Skillshare — иллюстрация","Adobe Creative Cloud — студентам","Behance — вдохновение и портфолио"], uz:["Canva Design School (bepul)","Figma — rasmiy qo'llanmalar","Skillshare — illustratsiya","Adobe Creative Cloud — talabalar uchun"], en:["Canva Design School (free)","Figma — official tutorials","Skillshare — illustration","Adobe Creative Cloud — students","Behance — inspiration & portfolio"] },
    universities:{ ru:["🇺🇸 Rhode Island School of Design","🇬🇧 Central Saint Martins","🇺🇿 O'zDSMI Tashkent","🇷🇺 МГХПА Строганова","🇩🇪 Bauhaus-Universität Weimar"], uz:["🇺🇸 Rhode Island School of Design","🇬🇧 Central Saint Martins","🇺🇿 O'zDSMI Toshkent","🇷🇺 MGXPA Stroganova"], en:["🇺🇸 Rhode Island School of Design","🇬🇧 Central Saint Martins","🇺🇸 Parsons School of Design","🇩🇪 Bauhaus-Universität Weimar"] },
    weekly:{ ru:["Пн: 15 мин рисования","Вт: Изучи новый инструмент Figma","Ср: Анализ дизайна любимого сайта","Чт: Создай мудборд","Пт: Новый скетч-проект","Сб: Посмотри documentary о дизайне","Вс: Обновить портфолио"], en:["Mon: 15min drawing","Tue: Learn a new Figma tool","Wed: Analyse a favourite website's design","Thu: Create a moodboard","Fri: New sketch project","Sat: Watch a design documentary","Sun: Update portfolio"] },
  },
  memory: {
    icon:"🃏", color:"#7E57C2",
    name:{ ru:"Память", uz:"Xotira", en:"Memory" },
    desc:{ ru:"Твоя память — настоящее хранилище знаний! Ты легко запоминаешь детали, факты и события.", uz:"Sizning xotirangiz haqiqiy bilimlar ombori! Siz tafsilotlar, faktlar va voqealarni osonlikcha yodlaysiz.", en:"Your memory is a true knowledge vault! You easily remember details, facts and events." },
    careers:{ ru:["Врач","Юрист","Переводчик","Историк","Учёный","Нотариус","Фармацевт","Библиотекарь"], uz:["Shifokor","Yurist","Tarjimon","Tarixchi","Olim","Notarius","Farmatsevt"], en:["Doctor","Lawyer","Translator","Historian","Scientist","Notary","Pharmacist"] },
    tips:{ ru:["Используй метод 'Дворца памяти' (как Шерлок Холмс)","Повторяй материал через интервалы (приложение Anki)","Учи стихи и тексты наизусть","Играй в игры на запоминание карточек","Веди подробный дневник — это тренирует память"], uz:["'Xotira saroyi' usulidan foydalaning","Anki ilovasi bilan intervalli takrorlash","She'rlar va matnlarni yod oling","Kartochkalarni yodlash o'yinlarini o'ynang"], en:["Use the 'Memory Palace' technique (like Sherlock Holmes)","Review material at intervals (Anki app)","Memorise poems and texts","Play card memory games","Keep a detailed journal — it trains memory"] },
    courses:{ ru:["Anki — интервальные повторения (бесплатно)","Coursera — Learning How to Learn","YouTube — метод Дворца памяти","Duolingo — языки через повторение","moonlighter.app — карточки"], uz:["Anki — intervalli takrorlash (bepul)","Coursera — Learning How to Learn","YouTube — Xotira saroyi usuli","Duolingo — takrorlash orqali tillar"], en:["Anki — spaced repetition (free)","Coursera — Learning How to Learn","YouTube — Memory Palace method","Duolingo — languages through repetition"] },
    universities:{ ru:["🇺🇸 Harvard Medical School","🇬🇧 Oxford — Psychology","🇷🇺 МГУ — Психология","🇺🇿 NUUz — Медицина","🇺🇸 Johns Hopkins — Medicine"], uz:["🇺🇸 Harvard Medical School","🇬🇧 Oxford — Psixologiya","🇷🇺 MGU — Psixologiya","🇺🇿 NUUz — Tibbiyot"], en:["🇺🇸 Harvard Medical School","🇬🇧 Oxford — Psychology","🇺🇸 Johns Hopkins — Medicine","🇺🇿 NUUz — Medicine"] },
    weekly:{ ru:["Пн: 20 карточек Anki","Вт: Выучи стихотворение","Ср: Дворец памяти — новая комната","Чт: Повтори прошлую неделю","Пт: Игра на запоминание","Сб: Запомни 10 новых слов языка","Вс: Дневник достижений"], en:["Mon: 20 Anki cards","Tue: Memorise a poem","Wed: Memory Palace — new room","Thu: Review last week","Fri: Memory game","Sat: Memorise 10 new words","Sun: Achievement journal"] },
  },
  leadership: {
    icon:"👑", color:"#F9A825",
    name:{ ru:"Лидерство", uz:"Liderlik", en:"Leadership" },
    desc:{ ru:"Ты рождён вести за собой! Люди тянутся к тебе, ты умеешь вдохновлять и организовывать.", uz:"Siz rahbarlik qilish uchun tug'ilgansiz! Odamlar sizga intiladi, siz ilhomlantirishni va tashkil qilishni bilasiz.", en:"You were born to lead! People are drawn to you, you know how to inspire and organise." },
    careers:{ ru:["Предприниматель","CEO","Политик","Менеджер","HR-директор","Дипломат","Тренер","Педагог"], uz:["Tadbirkor","CEO","Siyosatchi","Menejer","HR-direktor","Diplomat","Murabbiy","Pedagog"], en:["Entrepreneur","CEO","Politician","Manager","HR Director","Diplomat","Coach","Educator"] },
    tips:{ ru:["Организуй мероприятие в школе или районе","Вступи в дебатный клуб или студсовет","Читай биографии великих лидеров","Учись активному слушанию — это ключ к лидерству","Веди команду в любом групповом проекте"], uz:["Maktab yoki mahallada tadbir tashkil qiling","Debat klubi yoki talaba kengashiga kiring","Buyuk liderlar tarjimai holini o'qing","Faol tinglashni o'rganing — bu liderlikning asosi"], en:["Organise an event at school or in your community","Join a debate club or student council","Read biographies of great leaders","Learn active listening — it's the key to leadership","Lead a team in any group project"] },
    courses:{ ru:["Coursera — Leadership (Yale)","edX — Emotional Intelligence (Harvard)","YouTube — TED Talks о лидерстве","Toastmasters — публичные выступления","Khan Academy — Экономика и бизнес"], uz:["Coursera — Liderlik (Yale)","edX — Hissiy intellekt (Harvard)","YouTube — TED Talks liderlik haqida","Toastmasters — jamoat oldida nutq"], en:["Coursera — Leadership (Yale)","edX — Emotional Intelligence (Harvard)","YouTube — TED Talks on Leadership","Toastmasters — public speaking","Khan Academy — Economics & Business"] },
    universities:{ ru:["🇺🇸 Harvard Business School","🇺🇸 Wharton (UPenn)","🇬🇧 London Business School","🇺🇿 Westminster Tashkent","🇺🇿 TSUE"], uz:["🇺🇸 Harvard Business School","🇺🇸 Wharton (UPenn)","🇬🇧 London Business School","🇺🇿 Westminster Toshkent","🇺🇿 TDIU"], en:["🇺🇸 Harvard Business School","🇺🇸 Wharton (UPenn)","🇬🇧 London Business School","🇸🇬 INSEAD","🇺🇿 Westminster Tashkent"] },
    weekly:{ ru:["Пн: Прочитай главу биографии лидера","Вт: Возьми инициативу в группе","Ср: TED Talk + разбор идей","Чт: Напиши план своего проекта","Пт: Практика публичного выступления","Сб: Встреча с командой/друзьями","Вс: Рефлексия недели"], en:["Mon: Read a chapter of a leader's biography","Tue: Take initiative in a group","Wed: TED Talk + idea breakdown","Thu: Write your project plan","Fri: Public speaking practice","Sat: Team/friends meeting","Sun: Weekly reflection"] },
  },
  languages: {
    icon:"🌍", color:"#00838F",
    name:{ ru:"Языки", uz:"Tillar", en:"Languages" },
    desc:{ ru:"Языки — твоя суперсила! Каждый новый язык открывает целый новый мир мышления и культуры.", uz:"Tillar — sizning superkuchingiz! Har bir yangi til butun yangi fikrlash va madaniyat dunyosini ochadi.", en:"Languages are your superpower! Every new language opens a whole new world of thinking and culture." },
    careers:{ ru:["Переводчик","Дипломат","Журналист","Писатель","Лингвист","Учитель языков","Международный менеджер"], uz:["Tarjimon","Diplomat","Jurnalist","Yozuvchi","Tilshunos","Til o'qituvchisi","Xalqaro menejer"], en:["Translator","Diplomat","Journalist","Writer","Linguist","Language Teacher","International Manager"] },
    tips:{ ru:["Смотри фильмы и сериалы без субтитров","Используй Duolingo каждый день — хотя бы 10 мин","Найди носителя языка для разговорной практики","Читай книги на языке, который учишь","Веди дневник на иностранном языке"], uz:["Filmlar va seriallar subtitrsiz tomosha qiling","Duolingo ni har kuni ishlating — kamida 10 daqiqa","Til sohibini topib, og'zaki amaliyot qiling","O'rganayotgan tilda kitoblar o'qing"], en:["Watch films and series without subtitles","Use Duolingo daily — even 10 minutes","Find a native speaker for conversation practice","Read books in the language you're learning","Keep a diary in a foreign language"] },
    courses:{ ru:["Duolingo (бесплатно)","italki — уроки с носителями","Coursera — Linguistics (UPenn)","BBC Learning English (бесплатно)","LingQ — чтение на языке"], uz:["Duolingo (bepul)","italki — ona tili so'zlovchilari bilan darslar","Coursera — Tilshunoslik (UPenn)","BBC Learning English (bepul)"], en:["Duolingo (free)","italki — lessons with native speakers","Coursera — Linguistics (UPenn)","BBC Learning English (free)","LingQ — reading in target language"] },
    universities:{ ru:["🇺🇸 Georgetown — Дипломатия","🇷🇺 МГИМО","🇬🇧 Cambridge — Лингвистика","🇺🇿 O'zDJTU","🇫🇷 Sciences Po Paris"], uz:["🇺🇸 Georgetown — Diplomatiya","🇷🇺 MGIMO","🇬🇧 Cambridge — Tilshunoslik","🇺🇿 O'zDJTU"], en:["🇺🇸 Georgetown — Diplomacy","🇬🇧 Cambridge — Linguistics","🇫🇷 Sciences Po Paris","🇺🇿 O'zDJTU","🇺🇸 Middlebury College"] },
    weekly:{ ru:["Пн: 20 мин Duolingo","Вт: Посмотри эпизод сериала на языке","Ср: 15 мин разговорной практики","Чт: Читай статью на языке","Пт: Выучи 10 новых слов","Сб: Напиши параграф на языке","Вс: Разбор грамматики"], en:["Mon: 20min Duolingo","Tue: Watch one episode in target language","Wed: 15min conversation practice","Thu: Read an article in the language","Fri: Learn 10 new words","Sat: Write a paragraph in the language","Sun: Grammar review"] },
  },
  music: {
    icon:"🎵", color:"#2E7D32",
    name:{ ru:"Музыка", uz:"Musiqa", en:"Music" },
    desc:{ ru:"Музыкальный интеллект — это особый дар! Учёные доказали: музыканты имеют более развитые нейронные связи.", uz:"Musiqiy intellekt — bu alohida sovg'a! Olimlar isbotladi: musiqachilar rivojlangan neyron bog'lanishlariga ega.", en:"Musical intelligence is a special gift! Scientists proved: musicians have more developed neural connections." },
    careers:{ ru:["Музыкант","Композитор","Певец","Звукорежиссёр","Дирижёр","Музыкальный продюсер","Учитель музыки"], uz:["Musiqachi","Bastakor","Qo'shiqchi","Ovoz rejissyori","Dirijyor","Musiqa produseri","Musiqa o'qituvchisi"], en:["Musician","Composer","Singer","Sound Engineer","Conductor","Music Producer","Music Teacher"] },
    tips:{ ru:["Занимайся на инструменте 30 минут в день","Слушай разные жанры — классика, джаз, фолк","Записывай свои мелодии и идеи","Изучи нотную грамоту — это основа музыки","Участвуй в школьных или городских концертах"], uz:["Har kuni 30 daqiqa cholg'u asbobida mashq qiling","Turli janrlarni tinglang — klassika, jazz, folk","Melodiya va g'oyalaringizni yozib oling","Notani o'rganing — bu musiqaning asosi"], en:["Practice an instrument 30 minutes daily","Listen to different genres — classical, jazz, folk","Record your melodies and ideas","Learn music notation — it's the foundation","Participate in school or city concerts"] },
    courses:{ ru:["Simply Piano (iPhone/Android)","Yousician — гитара, пианино, укулеле","Coursera — Music Theory (Berklee)","YouTube — chromatic.fm","musictheory.net — бесплатно"], uz:["Simply Piano (iPhone/Android)","Yousician — gitara, piano, ukulele","Coursera — Musiqa nazariyasi (Berklee)","musictheory.net — bepul"], en:["Simply Piano (iPhone/Android)","Yousician — guitar, piano, ukulele","Coursera — Music Theory (Berklee)","YouTube — chromatic.fm","musictheory.net — free"] },
    universities:{ ru:["🇺🇸 Berklee College of Music","🇺🇸 Juilliard School","🇬🇧 Royal Academy of Music","🇺🇿 O'zbekiston Davlat Konservatoriyasi","🇷🇺 Московская консерватория"], uz:["🇺🇸 Berklee College of Music","🇺🇸 Juilliard School","🇬🇧 Royal Academy of Music","🇺🇿 O'zbekiston Davlat Konservatoriyasi"], en:["🇺🇸 Berklee College of Music","🇺🇸 Juilliard School","🇬🇧 Royal Academy of Music","🇦🇺 Sydney Conservatorium","🇺🇿 State Conservatory of Uzbekistan"] },
    weekly:{ ru:["Пн: 30 мин инструмента","Вт: Разбор любимой песни нотами","Ср: Запись своей мелодии","Чт: Слушай классику осознанно","Пт: Musictheory.net — один урок","Сб: Мини-выступление для семьи","Вс: Плейлист новых жанров"], en:["Mon: 30min instrument","Tue: Analyse favourite song notes","Wed: Record your own melody","Thu: Listen to classical music consciously","Fri: Musictheory.net — one lesson","Sat: Mini-performance for family","Sun: New genres playlist"] },
  },
  sport: {
    icon:"🏃", color:"#BF360C",
    name:{ ru:"Спорт", uz:"Sport", en:"Sport" },
    desc:{ ru:"Физическая сила и выносливость — это не просто тело, это дисциплина и характер!", uz:"Jismoniy kuch va chidamlilik — bu nafaqat tana, bu intizom va xarakter!", en:"Physical strength and endurance — it's not just the body, it's discipline and character!" },
    careers:{ ru:["Профессиональный спортсмен","Тренер","Спортивный психолог","Физиотерапевт","Спортивный менеджер","Диетолог","Судья"], uz:["Professional sportchi","Murabbiy","Sport psixologi","Fizioterapevt","Sport menejeri","Diyetolog"], en:["Professional Athlete","Coach","Sports Psychologist","Physiotherapist","Sports Manager","Dietitian","Referee"] },
    tips:{ ru:["Тренируйся 4-5 раз в неделю с планом","Изучи спортивную психологию — она меняет игру","Веди дневник тренировок и прогресса","Питайся правильно — это 70% результата","Участвуй в местных соревнованиях любого уровня"], uz:["Haftasiga 4-5 marta reja bilan mashq qiling","Sport psixologiyasini o'rganing — u o'yinni o'zgartiradi","Mashg'ulot va taraqqiyot kundaligi yuriing","To'g'ri ovqatlaning — bu natijaning 70%"], en:["Train 4-5 times a week with a plan","Study sports psychology — it changes the game","Keep a training and progress journal","Eat right — it's 70% of results","Compete in local events at any level"] },
    courses:{ ru:["Nike Training Club (бесплатно)","Coursera — Sports Science","YouTube — AthleanX","edX — Спортивное питание","Khan Academy — Биология человека"], uz:["Nike Training Club (bepul)","Coursera — Sport fani","YouTube — AthleanX","edX — Sport ovqatlanishi"], en:["Nike Training Club (free)","Coursera — Sports Science","YouTube — AthleanX","edX — Athlete Nutrition","Khan Academy — Human Biology"] },
    universities:{ ru:["🇺🇸 Ohio State — Sports Science","🇬🇧 Loughborough University","🇺🇸 UCLA — Kinesiology","🇷🇺 РГУФКСМИТ","🇺🇿 O'zDSIM Tashkent"], uz:["🇺🇸 Ohio State — Sport fani","🇬🇧 Loughborough University","🇺🇸 UCLA — Kineziologiya","🇺🇿 O'zDSIM Toshkent"], en:["🇺🇸 Ohio State — Sports Science","🇬🇧 Loughborough University","🇺🇸 UCLA — Kinesiology","🇦🇺 University of Queensland","🇺🇿 UzSIPC Tashkent"] },
    weekly:{ ru:["Пн: Тренировка (силовая)","Вт: Восстановление + растяжка","Ср: Кардио + техника","Чт: Командная игра","Пт: Тренировка (выносливость)","Сб: Соревнование или спарринг","Вс: Дневник + план недели"], en:["Mon: Strength training","Tue: Recovery + stretching","Wed: Cardio + technique","Thu: Team game","Fri: Endurance training","Sat: Competition or sparring","Sun: Journal + week planning"] },
  },
  nature: {
    icon:"🌿", color:"#1B5E20",
    name:{ ru:"Природа", uz:"Tabiat", en:"Nature" },
    desc:{ ru:"Ты чувствуешь связь с живым миром! Это фундаментальный интеллект, который помогал людям выжить тысячи лет.", uz:"Siz tirik dunyo bilan bog'liqlikni his qilasiz! Bu odamlarga ming yillar davomida yashashga yordam bergan fundamental intellekt.", en:"You feel a connection to the living world! This is a fundamental intelligence that helped humans survive for thousands of years." },
    careers:{ ru:["Биолог","Эколог","Ветеринар","Ботаник","Зоолог","Лесник","Учёный-природовед","Шеф-повар"], uz:["Biolog","Ekolog","Veterinar","Botanik","Zoolog","O'rmonchi","Tabiat olimi","Oshpaz"], en:["Biologist","Ecologist","Veterinarian","Botanist","Zoologist","Forester","Environmental Scientist","Chef"] },
    tips:{ ru:["Веди дневник наблюдений за природой","Используй iNaturalist для определения видов","Читай о биологии, экологии и зоологии","Участвуй в экологических проектах","Выращивай растения дома или в саду"], uz:["Tabiat kuzatuv kundaligi yuriing","Turlarni aniqlash uchun iNaturalist dan foydalaning","Biologiya, ekologiya va zoologiya o'qing","Ekologik loyihalarda qatnashing","Uyda yoki bog'da o'simliklar o'stirng"], en:["Keep a nature observation journal","Use iNaturalist for species identification","Read about biology, ecology and zoology","Join environmental projects","Grow plants at home or in a garden"] },
    courses:{ ru:["Khan Academy — Биология (бесплатно)","Coursera — Ecology (Duke University)","iNaturalist — определение видов","YouTube — SciShow Nature","edX — Биоразнообразие"], uz:["Khan Academy — Biologiya (bepul)","Coursera — Ekologiya (Duke University)","iNaturalist — turlarni aniqlash","YouTube — SciShow Nature"], en:["Khan Academy — Biology (free)","Coursera — Ecology (Duke University)","iNaturalist — species ID","YouTube — SciShow Nature","edX — Biodiversity"] },
    universities:{ ru:["🇺🇸 UC Berkeley — Biology","🇬🇧 Cambridge — Natural Sciences","🇺🇸 Cornell — Ecology","🇷🇺 МГУ — Биологический факультет","🇺🇿 NUUz — Биология"], uz:["🇺🇸 UC Berkeley — Biologiya","🇬🇧 Cambridge — Tabiiy fanlar","🇺🇸 Cornell — Ekologiya","🇺🇿 NUUz — Biologiya"], en:["🇺🇸 UC Berkeley — Biology","🇬🇧 Cambridge — Natural Sciences","🇺🇸 Cornell — Ecology","🇦🇺 ANU — Environmental Science","🇺🇿 NUUz — Biology"] },
    weekly:{ ru:["Пн: Прогулка — найди 3 новых растения","Вт: Khan Academy — биология","Ср: iNaturalist — загрузи наблюдение","Чт: Читай о любимом животном","Пт: Coursera — один урок экологии","Сб: Волонтёрство в природоохране","Вс: Дневник наблюдений"], en:["Mon: Walk — find 3 new plants","Tue: Khan Academy — biology","Wed: iNaturalist — upload observation","Thu: Read about your favourite animal","Fri: Coursera — one ecology lesson","Sat: Nature conservation volunteering","Sun: Observation journal"] },
  },
  social: {
    icon:"🤝", color:"#4527A0",
    name:{ ru:"Общение", uz:"Muloqot", en:"Social" },
    desc:{ ru:"Ты понимаешь людей лучше, чем они понимают себя! Это мощный эмоциональный интеллект.", uz:"Siz odamlarni ularning o'zidan ko'ra yaxshiroq tushunasiz! Bu kuchli hissiy intellekt.", en:"You understand people better than they understand themselves! This is powerful emotional intelligence." },
    careers:{ ru:["Психолог","Социолог","HR-менеджер","Педагог","Дипломат","Журналист","Тренер","Политик"], uz:["Psixolog","Sotsiolog","HR-menejer","Pedagog","Diplomat","Jurnalist","Murabbiy","Siyosatchi"], en:["Psychologist","Sociologist","HR Manager","Educator","Diplomat","Journalist","Coach","Politician"] },
    tips:{ ru:["Практикуй активное слушание в разговорах","Читай книги по психологии и эмоциям","Волонтёрь — это прокачивает эмпатию","Участвуй в дебатах и публичных выступлениях","Веди дневник эмоций и наблюдений за людьми"], uz:["Suhbatlarda faol tinglashni mashq qiling","Psixologiya va hissiyotlar haqida kitoblar o'qing","Ko'ngillilik — bu empatiyani rivojlantiradi","Debatlar va jamoat oldida nutqlarda qatnashing"], en:["Practice active listening in conversations","Read books on psychology and emotions","Volunteer — it develops empathy","Participate in debates and public speaking","Keep a journal of emotions and observations"] },
    courses:{ ru:["Coursera — Emotional Intelligence (Yale)","edX — Psychology (Harvard)","Toastmasters — публичные выступления","YouTube — TED Talks о психологии","Khan Academy — Психология"], uz:["Coursera — Hissiy intellekt (Yale)","edX — Psixologiya (Harvard)","Toastmasters — jamoat oldida nutq","YouTube — TED Talks psixologiya haqida"], en:["Coursera — Emotional Intelligence (Yale)","edX — Psychology (Harvard)","Toastmasters — public speaking","YouTube — TED Talks on psychology","Khan Academy — Psychology"] },
    universities:{ ru:["🇺🇸 Harvard — Psychology","🇺🇸 Stanford — Sociology","🇬🇧 Oxford — PPE","🇷🇺 МГУ — Психологический факультет","🇺🇿 NUUz — Психология"], uz:["🇺🇸 Harvard — Psixologiya","🇺🇸 Stanford — Sotsiologiya","🇬🇧 Oxford — PPE","🇺🇿 NUUz — Psixologiya"], en:["🇺🇸 Harvard — Psychology","🇺🇸 Stanford — Sociology","🇬🇧 Oxford — PPE","🇬🇧 London School of Economics","🇺🇿 NUUz — Psychology"] },
    weekly:{ ru:["Пн: Прочитай главу по психологии","Вт: Практика активного слушания","Ср: Дневник эмоций дня","Чт: TED Talk о людях и обществе","Пт: Помоги кому-то решить проблему","Сб: Групповое мероприятие","Вс: Рефлексия отношений недели"], en:["Mon: Read a psychology chapter","Tue: Active listening practice","Wed: Emotion journal for the day","Thu: TED Talk on people & society","Fri: Help someone solve a problem","Sat: Group event","Sun: Reflect on the week's relationships"] },
  },
};

const DAYS = {
  ru:["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
  uz:["Du","Se","Ch","Pa","Ju","Sh","Ya"],
  en:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
};

export default function DevelopPage({ setPage, results, lang, dark }) {
  // Get sorted talents from results
  const scores = results?.scores || {};
  const sortedTalents = Object.keys(TALENT_DATA).sort((a,b) => (scores[b]||0)-(scores[a]||0));
  const [activeTab, setActiveTab] = useState(0);
  const [section, setSection] = useState("tips"); // tips | courses | careers | universities | weekly

  const talent     = sortedTalents[activeTab];
  const td         = TALENT_DATA[talent] || TALENT_DATA.logic;
  const score      = Math.round(scores[talent] || 0);
  const hasResults = Object.keys(scores).length > 0;

  const L = {
    ru:{ title:"Развивай таланты", sub:"Персональный план развития на основе твоих результатов", noResults:"Пройди тест чтобы получить персональный план!", takeQuiz:"Пройти тест →", score:"твой результат", topTalent:"Твой топ-талант", sections:{ tips:"💡 Советы", courses:"📚 Курсы", careers:"🚀 Карьеры", universities:"🎓 Университеты", weekly:"📅 Неделя" }, retake:"Пройти заново" },
    uz:{ title:"Iste'dodlarni rivojlantiring", sub:"Natijalaringizga asoslangan shaxsiy rivojlanish rejasi", noResults:"Shaxsiy rejani olish uchun testni topshiring!", takeQuiz:"Testni topshirish →", score:"sizning natijangiz", topTalent:"Sizning top iste'dodingiz", sections:{ tips:"💡 Maslahatlar", courses:"📚 Kurslar", careers:"🚀 Kasblar", universities:"🎓 Universitetlar", weekly:"📅 Hafta" }, retake:"Qaytadan topshirish" },
    en:{ title:"Develop Your Talents", sub:"Personalised development plan based on your results", noResults:"Take the quiz to get your personalised plan!", takeQuiz:"Take quiz →", score:"your score", topTalent:"Your top talent", sections:{ tips:"💡 Tips", courses:"📚 Courses", careers:"🚀 Careers", universities:"🎓 Universities", weekly:"📅 Weekly plan" }, retake:"Retake quiz" },
  }[lang] || {};

  return (
    <div className="page-wrap">
      <style>{`
        @keyframes fadeSlide{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes cardPop{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        .sec-btn:hover{transform:translateY(-2px)!important;box-shadow:0 6px 16px rgba(15,110,86,0.2)!important;}
        .talent-tab:hover{background:rgba(15,110,86,0.08)!important;}
        .tip-item:hover{transform:translateX(6px)!important;border-color:#5DCAA5!important;}
        .uni-item:hover{transform:translateY(-3px)!important;box-shadow:0 8px 20px rgba(15,110,86,0.12)!important;}
      `}</style>

      <Nav page="develop" setPage={setPage} lang={lang} dark={dark} />

      {/* Hero banner */}
      <div style={{ background:`linear-gradient(135deg,${td.color},${td.color}bb)`, padding:"28px 24px", textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", color:"#fff", marginBottom:6 }}>{L.title}</h1>
        <p style={{ color:"rgba(255,255,255,0.85)", fontWeight:600, fontSize:"0.9rem" }}>{L.sub}</p>
      </div>

      {/* No results state */}
      {!hasResults && (
        <div style={{ textAlign:"center", padding:"60px 24px" }}>
          <div style={{ fontSize:"3rem", marginBottom:16 }}>🎯</div>
          <p style={{ fontWeight:700, color:dark?"#9FE1CB":"#546E7A", marginBottom:20, fontSize:"1.05rem" }}>{L.noResults}</p>
          <button onClick={() => setPage("quiz")} className="hero-cta" style={{ display:"inline-block" }}>{L.takeQuiz}</button>
        </div>
      )}

      {hasResults && (
        <div style={{ display:"flex", gap:0, maxWidth:1000, margin:"0 auto", padding:"0 0 40px" }}>

          {/* ── Left sidebar: talent tabs ── */}
          <div style={{ width:160, flexShrink:0, padding:"16px 0", borderRight:`1px solid ${dark?"#2A4070":"#E1F5EE"}` }}>
            {sortedTalents.map((t, i) => {
              const td2 = TALENT_DATA[t];
              const sc  = Math.round(scores[t]||0);
              const isActive = i===activeTab;
              return (
                <button key={t} className="talent-tab"
                  onClick={() => { setActiveTab(i); setSection("tips"); }}
                  style={{ width:"100%", padding:"12px 14px", border:"none", borderLeft:`3px solid ${isActive?td2.color:"transparent"}`, background:isActive?`${td2.color}12`:"transparent", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:4, transition:"all 0.2s" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, width:"100%" }}>
                    <span style={{ fontSize:"1.1rem" }}>{td2.icon}</span>
                    <span style={{ fontWeight:800, fontSize:"0.8rem", color:isActive?td2.color:dark?"#9FE1CB":"#546E7A" }}>
                      {td2.name[lang]||td2.name.en}
                    </span>
                    {i===0 && <span style={{ marginLeft:"auto", fontSize:"0.6rem", background:"#EF9F27", color:"#fff", borderRadius:99, padding:"1px 5px", fontWeight:900 }}>TOP</span>}
                  </div>
                  {/* Score bar */}
                  <div style={{ width:"100%", height:4, background:dark?"#2A4070":"#E1F5EE", borderRadius:99 }}>
                    <div style={{ width:`${sc}%`, height:"100%", background:td2.color, borderRadius:99, transition:"width 0.5s ease" }} />
                  </div>
                  <span style={{ fontSize:"0.68rem", fontWeight:800, color:td2.color }}>{sc}%</span>
                </button>
              );
            })}
            {/* Retake */}
            <button onClick={() => setPage("quiz")}
              style={{ width:"100%", marginTop:8, padding:"10px 14px", border:"none", background:"transparent", cursor:"pointer", fontSize:"0.75rem", fontWeight:800, color:"#EF9F27", textAlign:"left", borderTop:`1px solid ${dark?"#2A4070":"#E1F5EE"}` }}>
              🔄 {L.retake}
            </button>
          </div>

          {/* ── Right: content ── */}
          <div style={{ flex:1, padding:"20px 24px", animation:"fadeSlide 0.3s ease both" }} key={talent}>

            {/* Talent header */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20, padding:"16px 20px", background:dark?"#1A2A3A":`${td.color}08`, borderRadius:18, border:`1.5px solid ${td.color}33` }}>
              <div style={{ fontSize:"2.5rem" }}>{td.icon}</div>
              <div style={{ flex:1 }}>
                <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.4rem", color:td.color, marginBottom:4 }}>
                  {td.name[lang]||td.name.en}
                </h2>
                <p style={{ fontSize:"0.85rem", fontWeight:600, color:dark?"#B0BEC5":"#546E7A", margin:0, lineHeight:1.5 }}>
                  {td.desc[lang]||td.desc.en}
                </p>
              </div>
              <div style={{ textAlign:"center", background:td.color, color:"#fff", borderRadius:16, padding:"10px 16px", flexShrink:0 }}>
                <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", lineHeight:1 }}>{score}%</div>
                <div style={{ fontSize:"0.65rem", fontWeight:800, opacity:0.85 }}>{L.score}</div>
              </div>
            </div>

            {/* Section tabs */}
            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
              {Object.entries(L.sections||{}).map(([key, label]) => (
                <button key={key} className="sec-btn"
                  onClick={() => setSection(key)}
                  style={{ padding:"8px 16px", border:`2px solid ${section===key?td.color:dark?"#2A4070":"#E1F5EE"}`, borderRadius:99, background:section===key?td.color:"transparent", color:section===key?"#fff":dark?"#9FE1CB":"#546E7A", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.82rem", cursor:"pointer", transition:"all 0.2s" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── TIPS ── */}
            {section==="tips" && (
              <div style={{ animation:"fadeSlide 0.25s ease both" }}>
                {(td.tips[lang]||td.tips.en||[]).map((tip,i) => (
                  <div key={i} className="tip-item"
                    style={{ padding:"14px 18px", marginBottom:10, background:dark?"#1A2A3A":"#fff", borderRadius:14, border:`1.5px solid ${dark?"#2A4070":"#E1F5EE"}`, display:"flex", gap:12, alignItems:"flex-start", transition:"all 0.2s" }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:td.color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fredoka One',cursive", fontSize:"0.85rem", flexShrink:0 }}>{i+1}</div>
                    <span style={{ fontWeight:700, color:dark?"#E1F5EE":"#2E4057", lineHeight:1.5, fontSize:"0.9rem" }}>{tip}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── COURSES ── */}
            {section==="courses" && (
              <div style={{ animation:"fadeSlide 0.25s ease both", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {(td.courses[lang]||td.courses.en||[]).map((c,i) => (
                  <div key={i} style={{ padding:"16px", background:dark?"#1A2A3A":"#fff", borderRadius:14, border:`1.5px solid ${td.color}33`, display:"flex", alignItems:"center", gap:10, animation:`cardPop 0.3s ${i*0.06}s both` }}>
                    <span style={{ fontSize:"1.3rem" }}>📖</span>
                    <span style={{ fontWeight:700, color:dark?"#E1F5EE":"#2E4057", fontSize:"0.85rem", lineHeight:1.4 }}>{c}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── CAREERS ── */}
            {section==="careers" && (
              <div style={{ animation:"fadeSlide 0.25s ease both", display:"flex", flexWrap:"wrap", gap:10 }}>
                {(td.careers[lang]||td.careers.en||[]).map((c,i) => (
                  <div key={i} style={{ padding:"10px 18px", background:`${td.color}12`, border:`1.5px solid ${td.color}44`, borderRadius:99, fontWeight:800, color:td.color, fontSize:"0.88rem", animation:`cardPop 0.3s ${i*0.05}s both` }}>
                    {c}
                  </div>
                ))}
              </div>
            )}

            {/* ── UNIVERSITIES ── */}
            {section==="universities" && (
              <div style={{ animation:"fadeSlide 0.25s ease both", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {(td.universities[lang]||td.universities.en||[]).map((u,i) => (
                  <div key={i} className="uni-item"
                    style={{ padding:"16px", background:dark?"#1A2A3A":"#fff", borderRadius:14, border:`1.5px solid ${dark?"#2A4070":"#E1F5EE"}`, fontWeight:700, color:dark?"#E1F5EE":"#2E4057", fontSize:"0.88rem", transition:"all 0.2s", animation:`cardPop 0.3s ${i*0.07}s both` }}>
                    {u}
                  </div>
                ))}
              </div>
            )}

            {/* ── WEEKLY PLAN ── */}
            {section==="weekly" && (
              <div style={{ animation:"fadeSlide 0.25s ease both" }}>
                <p style={{ fontSize:"0.82rem", fontWeight:800, color:dark?"#9FE1CB":"#78909C", marginBottom:14, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                  📅 {lang==="ru"?"Твой план на эту неделю":lang==="uz"?"Bu hafta uchun rejangiz":"Your plan for this week"}
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
                  {(td.weekly[lang]||td.weekly.en||[]).map((day,i) => (
                    <div key={i} style={{ background:dark?"#1A2A3A":"#fff", borderRadius:14, padding:"12px 8px", textAlign:"center", border:`1.5px solid ${td.color}33`, animation:`cardPop 0.3s ${i*0.05}s both` }}>
                      <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"0.9rem", color:td.color, marginBottom:6 }}>{DAYS[lang]?.[i]||DAYS.en[i]}</div>
                      <div style={{ fontSize:"0.7rem", fontWeight:700, color:dark?"#B0BEC5":"#546E7A", lineHeight:1.4 }}>{day}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
