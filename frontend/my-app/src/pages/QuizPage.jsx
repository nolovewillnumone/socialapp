import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Loader from "../components/Loader";
import { quizAPI } from "../api/client";

// ── Story chapters — each chapter is a "mission" ─────────────────────────────
// Questions are woven into a narrative adventure
const STORY = {
  ru: {
    intro: {
      title: "Добро пожаловать, исследователь! 🚀",
      text: "Ты отправляешься в экспедицию по планете Талантов. Каждая зона раскроет новую суперсилу. Готов начать миссию?",
      btn: "Начать экспедицию →",
      mascot: "🌟",
    },
    chapters: [
      {
        id: "ch1",
        zone: "Зона Логики",
        emoji: "🧠",
        color: "#1565C0",
        bg: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
        intro: "Ты прибыл в Логический Лабиринт. Здесь живут числа и паттерны. Реши загадки, чтобы пройти дальше!",
        questions: [
          {
            id: "q1", talent: "logic",
            mission: "Загадка #1 — Числовой код",
            q: "Чтобы открыть дверь лабиринта, введи следующее число: 2, 4, 8, 16, __",
            hint: "Stanford-Binet: геометрическая прогрессия",
            opts: ["24", "32", "30", "28"],
            score_map: [0.1, 1.0, 0.1, 0.1],
          },
          {
            id: "q2", talent: "logic",
            mission: "Загадка #2 — Логический замок",
            q: "Охранник задал вопрос: «Если все врачи — учёные, и некоторые учёные — художники, то...»",
            hint: "Stanford-Binet: силлогизм",
            opts: ["Все врачи — художники", "Некоторые врачи могут быть художниками", "Ни один врач не художник", "Нельзя определить"],
            score_map: [0.0, 0.7, 0.1, 1.0],
          },
          {
            id: "q3", talent: "logic",
            mission: "Финальный вызов Лабиринта — Часы времени",
            q: "Последняя загадка! Хранитель спрашивает: какой угол между стрелками часов ровно в 3:00?",
            hint: "MIT Cognitive Assessment",
            opts: ["60°", "90°", "120°", "75°"],
            score_map: [0.0, 1.0, 0.0, 0.0],
          },
        ],
        complete: "Отлично! Ты прошёл Логический Лабиринт! 🏆 Твой мозг работает как суперкомпьютер!",
      },
      {
        id: "ch2",
        zone: "Пещера Памяти",
        emoji: "🃏",
        color: "#7E57C2",
        bg: "linear-gradient(135deg, #EDE7F6, #D1C4E9)",
        intro: "Добро пожаловать в Пещеру Памяти! Здесь хранятся все воспоминания мира. Тебе нужно найти правильные артефакты!",
        questions: [
          {
            id: "q4", talent: "memory",
            mission: "Артефакт #1 — Кристалл слов",
            q: "Кристалл показал тебе слова: ЯБЛОКО, КНИГА, РЕКА, ПТИЦА. Молния стёрла третье слово. Какое оно?",
            hint: "Wechsler Memory Scale",
            opts: ["ЯБЛОКО", "КНИГА", "РЕКА", "ПТИЦА"],
            score_map: [0.0, 0.0, 1.0, 0.0],
          },
          {
            id: "q5", talent: "memory",
            mission: "Артефакт #2 — Свиток знаний",
            q: "Мудрец пещеры спрашивает: «Когда ты вспоминаешь, что ел вчера — какую память ты используешь?»",
            hint: "Tulving's Memory Theory (Toronto)",
            opts: ["Процедурную (навыки)", "Семантическую (факты)", "Эпизодическую (события жизни)", "Кратковременную"],
            score_map: [0.1, 0.2, 1.0, 0.2],
          },
          {
            id: "q6", talent: "memory",
            mission: "Финальное испытание Пещеры — Зеркало времени",
            q: "Зеркало показало цифры: 7-3-9-1-5. Произнеси их ЗАДОМ НАПЕРЁД, чтобы выйти!",
            hint: "Wechsler: Digit Span Backward",
            opts: ["5-1-9-3-7", "7-3-9-1-5", "5-9-1-3-7", "1-5-9-3-7"],
            score_map: [1.0, 0.0, 0.0, 0.0],
          },
        ],
        complete: "Невероятно! Ты покорил Пещеру Памяти! 🎉 Твоя память — как библиотека Гарварда!",
      },
      {
        id: "ch3",
        zone: "Остров Творчества",
        emoji: "🎨",
        color: "#FF7043",
        bg: "linear-gradient(135deg, #FFF8E1, #FFE0B2)",
        intro: "Ты приплыл на Остров Творчества! Здесь нет правильных ответов — только воображение. Покажи, на что способен твой разум!",
        questions: [
          {
            id: "q7", talent: "creativity",
            mission: "Вызов #1 — Башня идей",
            q: "Житель острова придумал 50 применений для кирпича. Какой тип мышления он демонстрирует?",
            hint: "Torrance Tests of Creative Thinking",
            opts: ["Логическое мышление", "Дивергентное мышление (креативность)", "Музыкальный слух", "Лингвистику"],
            score_map: [0.1, 1.0, 0.0, 0.1],
          },
          {
            id: "q8", talent: "creativity",
            mission: "Вызов #2 — Мастерская изобретателя",
            q: "Великий изобретатель острова говорит: первый шаг к любому открытию — это...",
            hint: "Stanford d.school Design Thinking",
            opts: ["Глубоко понять проблему пользователя (эмпатия)", "Сразу начать строить прототип", "Написать подробный план", "Найти деньги на проект"],
            score_map: [1.0, 0.5, 0.2, 0.1],
          },
          {
            id: "q9", talent: "creativity",
            mission: "Финальный вызов Острова — Метод Волшебника",
            q: "Волшебник острова использует технику SCAMPER. Что она означает?",
            hint: "MIT Media Lab Creativity Assessment",
            opts: ["Замени, объедини, адаптируй, измени, используй иначе, устрани, переставь", "Скопируй лучшие идеи других", "Следуй мнению большинства", "Используй первую идею"],
            score_map: [1.0, 0.0, 0.0, 0.1],
          },
        ],
        complete: "Потрясающе! Остров Творчества покорён! 🌈 Твоё воображение безгранично!",
      },
      {
        id: "ch4",
        zone: "Замок Лидерства",
        emoji: "👑",
        color: "#FFB300",
        bg: "linear-gradient(135deg, #FFF8E1, #FFECB3)",
        intro: "Перед тобой — Замок Лидерства! Здесь живут короли и королевы, которые вдохновляют других. Докажи, что ты достоин войти!",
        questions: [
          {
            id: "q10", talent: "leadership",
            mission: "Испытание #1 — Зал Мудрости",
            q: "Советник короля спрашивает: в твоей команде конфликт. Что делает мудрый лидер?",
            hint: "Harvard Leadership Assessment",
            opts: ["Выслушает всех и найдёт компромисс", "Навяжет своё мнение", "Проигнорирует конфликт", "Уйдёт и оставит всех разбираться"],
            score_map: [1.0, 0.2, 0.0, 0.0],
          },
          {
            id: "q11", talent: "leadership",
            mission: "Испытание #2 — Трон Эмоций",
            q: "Придворный мудрец задаёт вопрос: учёный Гоулман из Гарварда доказал, что сильнейшее оружие лидера — это...",
            hint: "Goleman EQ Framework (Harvard/Yale)",
            opts: ["Высокий IQ", "Эмоциональный интеллект (EQ)", "Физическая сила", "Технические знания"],
            score_map: [0.2, 1.0, 0.0, 0.2],
          },
          {
            id: "q12", talent: "leadership",
            mission: "Финальное испытание Замка — Корона Трансформации",
            q: "Последний страж замка спрашивает: что отличает Трансформационного лидера от Транзакционного?",
            hint: "MIT Sloan Leadership Study (Bass, 1985)",
            opts: ["Работает только через задачи и награды", "Вдохновляет людей и показывает видение будущего", "Устанавливает жёсткий контроль", "Принимает решения в одиночку"],
            score_map: [0.1, 1.0, 0.1, 0.0],
          },
        ],
        complete: "Корона твоя! 👑 Ты доказал качества настоящего лидера!",
      },
      {
        id: "ch5",
        zone: "Башня Языков",
        emoji: "🌍",
        color: "#26C6DA",
        bg: "linear-gradient(135deg, #E0F7FA, #B2EBF2)",
        intro: "Башня Языков уходит в облака! Каждый этаж — новый язык мира. Покажи свои лингвистические способности!",
        questions: [
          {
            id: "q13", talent: "languages",
            mission: "Этаж #1 — Зал Слов",
            q: "Хранитель башни спрашивает: слово «ephemeral» означает...",
            hint: "Cambridge Language Aptitude Test",
            opts: ["Вечный", "Мимолётный, краткосрочный", "Мощный", "Глубокий"],
            score_map: [0.0, 1.0, 0.0, 0.0],
          },
          {
            id: "q14", talent: "languages",
            mission: "Финальный этаж — Вершина Полиглота",
            q: "На вершине башни спрашивают: на скольких языках ты можешь общаться?",
            hint: "Oxford CEFR Language Framework",
            opts: ["Только на родном", "На 2 языках (родной + 1 иностранный)", "На 3 языках (минимум B1)", "На 4+ языках (C1+ в одном)"],
            score_map: [0.1, 0.4, 0.75, 1.0],
          },
        ],
        complete: "Вершина покорена! 🌍 Ты настоящий полиглот башни!",
      },
      {
        id: "ch6",
        zone: "Концертный Зал",
        emoji: "🎵",
        color: "#66BB6A",
        bg: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
        intro: "Последняя остановка — Великий Концертный Зал! Музыка здесь живая и волшебная. Докажи свою музыкальную душу!",
        questions: [
          {
            id: "q15", talent: "music",
            mission: "Финальное выступление — Музыкальный Дар",
            q: "Дирижёр зала спрашивает: когда ты слушаешь музыку, что ты замечаешь прежде всего?",
            hint: "Gordon Musical Aptitude Profile (Harvard Music Dept.)",
            opts: ["Только слова песни", "Ритм, темп и структуру мелодии", "Внешний вид музыкантов", "Я почти не слушаю музыку"],
            score_map: [0.3, 1.0, 0.0, 0.0],
          },
        ],
        complete: "Стоячие овации! 🎵 Ты покорил все 6 зон планеты Талантов!",
      },
    ],
    finale: {
      title: "Экспедиция завершена! 🌟",
      text: "Ты прошёл все 6 зон планеты Талантов. Сейчас наш AI анализирует твои суперсилы...",
      mascot: "🏆",
    },
  },

  uz: {
    intro: {
      title: "Xush kelibsiz, tadqiqotchi! 🚀",
      text: "Siz Iste'dod sayyorasiga ekspeditsiyaga yo'l olasiz. Har bir zona yangi supersalohiyatingizni ochadi. Missiyani boshlashga tayyormisiz?",
      btn: "Ekspeditsiyani boshlash →",
      mascot: "🌟",
    },
    chapters: [
      {
        id: "ch1", zone: "Mantiq Hududi", emoji: "🧠", color: "#1565C0", bg: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
        intro: "Mantiq Labirintiga xush kelibsiz! Bu yerda raqamlar va naqshlar yashaydi. Davom etish uchun jumboqlarni yeching!",
        questions: [
          { id:"q1", talent:"logic", mission:"Jumboq #1 — Raqamli kod", q:"Labirint eshigini ochish uchun keyingi raqamni kiriting: 2, 4, 8, 16, __", hint:"Stanford-Binet: geometrik progressiya", opts:["24","32","30","28"], score_map:[0.1,1.0,0.1,0.1] },
          { id:"q2", talent:"logic", mission:"Jumboq #2 — Mantiqiy qulf", q:"Qorovul so'radi: «Agar barcha shifokorlar olim bo'lsa va ba'zi olimlar rassom bo'lsa, u holda...»", hint:"Stanford-Binet: sillogizm", opts:["Barcha shifokorlar rassom","Ba'zi shifokorlar rassom bo'lishi mumkin","Hech bir shifokor rassom emas","Aniq aytib bo'lmaydi"], score_map:[0.0,0.7,0.1,1.0] },
          { id:"q3", talent:"logic", mission:"Labirintning So'nggi Sinovi — Vaqt Soati", q:"Oxirgi jumboq! Qorovul so'raydi: soat 3:00 da soat millari orasidagi burchak necha gradus?", hint:"MIT Kognitiv Baholash", opts:["60°","90°","120°","75°"], score_map:[0.0,1.0,0.0,0.0] },
        ],
        complete: "Ajoyib! Mantiq Labirintini zabt etdingiz! 🏆",
      },
      {
        id: "ch2", zone: "Xotira G'ori", emoji: "🃏", color: "#7E57C2", bg: "linear-gradient(135deg, #EDE7F6, #D1C4E9)",
        intro: "Xotira G'origa xush kelibsiz! Bu yerda dunyo xotiralari saqlanadi.",
        questions: [
          { id:"q4", talent:"memory", mission:"Artefakt #1 — So'zlar Kristalli", q:"Kristall sizga ko'rsatdi: OLMA, KITOB, DARYO, QUSH. Chaqmoq uchinchi so'zni o'chirdi. U qaysi so'z edi?", hint:"Wechsler Memory Scale", opts:["OLMA","KITOB","DARYO","QUSH"], score_map:[0.0,0.0,1.0,0.0] },
          { id:"q5", talent:"memory", mission:"Artefakt #2 — Bilim O'ramasi", q:"G'or donishmandi so'raydi: «Kecha nima yeganiňizni eslaganingizda qaysi xotirani ishlatasiz?»", hint:"Tulving xotira nazariyasi (Toronto)", opts:["Protsedural (ko'nikmalar)","Semantik (faktlar)","Epizodik (hayot voqealari)","Qisqa muddatli"], score_map:[0.1,0.2,1.0,0.2] },
          { id:"q6", talent:"memory", mission:"G'orning So'nggi Sinovi — Vaqt Ko'zgusi", q:"Ko'zgu raqamlarni ko'rsatdi: 7-3-9-1-5. Chiqish uchun ularni TESKARI aytib bering!", hint:"Wechsler: Digit Span Backward", opts:["5-1-9-3-7","7-3-9-1-5","5-9-1-3-7","1-5-9-3-7"], score_map:[1.0,0.0,0.0,0.0] },
        ],
        complete: "Inanilmas! Xotira G'orini zabt etdingiz! 🎉",
      },
      {
        id: "ch3", zone: "Ijodkorlik Oroli", emoji: "🎨", color: "#FF7043", bg: "linear-gradient(135deg, #FFF8E1, #FFE0B2)",
        intro: "Ijodkorlik Oroliga keldingiz! Bu yerda to'g'ri javoblar yo'q — faqat tasavvur!",
        questions: [
          { id:"q7", talent:"creativity", mission:"Musobaqa #1 — G'oyalar Minorasi", q:"Orol aholisi g'isht uchun 50 ta qo'llanish o'ylab topdi. Bu qanday tafakkur?", hint:"Torrans ijodiy tafakkur testi", opts:["Mantiqiy tafakkur","Divergent tafakkur (ijodkorlik)","Musiqiy eshituv","Tilshunoslik"], score_map:[0.1,1.0,0.0,0.1] },
          { id:"q8", talent:"creativity", mission:"Musobaqa #2 — Ixtirochi Ustaxonasi", q:"Buyuk ixtirochi deydi: har qanday kashfiyotning birinchi qadami — bu...", hint:"Stanford d.school Design Thinking", opts:["Foydalanuvchi muammosini chuqur tushunish (empathize)","Darhol prototip qurish","Batafsil reja yozish","Moliya topish"], score_map:[1.0,0.5,0.2,0.1] },
          { id:"q9", talent:"creativity", mission:"Orolning So'nggi Sinovi — Sehrgar Usuli", q:"Orol sehrgari SCAMPER texnikasini ishlatadi. Bu nima degani?", hint:"MIT Media Lab Ijodkorlik Testi", opts:["Almashtir, birlashtir, moslashtir, o'zgartir, boshqa maqsadda ishlat, yo'q qil, qayta tartiblash","Boshqalarning g'oyalarini ko'chir","Ko'pchilik fikriga qo'shil","Birinchi g'oyani ishlat"], score_map:[1.0,0.0,0.0,0.1] },
        ],
        complete: "Ajoyib! Ijodkorlik Oroli zabt etildi! 🌈",
      },
      {
        id: "ch4", zone: "Liderlik Qal'asi", emoji: "👑", color: "#FFB300", bg: "linear-gradient(135deg, #FFF8E1, #FFECB3)",
        intro: "Liderlik Qal'asi oldida turipsiz! Bu yerda boshqalarni ilhomlantirgan qirollar yashaydi.",
        questions: [
          { id:"q10", talent:"leadership", mission:"Sinov #1 — Donishmandlik Zali", q:"Qirol maslahatchisi so'raydi: jamoangizda ziddiyat bor. Dono rahbar nima qiladi?", hint:"Harvard Leadership Assessment", opts:["Hammasini eshitib kelishuv topadi","O'z fikrini yuklatadi","Ziddiyatni e'tiborsiz qoldiradi","Ketib hammani o'z holiga qo'yadi"], score_map:[1.0,0.2,0.0,0.0] },
          { id:"q11", talent:"leadership", mission:"Sinov #2 — Hissiyot Taxti", q:"Saroy donishmandi so'raydi: Harvard olimi Goleman isbotladikim, rahbarning eng kuchli quroli — bu...", hint:"Goleman EQ Framework (Harvard/Yale)", opts:["Yuqori IQ","Hissiy intellekt (EQ)","Jismoniy kuch","Texnik bilimlar"], score_map:[0.2,1.0,0.0,0.2] },
          { id:"q12", talent:"leadership", mission:"Qal'aning So'nggi Sinovi — Transformatsiya Toji", q:"So'nggi qorovul so'raydi: Transformatsion lider Transaksion liderdan qanday farq qiladi?", hint:"MIT Sloan Leadership Study (Bass, 1985)", opts:["Faqat vazifalar va mukofotlar orqali ishlaydi","Odamlarni ilhomlantiradi va kelajak manzarasini ko'rsatadi","Qattiq nazorat o'rnatadi","Qarorlarni yolg'iz qabul qiladi"], score_map:[0.1,1.0,0.1,0.0] },
        ],
        complete: "Toj sizniki! 👑 Haqiqiy rahbar sifatlarini isbotladingiz!",
      },
      {
        id: "ch5", zone: "Tillar Minorasi", emoji: "🌍", color: "#26C6DA", bg: "linear-gradient(135deg, #E0F7FA, #B2EBF2)",
        intro: "Tillar Minorasi bulutlarga cho'zilgan! Har bir qavat — yangi til.",
        questions: [
          { id:"q13", talent:"languages", mission:"Qavat #1 — So'zlar Zali", q:"Minora qo'riqchisi so'raydi: «ephemeral» so'zi nima degani?", hint:"Cambridge Language Aptitude Test", opts:["Abadiy","Vaqtinchalik, o'tkinchi","Kuchli","Chuqur"], score_map:[0.0,1.0,0.0,0.0] },
          { id:"q14", talent:"languages", mission:"So'nggi Qavat — Ko'p Tilli Cho'qqi", q:"Cho'qqida so'rashadi: nechta tilda muloqot qila olasiz?", hint:"Oxford CEFR Language Framework", opts:["Faqat ona tilida","2 tilda (ona tili + 1 chet til)","3 tilda (kamida B1)","4+ tilda (kamida bittasida C1+)"], score_map:[0.1,0.4,0.75,1.0] },
        ],
        complete: "Cho'qqi zabt etildi! 🌍 Siz haqiqiy poliglot!",
      },
      {
        id: "ch6", zone: "Konsert Zali", emoji: "🎵", color: "#66BB6A", bg: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
        intro: "Oxirgi bekat — Buyuk Konsert Zali! Bu yerda musiqa tirik va sehrli.",
        questions: [
          { id:"q15", talent:"music", mission:"So'nggi Chiqish — Musiqiy Sovg'a", q:"Dirijyor so'raydi: musiqa tinglayotganda avvalo nimaga e'tibor berasiz?", hint:"Gordon Musical Aptitude Profile (Harvard Music Dept.)", opts:["Faqat qo'shiq so'zlariga","Ritm, sur'at va melodiya tuzilishiga","Musiqachilarning tashqi ko'rinishiga","Deyarli musiqa eshitmayman"], score_map:[0.3,1.0,0.0,0.0] },
        ],
        complete: "Olqishlar! 🎵 Iste'dod sayyorasining barcha 6 zonasini zabt etdingiz!",
      },
    ],
    finale: { title: "Ekspeditsiya yakunlandi! 🌟", text: "Siz Iste'dod sayyorasining barcha 6 zonasini zabt etdingiz. AI sizning supersalohiyatlaringizni tahlil qilmoqda...", mascot: "🏆" },
  },

  en: {
    intro: {
      title: "Welcome, Explorer! 🚀",
      text: "You are embarking on an expedition across the Planet of Talents. Each zone will reveal a new superpower. Ready to start the mission?",
      btn: "Start Expedition →",
      mascot: "🌟",
    },
    chapters: [
      {
        id: "ch1", zone: "Logic Zone", emoji: "🧠", color: "#1565C0", bg: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
        intro: "Welcome to the Logic Labyrinth! Numbers and patterns live here. Solve the riddles to proceed!",
        questions: [
          { id:"q1", talent:"logic", mission:"Riddle #1 — Number Code", q:"To open the labyrinth door, enter the next number: 2, 4, 8, 16, __", hint:"Stanford-Binet: geometric progression", opts:["24","32","30","28"], score_map:[0.1,1.0,0.1,0.1] },
          { id:"q2", talent:"logic", mission:"Riddle #2 — Logic Lock", q:"The guard asks: 'If all doctors are scientists, and some scientists are artists, then...'", hint:"Stanford-Binet: syllogism", opts:["All doctors are artists","Some doctors might be artists","No doctor is an artist","Cannot be determined"], score_map:[0.0,0.7,0.1,1.0] },
          { id:"q3", talent:"logic", mission:"Labyrinth Final Challenge — Clock of Time", q:"Last riddle! The keeper asks: what is the angle between clock hands at exactly 3:00?", hint:"MIT Cognitive Assessment", opts:["60°","90°","120°","75°"], score_map:[0.0,1.0,0.0,0.0] },
        ],
        complete: "Amazing! You conquered the Logic Labyrinth! 🏆 Your brain works like a supercomputer!",
      },
      {
        id: "ch2", zone: "Memory Cave", emoji: "🃏", color: "#7E57C2", bg: "linear-gradient(135deg, #EDE7F6, #D1C4E9)",
        intro: "Welcome to the Memory Cave! All the world's memories are stored here. Find the right artifacts!",
        questions: [
          { id:"q4", talent:"memory", mission:"Artifact #1 — Word Crystal", q:"The crystal showed you: APPLE, BOOK, RIVER, BIRD. Lightning erased the third word. What was it?", hint:"Wechsler Memory Scale", opts:["APPLE","BOOK","RIVER","BIRD"], score_map:[0.0,0.0,1.0,0.0] },
          { id:"q5", talent:"memory", mission:"Artifact #2 — Scroll of Knowledge", q:"The cave sage asks: 'When you remember what you ate yesterday — which type of memory are you using?'", hint:"Tulving's Memory Theory (Toronto)", opts:["Procedural (skills)","Semantic (facts)","Episodic (life events)","Short-term"], score_map:[0.1,0.2,1.0,0.2] },
          { id:"q6", talent:"memory", mission:"Cave Final Trial — Mirror of Time", q:"The mirror shows digits: 7-3-9-1-5. Say them BACKWARDS to escape!", hint:"Wechsler: Digit Span Backward", opts:["5-1-9-3-7","7-3-9-1-5","5-9-1-3-7","1-5-9-3-7"], score_map:[1.0,0.0,0.0,0.0] },
        ],
        complete: "Incredible! You conquered the Memory Cave! 🎉 Your memory is like Harvard's library!",
      },
      {
        id: "ch3", zone: "Creativity Island", emoji: "🎨", color: "#FF7043", bg: "linear-gradient(135deg, #FFF8E1, #FFE0B2)",
        intro: "You've arrived at Creativity Island! There are no wrong answers here — only imagination!",
        questions: [
          { id:"q7", talent:"creativity", mission:"Challenge #1 — Tower of Ideas", q:"An island resident found 50 uses for a brick. What type of thinking does this show?", hint:"Torrance Tests of Creative Thinking", opts:["Logical thinking","Divergent thinking (creativity)","Musical ability","Linguistics"], score_map:[0.1,1.0,0.0,0.1] },
          { id:"q8", talent:"creativity", mission:"Challenge #2 — Inventor's Workshop", q:"The great inventor says: the first step to any discovery is...", hint:"Stanford d.school Design Thinking", opts:["Deeply understanding the user's problem (empathize)","Immediately building a prototype","Writing a detailed plan","Finding funding"], score_map:[1.0,0.5,0.2,0.1] },
          { id:"q9", talent:"creativity", mission:"Island Final Challenge — The Wizard's Method", q:"The island wizard uses the SCAMPER technique. What does it mean?", hint:"MIT Media Lab Creativity Assessment", opts:["Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse","Copy the best ideas of others","Follow the majority opinion","Use the first idea that comes"], score_map:[1.0,0.0,0.0,0.1] },
        ],
        complete: "Spectacular! Creativity Island conquered! 🌈 Your imagination is limitless!",
      },
      {
        id: "ch4", zone: "Leadership Castle", emoji: "👑", color: "#FFB300", bg: "linear-gradient(135deg, #FFF8E1, #FFECB3)",
        intro: "Before you stands the Leadership Castle! Kings and queens who inspire others live here. Prove you are worthy!",
        questions: [
          { id:"q10", talent:"leadership", mission:"Trial #1 — Hall of Wisdom", q:"The king's advisor asks: your team has a conflict. What does a wise leader do?", hint:"Harvard Leadership Assessment", opts:["Listen to everyone and find compromise","Impose their own view","Ignore the conflict","Leave everyone to figure it out"], score_map:[1.0,0.2,0.0,0.0] },
          { id:"q11", talent:"leadership", mission:"Trial #2 — Throne of Emotions", q:"The court sage asks: Harvard scholar Goleman proved that a leader's greatest weapon is...", hint:"Goleman EQ Framework (Harvard/Yale)", opts:["High IQ","Emotional Intelligence (EQ)","Physical strength","Technical knowledge"], score_map:[0.2,1.0,0.0,0.2] },
          { id:"q12", talent:"leadership", mission:"Castle Final Trial — Crown of Transformation", q:"The last guardian asks: how does a Transformational leader differ from a Transactional one?", hint:"MIT Sloan Leadership Study (Bass, 1985)", opts:["Works only through tasks and rewards","Inspires people and shows a vision of the future","Establishes strict control","Makes all decisions alone"], score_map:[0.1,1.0,0.1,0.0] },
        ],
        complete: "The crown is yours! 👑 You proved the qualities of a true leader!",
      },
      {
        id: "ch5", zone: "Tower of Languages", emoji: "🌍", color: "#26C6DA", bg: "linear-gradient(135deg, #E0F7FA, #B2EBF2)",
        intro: "The Tower of Languages reaches into the clouds! Each floor is a new world language.",
        questions: [
          { id:"q13", talent:"languages", mission:"Floor #1 — Hall of Words", q:"The tower guardian asks: the word 'ephemeral' means...", hint:"Cambridge Language Aptitude Test", opts:["Eternal","Fleeting, short-lived","Powerful","Deep"], score_map:[0.0,1.0,0.0,0.0] },
          { id:"q14", talent:"languages", mission:"Top Floor — Polyglot Summit", q:"At the summit they ask: how many languages can you communicate in?", hint:"Oxford CEFR Language Framework", opts:["Only my native language","2 languages (native + 1 foreign)","3 languages (at least B1)","4+ languages (C1+ in one)"], score_map:[0.1,0.4,0.75,1.0] },
        ],
        complete: "Summit conquered! 🌍 You are a true polyglot!",
      },
      {
        id: "ch6", zone: "Concert Hall", emoji: "🎵", color: "#66BB6A", bg: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
        intro: "Final stop — the Grand Concert Hall! Music here is alive and magical.",
        questions: [
          { id:"q15", talent:"music", mission:"Final Performance — Musical Gift", q:"The conductor asks: when you listen to music, what do you notice first?", hint:"Gordon Musical Aptitude Profile (Harvard Music Dept.)", opts:["Only the song lyrics","The rhythm, tempo and melodic structure","The musicians' appearance","I barely listen to music"], score_map:[0.3,1.0,0.0,0.0] },
        ],
        complete: "Standing ovation! 🎵 You've conquered all 6 zones of the Planet of Talents!",
      },
    ],
    finale: { title: "Expedition Complete! 🌟", text: "You've conquered all 6 zones of the Planet of Talents. Our AI is analysing your superpowers...", mascot: "🏆" },
  },
};

// ── Collect all questions in order from chapters ──────────────────────────────
function getAllQuestions(story) {
  return story.chapters.flatMap((ch) => ch.questions.map((q) => ({ ...q, chapterId: ch.id })));
}

export default function QuizPage({ setPage, setResults, lang, dark }) {
  const story    = STORY[lang] || STORY.ru;
  const allQ     = getAllQuestions(story);
  const chapters = story.chapters;

  const [phase, setPhase]           = useState("intro");    // intro | chapter-intro | question | chapter-complete | finale | submitting
  const [chapterIdx, setChapterIdx] = useState(0);
  const [qInChapter, setQInChapter] = useState(0);
  const [selected, setSelected]     = useState(null);
  const [answers, setAnswers]       = useState({});
  const [error, setError]           = useState(null);
  const [showHint, setShowHint]     = useState(false);

  const chapter    = chapters[chapterIdx];
  const chapterQ   = chapter?.questions || [];
  const currentQ   = chapterQ[qInChapter];
  const totalDone  = chapters.slice(0, chapterIdx).reduce((acc, ch) => acc + ch.questions.length, 0) + qInChapter;
  const totalQ     = allQ.length;
  const progress   = Math.round((totalDone / totalQ) * 100);

  const handleAnswer = () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [currentQ.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    setShowHint(false);

    const isLastInChapter = qInChapter === chapterQ.length - 1;
    const isLastChapter   = chapterIdx === chapters.length - 1;

    if (isLastInChapter && isLastChapter) {
      // All done — submit
      submitAnswers(newAnswers);
    } else if (isLastInChapter) {
      setPhase("chapter-complete");
    } else {
      setQInChapter(qInChapter + 1);
    }
  };

  const nextChapter = () => {
    setChapterIdx(chapterIdx + 1);
    setQInChapter(0);
    setPhase("chapter-intro");
  };

  const submitAnswers = async (finalAnswers) => {
    setPhase("submitting");
    try {
      const token = localStorage.getItem("token");
      let data;
      if (token) {
        const res = await quizAPI.submitAnswers(finalAnswers, lang);
        data = res.data;
      } else {
        const res = await fetch("http://localhost:8001/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: finalAnswers, lang }),
        });
        data = await res.json();
      }
      setResults(data);
      setPage("results");
    } catch {
      setError(lang === "ru" ? "Сервер недоступен. Проверь подключение." : lang === "uz" ? "Server javob bermayapti." : "Server unavailable. Check connection.");
      setPhase("question");
    }
  };

  const bg = dark ? "#0F1923" : "#F0F7FF";

  // ── INTRO SCREEN ─────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background: dark?"linear-gradient(135deg,#0F1923,#1A2A3A)":"linear-gradient(135deg,#E3F2FD,#FFF8E1)" }}>
        <div style={{ fontSize:"4rem", marginBottom:16, animation:"float 2s ease-in-out infinite" }}>{story.intro.mascot}</div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color: dark?"#E3F2FD":"#1565C0", marginBottom:16, maxWidth:500 }}>{story.intro.title}</h1>
        <p style={{ fontSize:"1rem", fontWeight:600, color: dark?"#90CAF9":"#546E7A", maxWidth:460, lineHeight:1.7, marginBottom:32 }}>{story.intro.text}</p>
        {/* Chapter map */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:32 }}>
          {chapters.map((ch, i) => (
            <div key={ch.id} style={{ background: dark?"#1A2A3A":"#fff", border:`2px solid ${ch.color}44`, borderRadius:14, padding:"8px 14px", display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:800, color: dark?"#E3F2FD":"#1A237E" }}>
              <span>{ch.emoji}</span> {ch.zone}
            </div>
          ))}
        </div>
        <button className="hero-cta" style={{ fontSize:"1.1rem", padding:"14px 36px" }} onClick={() => setPhase("chapter-intro")}>
          {story.intro.btn}
        </button>
        <p style={{ fontSize:"0.72rem", color:"#90A4AE", fontWeight:700, marginTop:20 }}>
          📚 {lang==="ru"?"На основе: Gardner (Harvard) · Stanford · MIT · Cambridge":lang==="uz"?"Asoslanadi: Gardner (Harvard) · Stanford · MIT · Cambridge":"Based on: Gardner (Harvard) · Stanford · MIT · Cambridge"}
        </p>
      </div>
    </div>
  );

  // ── CHAPTER INTRO ─────────────────────────────────────────────────────────
  if (phase === "chapter-intro") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background: dark?"#0F1923":chapter.bg }}>
        <div style={{ fontSize:"4rem", marginBottom:16 }}>{chapter.emoji}</div>
        <div style={{ background:chapter.color, color:"#fff", borderRadius:99, padding:"4px 18px", fontSize:"0.82rem", fontWeight:800, marginBottom:14, letterSpacing:"0.08em" }}>
          {lang==="ru"?"ЗОНА":lang==="uz"?"ZONA":"ZONE"} {chapterIdx + 1}/{chapters.length}
        </div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color: dark?"#E3F2FD":chapter.color, marginBottom:16 }}>{chapter.zone}</h2>
        <p style={{ fontSize:"1rem", fontWeight:600, color: dark?"#B0BEC5":"#546E7A", maxWidth:440, lineHeight:1.7, marginBottom:32 }}>{chapter.intro}</p>
        <button className="quiz-next" style={{ background:chapter.color, maxWidth:320 }} onClick={() => setPhase("question")}>
          {lang==="ru"?"Начать зону →":lang==="uz"?"Zonani boshlash →":"Start Zone →"}
        </button>
      </div>
    </div>
  );

  // ── CHAPTER COMPLETE ──────────────────────────────────────────────────────
  if (phase === "chapter-complete") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background: dark?"#0F1923":chapter.bg }}>
        <div style={{ fontSize:"4rem", marginBottom:16, animation:"float 2s ease-in-out infinite" }}>🏆</div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", color: dark?"#E3F2FD":chapter.color, marginBottom:16, maxWidth:480 }}>{chapter.complete}</h2>
        {/* Progress dots */}
        <div style={{ display:"flex", gap:8, marginBottom:32 }}>
          {chapters.map((ch, i) => (
            <div key={i} style={{ width:12, height:12, borderRadius:"50%", background: i <= chapterIdx ? ch.color : (dark?"#2A4070":"#E3F2FD"), transition:"background 0.3s" }} />
          ))}
        </div>
        <button className="quiz-next" style={{ background:chapters[chapterIdx+1]?.color || chapter.color, maxWidth:320 }} onClick={nextChapter}>
          {lang==="ru"?`Следующая зона: ${chapters[chapterIdx+1]?.zone} →`:lang==="uz"?`Keyingi zona: ${chapters[chapterIdx+1]?.zone} →`:`Next Zone: ${chapters[chapterIdx+1]?.zone} →`}
        </button>
      </div>
    </div>
  );

  // ── SUBMITTING ────────────────────────────────────────────────────────────
  if (phase === "submitting") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ textAlign:"center", padding:"60px 24px" }}>
        <div style={{ fontSize:"3rem", marginBottom:16 }}>{story.finale.mascot}</div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", color: dark?"#E3F2FD":"#1565C0", marginBottom:12 }}>{story.finale.title}</h2>
        <p style={{ color: dark?"#90CAF9":"#78909C", fontWeight:600, marginBottom:32 }}>{story.finale.text}</p>
        <Loader message={lang==="ru"?"AI анализирует твои суперсилы... 🧠":lang==="uz"?"AI supersalohiyatlarni tahlil qilmoqda... 🧠":"AI is analysing your superpowers... 🧠"} />
      </div>
    </div>
  );

  // ── QUESTION ──────────────────────────────────────────────────────────────
  return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />

      {/* Overall progress */}
      <div className="progress-bar-wrap" style={{ marginTop:16 }}>
        <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
      </div>

      {/* Chapter header */}
      <div style={{ background: dark?"#1A2A3A":chapter.bg, padding:"12px 24px", display:"flex", alignItems:"center", gap:12, borderBottom:`2px solid ${chapter.color}33` }}>
        <span style={{ fontSize:"1.4rem" }}>{chapter.emoji}</span>
        <div>
          <div style={{ fontSize:"0.72rem", fontWeight:800, color:chapter.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>
            {lang==="ru"?"Зона":lang==="uz"?"Zona":"Zone"} {chapterIdx+1}/{chapters.length} — {chapter.zone}
          </div>
          <div style={{ fontSize:"0.85rem", fontWeight:800, color: dark?"#E3F2FD":"#1A237E" }}>{currentQ?.mission}</div>
        </div>
        <button onClick={() => setShowHint(!showHint)} style={{ marginLeft:"auto", border:"none", background:`${chapter.color}18`, color:chapter.color, borderRadius:99, padding:"4px 12px", fontWeight:800, fontSize:"0.75rem", cursor:"pointer" }}>
          💡 {lang==="ru"?"Подсказка":lang==="uz"?"Maslahat":"Hint"}
        </button>
      </div>

      <div className="quiz-section">
        {error && <div style={{ background:"#FFEBEE", border:"1.5px solid #EF5350", borderRadius:10, padding:"10px 14px", color:"#C62828", fontWeight:700, marginBottom:14, fontSize:"0.88rem" }}>❌ {error}</div>}

        {showHint && (
          <div style={{ background:"#E8F5E9", border:`1px solid ${chapter.color}`, borderRadius:10, padding:"8px 14px", marginBottom:14, fontSize:"0.8rem", fontWeight:700, color:"#2E7D32" }}>
            📚 {currentQ?.hint}
          </div>
        )}

        <p className="quiz-q">{currentQ?.q}</p>

        <div className="quiz-options">
          {currentQ?.opts.map((opt, i) => (
            <button key={i} className={`quiz-option${selected===i?" selected":""}`}
              style={selected===i ? { borderColor:chapter.color, background:`${chapter.color}15`, color:chapter.color } : {}}
              onClick={() => setSelected(i)}>
              <span style={{ fontSize:"0.8rem", fontWeight:900, color: selected===i ? chapter.color : "#90A4AE", marginRight:8 }}>
                {["A","B","C","D"][i]}.
              </span>
              {opt}
            </button>
          ))}
        </div>

        <button className="quiz-next" style={{ background: selected===null ? "#90A4AE" : chapter.color, opacity: selected===null ? 0.6 : 1 }}
          onClick={handleAnswer} disabled={selected===null}>
          {qInChapter < chapterQ.length - 1
            ? (lang==="ru"?"Следующий вызов →":lang==="uz"?"Keyingi musobaqa →":"Next Challenge →")
            : chapterIdx < chapters.length - 1
            ? (lang==="ru"?`Завершить зону ${chapter.emoji} →`:lang==="uz"?`Zona ${chapter.emoji}ni yakunlash →`:`Complete Zone ${chapter.emoji} →`)
            : (lang==="ru"?"Завершить экспедицию 🏆":lang==="uz"?"Ekspeditsiyani yakunlash 🏆":"Complete Expedition 🏆")
          }
        </button>

        {/* Question counter */}
        <p style={{ textAlign:"center", fontSize:"0.72rem", color:"#90A4AE", fontWeight:700, marginTop:12 }}>
          {lang==="ru"?`Вопрос ${qInChapter+1} из ${chapterQ.length} в этой зоне`:lang==="uz"?`Bu zonadagi ${qInChapter+1}/${chapterQ.length}-savol`:`Question ${qInChapter+1} of ${chapterQ.length} in this zone`}
          {" · "}{lang==="ru"?`Всего: ${totalDone+1}/${totalQ}`:lang==="uz"?`Jami: ${totalDone+1}/${totalQ}`:`Total: ${totalDone+1}/${totalQ}`}
        </p>
      </div>
    </div>
  );
}
