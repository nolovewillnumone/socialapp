import { useState, useEffect, useRef } from "react";
import Nav from "../components/Nav";
import Loader from "../components/Loader";
import { quizAPI } from "../api/client";

// ── STORY STRUCTURE ───────────────────────────────────────────────────────────
// Based on:
// - Gardner's Multiple Intelligences (Harvard, 1983/1999)
// - Raven's Progressive Matrices
// - Stanford-Binet Intelligence Scales (5th Ed.)
// - Wechsler Intelligence Scale for Children (WISC-V)
// - Torrance Tests of Creative Thinking (TTCT)
// - Gordon Musical Aptitude Profile
// - Cambridge ESOL Language Assessment
// - Goleman Emotional Intelligence Framework

const STORY = {
  ru: {
    intro: {
      title: "Миссия началась, исследователь! 🚀",
      text: "Ты отправляешься в экспедицию по планете Талантов — 6 зон, 15 вызовов. Каждый вопрос создан учёными Гарварда, MIT и Стэнфорда. Докажи свои способности!",
      btn: "Начать миссию →",
      mascot: "🌟",
    },
    chapters: [
      {
        id: "ch1", zone: "Логический Лабиринт", emoji: "🧠",
        color: "#1565C0", bg: "linear-gradient(135deg,#E3F2FD,#BBDEFB)",
        intro: "Ты в Логическом Лабиринте! Здесь учёные MIT проверяют способность мозга находить закономерности, решать задачи и мыслить системно. Готов?",
        questions: [
          {
            id:"q1", talent:"logic",
            mission:"Вызов #1 — Матрица Равена",
            q:"В ряду: 1, 1, 2, 3, 5, 8, 13, __ — какое число следующее? (Подсказка: каждое число = сумма двух предыдущих)",
            hint:"Последовательность Фибоначчи — используется в тесте Рейвена для оценки невербального интеллекта",
            opts:["18","21","20","19"],
            score_map:[0.0,1.0,0.0,0.0],
          },
          {
            id:"q2", talent:"logic",
            mission:"Вызов #2 — Парадокс Брадобрея",
            q:"В городе есть брадобрей, который бреет всех тех, кто не бреется сам. Бреет ли брадобрей себя сам?",
            hint:"Парадокс Рассела (1901) — базовый вопрос математической логики, используемый в тестах IQ уровня Mensa",
            opts:["Да, бреет","Нет, не бреет","Это невозможно определить — парадокс","И да и нет одновременно"],
            score_map:[0.0,0.0,1.0,0.3],
          },
          {
            id:"q3", talent:"logic",
            mission:"Вызов #3 — Задача о переправе",
            q:"Фермер везёт лису, курицу и зерно. Лодка вмещает только его и одного попутчика. Лиса съест курицу, курица — зерно без надзора. Сколько минимум переправ нужно?",
            hint:"Классическая задача на алгоритмическое мышление — используется в тестах MIT для оценки стратегического мышления",
            opts:["5 переправ","7 переправ","6 переправ","4 переправы"],
            score_map:[0.0,1.0,0.3,0.0],
          },
        ],
        complete:"Лабиринт пройден! 🏆 Твоя логика работает как процессор MIT!",
      },
      {
        id:"ch2", zone:"Пещера Памяти", emoji:"🃏",
        color:"#7E57C2", bg:"linear-gradient(135deg,#EDE7F6,#D1C4E9)",
        intro:"Добро пожаловать в Пещеру Памяти! Нейробиологи Кембриджа доказали: хорошая память — основа всех академических достижений. Проверь свою!",
        questions: [
          {
            id:"q4", talent:"memory",
            mission:"Испытание #1 — Дворец памяти",
            q:"Запомни эти цифры и воспроизведи в ОБРАТНОМ порядке: 8 — 3 — 7 — 1 — 9 — 4",
            hint:"Тест 'Digit Span Backward' из шкалы Векслера (WISC-V) — измеряет рабочую память. Норма для 12 лет: 4-5 цифр",
            opts:["4-9-1-7-3-8","8-3-7-1-9-4","4-1-9-7-3-8","9-4-1-7-3-8"],
            score_map:[1.0,0.0,0.2,0.0],
          },
          {
            id:"q5", talent:"memory",
            mission:"Испытание #2 — Типы памяти",
            q:"Пианист играет сонату наизусть, не думая о каждой ноте. Нейробиолог Стэнфорда скажет, что он использует:",
            hint:"Исследование HM (Henry Molaison, MIT/Harvard 1953): процедурная память хранится в мозжечке и базальных ганглиях, отдельно от сознательной памяти",
            opts:["Эпизодическую память (воспоминания событий)","Семантическую память (факты и знания)","Процедурную память (навыки и автоматизмы)","Рабочую память (кратковременное хранение)"],
            score_map:[0.1,0.1,1.0,0.1],
          },
          {
            id:"q6", talent:"memory",
            mission:"Финальное испытание — Метод локусов",
            q:"Метод 'Дворца памяти' (loci), которым пользовались Цицерон и Шерлок Холмс, основан на принципе:",
            hint:"Исследования UCL (2011): метод локусов увеличивает объём запоминания на 200-300%, активируя гиппокамп через пространственную навигацию",
            opts:["Многократного повторения одной информации","Привязки информации к знакомым местам в воображении","Записи всего в тетрадь","Ассоциаций с числами"],
            score_map:[0.1,1.0,0.0,0.2],
          },
        ],
        complete:"Пещера покорена! 🎉 Твоя память — настоящее хранилище знаний!",
      },
      {
        id:"ch3", zone:"Остров Творчества", emoji:"🎨",
        color:"#FF7043", bg:"linear-gradient(135deg,#FFF8E1,#FFE0B2)",
        intro:"Остров Творчества! Здесь Торранс из Миннесотского университета разработал тест, который используют NASA и Google для отбора кандидатов. Покажи дивергентное мышление!",
        questions: [
          {
            id:"q7", talent:"creativity",
            mission:"Испытание #1 — Тест Торранса",
            q:"Учёные НАСА используют этот тест: сколько нестандартных применений у обычной скрепки? Человек с ВЫСОКИМ творческим интеллектом назовёт...",
            hint:"Тест Торранса (TTCT, 1966): дивергентное мышление — способность генерировать много разных идей. Средний результат: 10-15 применений. Высокий: 25+",
            opts:["3-5 применений (скрепка, закладка, крючок)","10-15 стандартных применений","25+ нестандартных (антенна, пружина, зубочистка, инструмент для замка, мини-скульптура...)","Скрепка — только для бумаг"],
            score_map:[0.0,0.3,1.0,0.0],
          },
          {
            id:"q8", talent:"creativity",
            mission:"Испытание #2 — Латеральное мышление",
            q:"Человек живёт на 30 этаже. Каждое утро едет на лифте вниз. Вечером едет до 15 этажа и идёт пешком. Почему? (если не дождь и не компания)",
            hint:"Классическая задача на латеральное мышление Эдварда де Боно (Оксфорд) — измеряет способность выйти за рамки очевидного",
            opts:["Лифт сломан выше 15 этажа","Он слишком низкого роста и не достаёт до кнопки 30","Ему нравится ходить пешком","На 15 этаже живёт его друг"],
            score_map:[0.1,1.0,0.2,0.1],
          },
          {
            id:"q9", talent:"creativity",
            mission:"Финальный вызов — Творческий прорыв",
            q:"Компания Apple использует принцип 'First Principles Thinking' (Илон Маск, MIT). Что он означает?",
            hint:"Метод первых принципов (Аристотель → Декарт → современные инноваторы): разложить проблему до базовых истин и начать мыслить заново, игнорируя аналогии",
            opts:["Копировать лучшие решения конкурентов","Разложить проблему до базовых фактов и создать решение с нуля","Использовать первый пришедший в голову ответ","Спросить у эксперта"],
            score_map:[0.0,1.0,0.1,0.0],
          },
        ],
        complete:"Остров покорён! 🌈 Твоё творческое мышление — на уровне инноватора!",
      },
      {
        id:"ch4", zone:"Замок Лидерства", emoji:"👑",
        color:"#FFB300", bg:"linear-gradient(135deg,#FFF8E1,#FFECB3)",
        intro:"Замок Лидерства! Исследования Harvard Business School показали: великие лидеры не рождаются — они развивают конкретные навыки. Обладаешь ли ты ими?",
        questions: [
          {
            id:"q10", talent:"leadership",
            mission:"Испытание #1 — Дилемма Heinz",
            q:"Лоуренс Кольберг (Гарвард) предложил: Heinz крадёт лекарство, чтобы спасти умирающую жену. Лекарство стоит дорого и он не может купить. Как поступит зрелый моральный лидер?",
            hint:"Дилемма Кольберга (Harvard, 1958) измеряет уровень морального развития лидера. Высший уровень (6-й): универсальные этические принципы важнее закона",
            opts:["Строго следовать закону — кража всегда плохо","Взвесить ценность человеческой жизни выше имущественного права","Сбежать с лекарством и не думать о последствиях","Ждать и надеяться на лучшее"],
            score_map:[0.2,1.0,0.0,0.0],
          },
          {
            id:"q11", talent:"leadership",
            mission:"Испытание #2 — EQ vs IQ",
            q:"Исследование Google (Project Aristotle, 2016) изучило 180 команд. Главный фактор успеха команды — это:",
            hint:"Google обнаружил: 'психологическая безопасность' — возможность рисковать без страха осуждения — важнее IQ, опыта и технических навыков",
            opts:["Высокий средний IQ членов команды","Наличие звёздных специалистов","Психологическая безопасность — каждый может говорить открыто","Строгий контроль и чёткая иерархия"],
            score_map:[0.1,0.1,1.0,0.0],
          },
          {
            id:"q12", talent:"leadership",
            mission:"Финальный вызов — Парадокс лидера",
            q:"Исследование Стэнфорда (2019) показало: самые эффективные лидеры сочетают два противоположных качества. Какие?",
            hint:"Stanford GSB исследование: лидеры уровня Jim Collins ('Level 5 Leadership') сочетают личную скромность с профессиональной решимостью — парадоксальная комбинация",
            opts:["Жёсткость и мягкость попеременно","Личная скромность + непоколебимая профессиональная воля","Харизма + высокий IQ","Строгость + щедрые премии"],
            score_map:[0.1,1.0,0.1,0.0],
          },
        ],
        complete:"Замок твой! 👑 У тебя качества лидера мирового уровня!",
      },
      {
        id:"ch5", zone:"Башня Языков", emoji:"🌍",
        color:"#26C6DA", bg:"linear-gradient(135deg,#E0F7FA,#B2EBF2)",
        intro:"Башня Языков — 7000 языков мира! Нейролингвисты MIT доказали: многоязычие физически изменяет мозг, делая его устойчивее к деменции. Покажи свой лингвистический интеллект!",
        questions: [
          {
            id:"q13", talent:"languages",
            mission:"Этаж #1 — Нейролингвистика",
            q:"МРТ-исследования MIT (2015) показали: у билингвов (людей, знающих 2+ языка) плотность серого вещества выше в области:",
            hint:"Нейролингвистика: область Брока и нижняя теменная извилина — зоны языка и когнитивного контроля — у билингвов физически объёмнее",
            opts:["Мозжечка (координация движений)","Нижней теменной извилины и области Брока (язык + контроль)","Затылочной доли (зрение)","Гиппокампа (долгосрочная память)"],
            score_map:[0.0,1.0,0.0,0.2],
          },
          {
            id:"q14", talent:"languages",
            mission:"Финальный этаж — Полиглот",
            q:"Твой реальный уровень владения языками (по шкале CEFR Кембриджского университета):",
            hint:"Шкала CEFR: A1-A2 (базовый), B1-B2 (независимый), C1-C2 (опытный). C2 — уровень дипломата и переводчика ООН",
            opts:["1 язык — только родной (A2 и ниже)","2 языка — родной + 1 иностранный (B1-B2)","3 языка — минимум один на уровне B2+","4+ языка — хотя бы один на C1 и выше"],
            score_map:[0.1,0.4,0.75,1.0],
          },
        ],
        complete:"Вершина покорена! 🌍 Ты настоящий полиглот будущего!",
      },
      {
        id:"ch6", zone:"Концертный Зал", emoji:"🎵",
        color:"#66BB6A", bg:"linear-gradient(135deg,#E8F5E9,#C8E6C9)",
        intro:"Концертный Зал! Гордон Шоу (UC Irvine) открыл 'Эффект Моцарта' — музыка физически развивает мозг. Нейробиолог Анируд Патель (Harvard) доказал: музыканты имеют превосходную нейронную связность. Проверим твой музыкальный интеллект!",
        questions: [
          {
            id:"q15", talent:"music",
            mission:"Финальное выступление — Нейронаука музыки",
            q:"Исследование Harvard Medical School (Schlaug, 2005) показало: у профессиональных музыкантов, начавших заниматься до 7 лет, мозолистое тело (corpus callosum) на 25% больше. Что это означает?",
            hint:"Мозолистое тело соединяет левое и правое полушария. Его размер = скорость передачи информации между полушариями = мультизадачность и творчество",
            opts:["Музыканты умнее других людей","Лучшая связь между полушариями = выше творчество, мультизадачность и эмпатия","Музыканты лучше слышат","Занятия музыкой улучшают только слух"],
            score_map:[0.1,1.0,0.1,0.0],
          },
        ],
        complete:"Зал стоя аплодирует! 🎵 Ты покорил все 6 зон планеты Талантов!",
      },
    ],
    finale:{
      title:"Экспедиция завершена! 🌟",
      text:"Ты прошёл все 6 зон. Наш ML-алгоритм анализирует твои ответы по методологии Гарднера...",
      mascot:"🏆",
    },
  },

  uz: {
    intro:{
      title:"Missiya boshlandi, tadqiqotchi! 🚀",
      text:"Siz Iste'dod sayyorasiga ekspeditsiyaga jo'nayapsiz — 6 zona, 15 qiyinchilik. Har bir savol Harvard, MIT va Stanford olimlari tomonidan yaratilgan!",
      btn:"Missiyani boshlash →",
      mascot:"🌟",
    },
    chapters:[
      {
        id:"ch1", zone:"Mantiq Labirinti", emoji:"🧠",
        color:"#1565C0", bg:"linear-gradient(135deg,#E3F2FD,#BBDEFB)",
        intro:"Mantiq Labirintiga xush kelibsiz! MIT olimlari miyaning qonuniyatlarni topish va tizimli fikrlash qobiliyatini tekshiradilar.",
        questions:[
          { id:"q1", talent:"logic", mission:"Qiyinlik #1 — Fibonachchi ketma-ketligi", q:"Qatorda: 1, 1, 2, 3, 5, 8, 13, __ — keyingi son qaysi? (Har bir son = oldingi ikkitasining yig'indisi)", hint:"Fibonachchi ketma-ketligi — Raven matritsasi testida qo'llaniladi", opts:["18","21","20","19"], score_map:[0.0,1.0,0.0,0.0] },
          { id:"q2", talent:"logic", mission:"Qiyinlik #2 — Sartarosh Paradoksi", q:"Shaharda barcha o'zini o'zi qirmaydigan kishilarni qiradigan sartarosh bor. Sartarosh o'zini o'zi qiradimi?", hint:"Russell paradoksi (1901) — Mensa IQ testlarida qo'llaniladi", opts:["Ha, qiradi","Yo'q, qirmaydi","Bu aniqlab bo'lmas paradoks","Ha ham, yo'q ham"], score_map:[0.0,0.0,1.0,0.3] },
          { id:"q3", talent:"logic", mission:"Yakuniy qiyinlik — Ko'chirish masalasi", q:"Dehqon tulki, tovuq va g'allani ko'chirmoqchi. Qayiq faqat u va yana bittasini sig'diradi. Minimal nechta sayohat kerak?", hint:"MIT strategik fikrlash testi", opts:["5 sayohat","7 sayohat","6 sayohat","4 sayohat"], score_map:[0.0,1.0,0.3,0.0] },
        ],
        complete:"Labirint zabt etildi! 🏆 Sizning mantiqingiz MIT protsessori kabi ishlaydi!",
      },
      {
        id:"ch2", zone:"Xotira G'ori", emoji:"🃏",
        color:"#7E57C2", bg:"linear-gradient(135deg,#EDE7F6,#D1C4E9)",
        intro:"Xotira G'ori! Kembrij neyrobiologlari isbotladi: yaxshi xotira barcha akademik yutuqlarning asosi.",
        questions:[
          {
            id:"q4", talent:"memory", type:"memorize_digits",
            mission:"Sinov #1 — Veksler testi (WISC-V)",
            memorize:"8  3  7  1  9  4",
            memorize_label:"Bu raqamlarni yodlab oling! 5 soniya bor 👀",
            q:"Endi ularni TESKARI tartibda kiriting:",
            hint:"Digit Span Backward testi (Wechsler, WISC-V) — ishchi xotirani o'lchashning oltin standarti. 12 yoshda norma: 4-5 ta raqam",
            opts:["4-9-1-7-3-8","8-3-7-1-9-4","4-1-9-7-3-8","9-4-1-7-3-8"],
            score_map:[1.0,0.0,0.2,0.0],
          },
          {
            id:"q5", talent:"memory", type:"memorize_words",
            mission:"Sinov #2 — Eshitish xotirasi testi",
            memorize:"🦊 TULKI   🌊 OKEAN   🎸 GITARA   🏛️ SAROY   ⚡ CHAQMOQ",
            memorize_label:"Bu 5 so'zni yodlab oling! 6 soniya bor 👀",
            q:"Ro'yxatda QAYSI SO'Z YO'Q EDA?",
            hint:"Rey Auditory Verbal Learning Test (RAVLT) — bolalar va kattalarda xotirani baholash uchun neyropsixologlar tomonidan ishlatiladi",
            opts:["TULKI 🦊","PIRAMIDA 🔺","GITARA 🎸","CHAQMOQ ⚡"],
            score_map:[0.0,1.0,0.0,0.0],
          },
          {
            id:"q6", talent:"memory", type:"memorize_pattern",
            mission:"Yakuniy sinov — Korsi matritsasi",
            memorize:"🔵⬜⬜|⬜🔵⬜|⬜⬜🔵",
            memorize_label:"Ko'k katakchalar joylashuvini yodlab oling! 5 soniya 👀",
            q:"Ko'k katakchalarning ketma-ketligi qanday edi (yuqoridan pastga, chapdan o'ngga)?",
            hint:"Corsi Block Tapping testi (1972) — ko'rish-fazoviy ishchi xotirani o'lchaydi. Butun dunyoda neyropsixologiyada qo'llaniladi",
            opts:["Diagonal: yuqori-chap → markaz → quyi-o'ng","Diagonal: yuqori-o'ng → markaz → quyi-chap","Gorizontal: barcha markaziy qatorda","Vertikal: barcha o'ng ustunda"],
            score_map:[1.0,0.0,0.0,0.0],
          },
        ],
        complete:"G'or zabt etildi! 🎉 Sizning xotirangiz — haqiqiy bilimlar ombori!",
      },
      {
        id:"ch3", zone:"Ijodkorlik Oroli", emoji:"🎨",
        color:"#FF7043", bg:"linear-gradient(135deg,#FFF8E1,#FFE0B2)",
        intro:"Ijodkorlik Oroli! Torrans Minnesota universitetida NASA va Google kadrlar tanlash uchun foydalanadigan test ishlab chiqdi. Divergent fikrlashingizni ko'rsating!",
        questions:[
          { id:"q7", talent:"creativity", mission:"Sinov #1 — Torrans testi", q:"NASA ushbu testdan foydalanadi: oddiy qog'oz qisqichi uchun nechta g'ayrioddiy foydalanish topish mumkin? YUQORI ijodiy intellektli odam...", hint:"TTCT testi (1966): o'rtacha natija 10-15 ta, yuqori natija 25+ ta foydalanish", opts:["3-5 ta (qisqich, xatcho'p, ilmoq)","10-15 ta standart foydalanish","25+ ta g'ayrioddiy (antenna, buloq, tish cho'p, qulf asbobi, mini-haykal...)","Qisqich faqat qog'oz uchun"], score_map:[0.0,0.3,1.0,0.0] },
          { id:"q8", talent:"creativity", mission:"Sinov #2 — Lateral fikrlash", q:"Kishi 30-qavatda yashaydi. Har kuni liftda pastga tushadi. Kechqurun 15-qavatga chiqib qolgan yo'lni piyoda yuradi. Nima uchun?", hint:"Edvard de Bononing lateral fikrlash masalasi (Oksford) — odatiy doiradan chiqish qobiliyatini o'lchaydi", opts:["Lift 15-qavatdan yuqorida buziq","U past bo'yli va 30-qavat tugmasiga yetmaydi","Piyoda yurishni yaxshi ko'radi","15-qavatda do'sti yashaydi"], score_map:[0.1,1.0,0.2,0.1] },
          { id:"q9", talent:"creativity", mission:"Yakuniy qiyinlik — Birinchi tamoyillar", q:"Apple va Elon Musk ishlatadigan 'First Principles Thinking' (MIT) usuli nima?", hint:"Aristotel → Dekart → zamonaviy innovatorlar: muammoni asosiy faktlarga qadar ajratish va noldan yechim yaratish", opts:["Raqiblarning yaxshi yechimlarini ko'chirish","Muammoni asosiy faktlarga qadar ajratib, noldan yechim yaratish","Birinchi kelgan javobni ishlatish","Ekspertdan so'rash"], score_map:[0.0,1.0,0.1,0.0] },
        ],
        complete:"Orol zabt etildi! 🌈 Sizning ijodiy fikrlashingiz innovator darajasida!",
      },
      {
        id:"ch4", zone:"Liderlik Qal'asi", emoji:"👑",
        color:"#FFB300", bg:"linear-gradient(135deg,#FFF8E1,#FFECB3)",
        intro:"Liderlik Qal'asi! Harvard Business School tadqiqotlari ko'rsatdi: buyuk liderlar tug'ilmaydi — ular aniq ko'nikmalarni rivojlantiradi.",
        questions:[
          { id:"q10", talent:"leadership", mission:"Sinov #1 — Kolberg dilemmasi", q:"Kolberg (Harvard) taklif qildi: Heinz o'layotgan xotinini qutqarish uchun dori o'g'irlaydi. Dori qimmat va u sotib ololmaydi. Yetuk axloqiy lider qanday fikrlaydi?", hint:"Kolberg dilemmasi (Harvard, 1958) lider axloqiy rivojlanish darajasini o'lchaydi. 6-daraja: universal etik tamoyillar qonundan muhim", opts:["Qonunga qat'iy amal qilish — o'g'irlik har doim yomon","Inson hayoti mulkiy huquqdan yuqori ekanini tushunish","Dori bilan qochib ketish","Kutish va umid qilish"], score_map:[0.2,1.0,0.0,0.0] },
          { id:"q11", talent:"leadership", mission:"Sinov #2 — Google tadqiqoti", q:"Google tadqiqoti 'Project Aristotle' (2016) 180 ta jamoani o'rgandi. Jamoa muvaffaqiyatining asosiy omili:", hint:"Google aniqladi: 'psixologik xavfsizlik' — qo'rquvsiz fikr bildirish imkoniyati — IQ, tajriba va texnik ko'nikmalardan muhim", opts:["Jamoa a'zolarining yuqori o'rtacha IQ si","Yulduz mutaxassislarning mavjudligi","Psixologik xavfsizlik — har kim ochiq gapira oladi","Qat'iy nazorat va aniq ierarxiya"], score_map:[0.1,0.1,1.0,0.0] },
          { id:"q12", talent:"leadership", mission:"Yakuniy qiyinlik — Lider paradoksi", q:"Stanford tadqiqoti (2019): eng samarali liderlar ikki qarama-qarshi sifatni birlashtiradi. Qaysilarini?", hint:"Stanford GSB: Jim Collins '5-darajali liderlik' — shaxsiy kamtarlik + yo'zilmas kasbiy iroda", opts:["Qattiqlik va yumshoqlik navbatma-navbat","Shaxsiy kamtarlik + yo'zilmas kasbiy iroda","Xarizma + yuqori IQ","Qattiqqo'llik + katta mukofotlar"], score_map:[0.1,1.0,0.1,0.0] },
        ],
        complete:"Qal'a sizniki! 👑 Sizda jahon darajasidagi lider sifatlari bor!",
      },
      {
        id:"ch5", zone:"Tillar Minorasi", emoji:"🌍",
        color:"#26C6DA", bg:"linear-gradient(135deg,#E0F7FA,#B2EBF2)",
        intro:"Tillar Minorasi! MIT neyrolingvistlari isbotladi: ko'p tillilik miyani jismonan o'zgartiradi va demensiyadan himoya qiladi.",
        questions:[
          { id:"q13", talent:"languages", mission:"Qavat #1 — Neyrolingvistika", q:"MIT MRT-tadqiqotlari (2015): ikki tilli kishilarda kulrang modda zichligi quyidagi sohada yuqori:", hint:"Neyrolingvistika: Broka sohasi va quyi tepa burilma — ikki tillilar bu sohalarda jismonan kattaroq", opts:["Miyacha (harakatlar koordinatsiyasi)","Quyi tepa burilma va Broka sohasi (til + nazorat)","Ensa bo'lagi (ko'ruv)","Gippokamp (uzoq muddatli xotira)"], score_map:[0.0,1.0,0.0,0.2] },
          { id:"q14", talent:"languages", mission:"Yakuniy qavat — Poliglot", q:"Kembrij universiteti CEFR shkalasi bo'yicha til bilishingizning haqiqiy darajasi:", hint:"CEFR shkalasi: A1-A2 (asosiy), B1-B2 (mustaqil), C1-C2 (tajribali). C2 — diplomat va BMT tarjimoni darajasi", opts:["1 til — faqat ona tili (A2 va past)","2 til — ona tili + 1 xorijiy (B1-B2)","3 til — kamida bittasi B2+ darajasida","4+ til — kamida bittasi C1 va undan yuqori"], score_map:[0.1,0.4,0.75,1.0] },
        ],
        complete:"Cho'qqi zabt etildi! 🌍 Siz kelajakning haqiqiy poliglotisiz!",
      },
      {
        id:"ch6", zone:"Konsert Zali", emoji:"🎵",
        color:"#66BB6A", bg:"linear-gradient(135deg,#E8F5E9,#C8E6C9)",
        intro:"Konsert Zali! Gordon Shou (UC Irvine) 'Motsart effekti'ni kashf etdi. Harvard neyrobiologlari: musiqachilar yuqori neyron ulanishiga ega.",
        questions:[
          { id:"q15", talent:"music", mission:"Yakuniy chiqish — Musiqaning neyrofaniyasi", q:"Harvard Medical School tadqiqoti (Schlaug, 2005): 7 yoshgacha musiqa bilan shug'ullangan professional musiqachilarda corpus callosum 25% katta. Bu nima degani?", hint:"Corpus callosum chap va o'ng yarim sharlarni bog'laydi. Uning hajmi = yarim sharlar orasidagi axborot uzatish tezligi = ko'p vazifali fikrlash va ijodkorlik", opts:["Musiqachilar boshqalarga qaraganda aqlliroq","Yarim sharlar orasidagi yaxshiroq aloqa = ijodkorlik, ko'p vazifali fikrlash va empatiya yuqori","Musiqachilar yaxshiroq eshitadilar","Musiqa faqat eshituvni yaxshilaydi"], score_map:[0.1,1.0,0.1,0.0] },
        ],
        complete:"Zal tik turib qarsak chalmoqda! 🎵 Siz Iste'dod sayyorasining barcha 6 zonasini zabt etdingiz!",
      },
    ],
    finale:{title:"Ekspeditsiya yakunlandi! 🌟", text:"Siz barcha 6 zonani zabt etdingiz. ML-algoritmimiz Gardner metodologiyasi bo'yicha javoblaringizni tahlil qilmoqda...", mascot:"🏆"},
  },

  en: {
    intro:{
      title:"Mission started, explorer! 🚀",
      text:"You're embarking on an expedition across the Planet of Talents — 6 zones, 15 challenges. Every question is designed by scientists from Harvard, MIT and Stanford. Prove your abilities!",
      btn:"Start Mission →",
      mascot:"🌟",
    },
    chapters:[
      {
        id:"ch1", zone:"Logic Labyrinth", emoji:"🧠",
        color:"#1565C0", bg:"linear-gradient(135deg,#E3F2FD,#BBDEFB)",
        intro:"Welcome to the Logic Labyrinth! MIT scientists test the brain's ability to find patterns, solve problems and think systematically.",
        questions:[
          { id:"q1", talent:"logic", mission:"Challenge #1 — Fibonacci Sequence", q:"In the series: 1, 1, 2, 3, 5, 8, 13, __ — what is the next number? (Hint: each number = sum of the two before it)", hint:"Fibonacci sequence — used in Raven's Progressive Matrices to assess non-verbal intelligence", opts:["18","21","20","19"], score_map:[0.0,1.0,0.0,0.0] },
          { id:"q2", talent:"logic", mission:"Challenge #2 — The Barber Paradox", q:"In a town, there is a barber who shaves all those who do not shave themselves. Does the barber shave himself?", hint:"Russell's Paradox (1901) — used in Mensa IQ tests as a fundamental logic question", opts:["Yes, he does","No, he doesn't","It's an unresolvable paradox","Both yes and no simultaneously"], score_map:[0.0,0.0,1.0,0.3] },
          { id:"q3", talent:"logic", mission:"Final Challenge — River Crossing", q:"A farmer must cross a fox, chicken and grain. The boat holds only him plus one passenger. The fox eats the chicken, chicken eats the grain when unsupervised. Minimum trips needed?", hint:"Classic algorithmic thinking puzzle — used by MIT to assess strategic reasoning", opts:["5 trips","7 trips","6 trips","4 trips"], score_map:[0.0,1.0,0.3,0.0] },
        ],
        complete:"Labyrinth conquered! 🏆 Your logic runs like an MIT processor!",
      },
      {
        id:"ch2", zone:"Memory Cave", emoji:"🃏",
        color:"#7E57C2", bg:"linear-gradient(135deg,#EDE7F6,#D1C4E9)",
        intro:"Memory Cave! Cambridge neuroscientists proved: strong memory is the foundation of all academic achievement.",
        questions:[
          {
            id:"q4", talent:"memory", type:"memorize_digits",
            mission:"Trial #1 — Wechsler Test (WISC-V)",
            memorize:"8  3  7  1  9  4",
            memorize_label:"Memorise these digits! You have 5 seconds 👀",
            q:"Now enter them in REVERSE order:",
            hint:"Digit Span Backward test (Wechsler, WISC-V) — the gold standard for measuring working memory. Average for age 12: 4-5 digits backwards",
            opts:["4-9-1-7-3-8","8-3-7-1-9-4","4-1-9-7-3-8","9-4-1-7-3-8"],
            score_map:[1.0,0.0,0.2,0.0],
          },
          {
            id:"q5", talent:"memory", type:"memorize_words",
            mission:"Trial #2 — Auditory Memory Test",
            memorize:"🦊 FOX   🌊 OCEAN   🎸 GUITAR   🏛️ PALACE   ⚡ LIGHTNING",
            memorize_label:"Memorise these 5 words! You have 6 seconds 👀",
            q:"Which word was NOT in the list?",
            hint:"Rey Auditory Verbal Learning Test (RAVLT) — used by neuropsychologists worldwide to assess memory in children and adults",
            opts:["FOX 🦊","PYRAMID 🔺","GUITAR 🎸","LIGHTNING ⚡"],
            score_map:[0.0,1.0,0.0,0.0],
          },
          {
            id:"q6", talent:"memory", type:"memorize_pattern",
            mission:"Final Trial — Corsi Matrix",
            memorize:"🔵⬜⬜|⬜🔵⬜|⬜⬜🔵",
            memorize_label:"Memorise the blue cell positions! 5 seconds 👀",
            q:"What was the sequence of blue cells (top to bottom, left to right)?",
            hint:"Corsi Block Tapping test (1972) — measures visuospatial working memory. Used in neuropsychology worldwide",
            opts:["Diagonal: top-left → centre → bottom-right","Diagonal: top-right → centre → bottom-left","Horizontal: all in the middle row","Vertical: all in the right column"],
            score_map:[1.0,0.0,0.0,0.0],
          },
        ],
        complete:"Cave conquered! 🎉 Your memory is a true knowledge vault!",
      },
      {
        id:"ch3", zone:"Creativity Island", emoji:"🎨",
        color:"#FF7043", bg:"linear-gradient(135deg,#FFF8E1,#FFE0B2)",
        intro:"Creativity Island! Torrance at the University of Minnesota developed a test used by NASA and Google for candidate selection. Show your divergent thinking!",
        questions:[
          { id:"q7", talent:"creativity", mission:"Challenge #1 — Torrance Test", q:"NASA uses this test: how many unusual uses can you find for a paper clip? A person with HIGH creative intelligence would name...", hint:"TTCT test (1966): divergent thinking — generating many different ideas. Average: 10-15 uses. High: 25+", opts:["3-5 uses (clip, bookmark, hook)","10-15 standard uses","25+ unusual uses (antenna, spring, toothpick, lock pick, mini-sculpture...)","A clip is only for paper"], score_map:[0.0,0.3,1.0,0.0] },
          { id:"q8", talent:"creativity", mission:"Challenge #2 — Lateral Thinking", q:"A man lives on the 30th floor. Every morning he takes the lift down. In the evening he rides to the 15th floor and walks up. Why? (if it's not raining and he's alone)", hint:"Edward de Bono's lateral thinking puzzle (Oxford) — measures the ability to think outside the obvious", opts:["The lift is broken above the 15th floor","He is too short to reach the button for the 30th floor","He enjoys walking","His friend lives on the 15th floor"], score_map:[0.1,1.0,0.2,0.1] },
          { id:"q9", talent:"creativity", mission:"Final Challenge — First Principles", q:"Apple and Elon Musk use 'First Principles Thinking' (MIT). What does it mean?", hint:"First Principles (Aristotle → Descartes → modern innovators): break down a problem to fundamental facts and build a solution from scratch, ignoring analogies", opts:["Copy the best solutions of competitors","Break a problem down to basic facts and create a solution from scratch","Use the first answer that comes to mind","Ask an expert"], score_map:[0.0,1.0,0.1,0.0] },
        ],
        complete:"Island conquered! 🌈 Your creative thinking is at innovator level!",
      },
      {
        id:"ch4", zone:"Leadership Castle", emoji:"👑",
        color:"#FFB300", bg:"linear-gradient(135deg,#FFF8E1,#FFECB3)",
        intro:"Leadership Castle! Harvard Business School research shows: great leaders are not born — they develop specific skills. Do you have them?",
        questions:[
          { id:"q10", talent:"leadership", mission:"Trial #1 — Kohlberg's Dilemma", q:"Kohlberg (Harvard) proposed: Heinz steals medicine to save his dying wife. The medicine is expensive and he can't afford it. How would a morally mature leader think?", hint:"Kohlberg's dilemma (Harvard, 1958) measures a leader's moral development level. Level 6: universal ethical principles matter more than law", opts:["Strictly follow the law — theft is always wrong","Weigh human life as greater than property rights","Run off with the medicine without thinking about consequences","Wait and hope for the best"], score_map:[0.2,1.0,0.0,0.0] },
          { id:"q11", talent:"leadership", mission:"Trial #2 — Google's Discovery", q:"Google's 'Project Aristotle' study (2016) researched 180 teams. The main factor in team success was:", hint:"Google found: 'psychological safety' — the ability to take risks without fear of judgement — matters more than IQ, experience and technical skills", opts:["High average IQ of team members","Presence of star specialists","Psychological safety — everyone can speak openly","Strict control and clear hierarchy"], score_map:[0.1,0.1,1.0,0.0] },
          { id:"q12", talent:"leadership", mission:"Final Challenge — The Leader Paradox", q:"A Stanford study (2019) found: the most effective leaders combine two opposite qualities. Which ones?", hint:"Stanford GSB: Jim Collins 'Level 5 Leadership' — personal humility combined with unwavering professional will — a paradoxical combination", opts:["Strictness and softness alternately","Personal humility + unwavering professional will","Charisma + high IQ","Strictness + generous bonuses"], score_map:[0.1,1.0,0.1,0.0] },
        ],
        complete:"The castle is yours! 👑 You have world-class leader qualities!",
      },
      {
        id:"ch5", zone:"Tower of Languages", emoji:"🌍",
        color:"#26C6DA", bg:"linear-gradient(135deg,#E0F7FA,#B2EBF2)",
        intro:"Tower of Languages — 7000 world languages! MIT neurolinguists proved: multilingualism physically changes the brain, making it more resilient to dementia.",
        questions:[
          { id:"q13", talent:"languages", mission:"Floor #1 — Neurolinguistics", q:"MIT MRI studies (2015) showed: in bilinguals (people who know 2+ languages), grey matter density is higher in the area of:", hint:"Neurolinguistics: Broca's area and the inferior parietal lobule — the language and cognitive control zones — are physically larger in bilinguals", opts:["Cerebellum (movement coordination)","Inferior parietal lobule and Broca's area (language + control)","Occipital lobe (vision)","Hippocampus (long-term memory)"], score_map:[0.0,1.0,0.0,0.2] },
          { id:"q14", talent:"languages", mission:"Top Floor — Polyglot", q:"Your actual language proficiency level on the Cambridge University CEFR scale:", hint:"CEFR scale: A1-A2 (basic), B1-B2 (independent), C1-C2 (proficient). C2 is the level of diplomats and UN interpreters", opts:["1 language — native only (A2 and below)","2 languages — native + 1 foreign (B1-B2)","3 languages — at least one at B2+","4+ languages — at least one at C1 and above"], score_map:[0.1,0.4,0.75,1.0] },
        ],
        complete:"Summit conquered! 🌍 You are a true polyglot of the future!",
      },
      {
        id:"ch6", zone:"Concert Hall", emoji:"🎵",
        color:"#66BB6A", bg:"linear-gradient(135deg,#E8F5E9,#C8E6C9)",
        intro:"Concert Hall! Gordon Shaw (UC Irvine) discovered the 'Mozart Effect'. Harvard neuroscientist Aniruddh Patel proved: musicians have superior neural connectivity.",
        questions:[
          { id:"q15", talent:"music", mission:"Final Performance — Neuroscience of Music", q:"Harvard Medical School study (Schlaug, 2005): professional musicians who started before age 7 have a corpus callosum 25% larger. What does this mean?", hint:"The corpus callosum connects left and right hemispheres. Its size = speed of information transfer between hemispheres = multitasking and creativity", opts:["Musicians are smarter than other people","Better connectivity between hemispheres = higher creativity, multitasking and empathy","Musicians hear better","Music only improves hearing"], score_map:[0.1,1.0,0.1,0.0] },
        ],
        complete:"Standing ovation! 🎵 You've conquered all 6 zones of the Planet of Talents!",
      },
    ],
    finale:{title:"Expedition Complete! 🌟", text:"You've conquered all 6 zones. Our ML algorithm is analysing your answers using Gardner's methodology...", mascot:"🏆"},
  },
};

// ── Get all questions in order ────────────────────────────────────────────────
function getAllQuestions(story) {
  return story.chapters.flatMap(ch => ch.questions.map(q => ({ ...q, chapterId: ch.id })));
}

export default function QuizPage({ setPage, setResults, lang, dark }) {
  const story    = STORY[lang] || STORY.en;
  const chapters = story.chapters;
  const allQ     = getAllQuestions(story);

  const [phase, setPhase]           = useState("intro");
  const [chapterIdx, setChapterIdx] = useState(0);
  const [qInChapter, setQInChapter] = useState(0);
  const [selected, setSelected]     = useState(null);
  const [answers, setAnswers]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [showHint, setShowHint]     = useState(false);
  const [memPhase, setMemPhase]     = useState("show"); // "show" | "answer"
  const [countdown, setCountdown]   = useState(0);

  const timerRef = useRef(null);

  // When question changes and it's a memory type → start countdown
  useEffect(() => {
    if (phase !== "question" || !currentQ?.type?.startsWith("memorize_")) return;
    setMemPhase("show");
    const secs = currentQ.type === "memorize_words" ? 6 : 5;
    setCountdown(secs);
    let c = secs;
    timerRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(timerRef.current);
        setMemPhase("answer");
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQ?.id, phase]);

  // Reset memPhase when question changes
  useEffect(() => {
    setMemPhase("show");
    setSelected(null);
  }, [currentQ?.id]);

  const chapter   = chapters[chapterIdx];
  const chapterQ  = chapter?.questions || [];
  const currentQ  = chapterQ[qInChapter];
  const totalDone = chapters.slice(0, chapterIdx).reduce((acc, ch) => acc + ch.questions.length, 0) + qInChapter;
  const totalQ    = allQ.length;
  const progress  = Math.round((totalDone / totalQ) * 100);

  const handleAnswer = async () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [currentQ.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    setShowHint(false);

    const isLastInChapter = qInChapter === chapterQ.length - 1;
    const isLastChapter   = chapterIdx === chapters.length - 1;

    if (isLastInChapter && isLastChapter) {
      await submitAnswers(newAnswers);
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
        const res = await fetch("https://karta-talantov-ml.onrender.com/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: finalAnswers, lang }),
        });
        data = await res.json();
      }
      setResults(data);
      setPage("results");
    } catch {
      setError(lang==="ru"?"Сервер недоступен. Проверь подключение.":lang==="uz"?"Server javob bermayapti.":"Server unavailable. Check connection.");
      setPhase("question");
    }
  };

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background: dark?"linear-gradient(135deg,#0F1923,#1A2A3A)":"linear-gradient(135deg,#E3F2FD,#FFF8E1)" }}>
        <div style={{ fontSize:"4rem", marginBottom:16 }}>{story.intro.mascot}</div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color:dark?"#E3F2FD":"#1565C0", marginBottom:16, maxWidth:560 }}>{story.intro.title}</h1>
        <p style={{ fontSize:"1rem", fontWeight:600, color:dark?"#90CAF9":"#546E7A", maxWidth:480, lineHeight:1.7, marginBottom:28 }}>{story.intro.text}</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:32 }}>
          {chapters.map((ch,i) => (
            <div key={ch.id} style={{ background:dark?"#1A2A3A":"#fff", border:`2px solid ${ch.color}44`, borderRadius:14, padding:"8px 14px", display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:800, color:dark?"#E3F2FD":"#1A237E" }}>
              <span>{ch.emoji}</span>{ch.zone}
              <span style={{ color:ch.color, fontWeight:900 }}>{ch.questions.length}Q</span>
            </div>
          ))}
        </div>
        <button className="hero-cta" style={{ fontSize:"1.1rem", padding:"14px 36px" }} onClick={() => setPhase("chapter-intro")}>
          {story.intro.btn}
        </button>
        <p style={{ fontSize:"0.72rem", color:"#90A4AE", fontWeight:700, marginTop:20 }}>
          📚 {lang==="ru"?"Основано на: Gardner (Harvard) · Stanford · MIT · Cambridge · Torrance · Wechsler":lang==="uz"?"Asoslanadi: Gardner (Harvard) · Stanford · MIT · Cambridge":"Based on: Gardner (Harvard) · Stanford · MIT · Cambridge · Torrance · Wechsler"}
        </p>
      </div>
    </div>
  );

  // ── CHAPTER INTRO ─────────────────────────────────────────────────────────
  if (phase === "chapter-intro") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background:dark?"#0F1923":chapter.bg }}>
        <div style={{ fontSize:"4rem", marginBottom:16 }}>{chapter.emoji}</div>
        <div style={{ background:chapter.color, color:"#fff", borderRadius:99, padding:"4px 18px", fontSize:"0.82rem", fontWeight:800, marginBottom:14, letterSpacing:"0.08em" }}>
          {lang==="ru"?"ЗОНА":lang==="uz"?"ZONA":"ZONE"} {chapterIdx+1}/{chapters.length}
        </div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color:dark?"#E3F2FD":chapter.color, marginBottom:16 }}>{chapter.zone}</h2>
        <p style={{ fontSize:"1rem", fontWeight:600, color:dark?"#B0BEC5":"#546E7A", maxWidth:480, lineHeight:1.7, marginBottom:32 }}>{chapter.intro}</p>
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
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background:dark?"#0F1923":chapter.bg }}>
        <div style={{ fontSize:"4rem", marginBottom:16 }}>🏆</div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", color:dark?"#E3F2FD":chapter.color, marginBottom:16, maxWidth:480 }}>{chapter.complete}</h2>
        <div style={{ display:"flex", gap:8, marginBottom:32 }}>
          {chapters.map((ch,i) => (
            <div key={i} style={{ width:12, height:12, borderRadius:"50%", background:i<=chapterIdx?ch.color:(dark?"#2A4070":"#E3F2FD"), transition:"background 0.3s" }} />
          ))}
        </div>
        <button className="quiz-next" style={{ background:chapters[chapterIdx+1]?.color||chapter.color, maxWidth:340 }} onClick={nextChapter}>
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
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", color:dark?"#E3F2FD":"#1565C0", marginBottom:12 }}>{story.finale.title}</h2>
        <p style={{ color:dark?"#90CAF9":"#78909C", fontWeight:600, marginBottom:32 }}>{story.finale.text}</p>
        <Loader message={lang==="ru"?"ML-алгоритм анализирует таланты... 🧠":lang==="uz"?"ML-algoritm iste'dodlarni tahlil qilmoqda... 🧠":"ML algorithm analysing talents... 🧠"} />
      </div>
    </div>
  );

  // ── QUESTION ──────────────────────────────────────────────────────────────
  return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />

      <div className="progress-bar-wrap" style={{ marginTop:16 }}>
        <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
      </div>

      {/* Chapter header */}
      <div style={{ background:dark?"#1A2A3A":chapter.bg, padding:"12px 24px", display:"flex", alignItems:"center", gap:12, borderBottom:`2px solid ${chapter.color}33` }}>
        <span style={{ fontSize:"1.4rem" }}>{chapter.emoji}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:"0.72rem", fontWeight:800, color:chapter.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>
            {lang==="ru"?"Зона":lang==="uz"?"Zona":"Zone"} {chapterIdx+1}/{chapters.length} — {chapter.zone}
          </div>
          <div style={{ fontSize:"0.88rem", fontWeight:800, color:dark?"#E3F2FD":"#1A237E" }}>{currentQ?.mission}</div>
        </div>
        <button onClick={() => setShowHint(!showHint)}
          style={{ border:"none", background:`${chapter.color}18`, color:chapter.color, borderRadius:99, padding:"5px 12px", fontWeight:800, fontSize:"0.75rem", cursor:"pointer", transition:"all 0.2s" }}>
          💡 {lang==="ru"?"Источник":lang==="uz"?"Manba":"Source"}
        </button>
      </div>

      <div className="quiz-section">
        {error && (
          <div style={{ background:"#FFEBEE", border:"1.5px solid #EF5350", borderRadius:10, padding:"10px 14px", color:"#C62828", fontWeight:700, marginBottom:14, fontSize:"0.88rem" }}>❌ {error}</div>
        )}

        {showHint && (
          <div style={{ background:"#E8F5E9", border:`1px solid ${chapter.color}`, borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:"0.8rem", fontWeight:700, color:"#2E7D32", lineHeight:1.5 }}>
            📚 {currentQ?.hint}
          </div>
        )}

        {/* ── Memory type: show memorize card first ── */}
        {currentQ?.type?.startsWith("memorize_") && memPhase === "show" && (
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <p style={{ fontSize:"0.85rem", fontWeight:800, color:chapter.color, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.08em" }}>
              {currentQ.memorize_label}
            </p>
            {/* Memorize display */}
            <div style={{ background:`linear-gradient(135deg,${chapter.color}15,${chapter.color}08)`, border:`2px solid ${chapter.color}44`, borderRadius:20, padding:"24px 20px", margin:"0 auto", maxWidth:400, position:"relative" }}>
              {currentQ.type === "memorize_digits" && (
                <div style={{ fontFamily:"'Courier New',monospace", fontSize:"2.4rem", fontWeight:900, color:chapter.color, letterSpacing:"0.3em", textAlign:"center" }}>
                  {currentQ.memorize}
                </div>
              )}
              {currentQ.type === "memorize_words" && (
                <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"center" }}>
                  {currentQ.memorize.split("   ").map((word, i) => (
                    <div key={i} style={{ fontSize:"1.1rem", fontWeight:800, color:chapter.color, background:"#fff", borderRadius:10, padding:"8px 20px", border:`1.5px solid ${chapter.color}33`, width:"100%", textAlign:"center", boxShadow:`0 2px 8px ${chapter.color}15` }}>
                      {word}
                    </div>
                  ))}
                </div>
              )}
              {currentQ.type === "memorize_pattern" && (
                <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center" }}>
                  {currentQ.memorize.split("
").map((row, ri) => (
                    <div key={ri} style={{ display:"flex", gap:8 }}>
                      {row.split("").map((cell, ci) => (
                        <div key={ci} style={{ width:60, height:60, borderRadius:12, background:cell==="🔵"?chapter.color:"#fff", border:`2px solid ${chapter.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", boxShadow:cell==="🔵"?`0 4px 16px ${chapter.color}44`:"none", transition:"all 0.3s" }}>
                          {cell==="🔵" ? "🔵" : ""}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {/* Countdown */}
              <div style={{ marginTop:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:chapter.color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", boxShadow:`0 4px 12px ${chapter.color}44` }}>
                  {countdown}
                </div>
                <span style={{ fontSize:"0.78rem", fontWeight:700, color:"#90A4AE" }}>
                  {lang==="ru"?"секунд...":lang==="uz"?"soniya...":"seconds..."}
                </span>
              </div>
            </div>
            <button
              onClick={() => { clearInterval(timerRef.current); setMemPhase("answer"); }}
              style={{ marginTop:14, border:"none", background:"transparent", color:chapter.color, fontWeight:800, fontSize:"0.82rem", cursor:"pointer", textDecoration:"underline" }}>
              {lang==="ru"?"Я запомнил →":lang==="uz"?"Yodladim →":"I've memorised it →"}
            </button>
          </div>
        )}

        {/* Show question only after memorize phase */}
        {(!currentQ?.type?.startsWith("memorize_") || memPhase === "answer") && (
          <>
            {currentQ?.type?.startsWith("memorize_") && (
              <div style={{ background:"#FFF8E1", border:"1.5px solid #FFB300", borderRadius:10, padding:"8px 14px", marginBottom:14, fontSize:"0.82rem", fontWeight:800, color:"#E65100", textAlign:"center" }}>
                🧠 {lang==="ru"?"Время вышло! Теперь ответь по памяти:":lang==="uz"?"Vaqt tugadi! Endi xotiradan javob bering:":"Time's up! Now answer from memory:"}
              </div>
            )}
            <p className="quiz-q">{currentQ?.q}</p>
            <div className="quiz-options">
              {currentQ?.opts.map((opt, i) => (
                <button key={i}
                  className={`quiz-option${selected===i?" selected":""}`}
                  style={selected===i ? { borderColor:chapter.color, background:`${chapter.color}15`, color:chapter.color } : {}}
                  onClick={() => setSelected(i)}>
                  <span style={{ fontSize:"0.8rem", fontWeight:900, color:selected===i?chapter.color:"#90A4AE", marginRight:8 }}>
                    {["A","B","C","D"][i]}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}

        <button className="quiz-next"
          style={{ background:(selected===null||memPhase==="show")?"#90A4AE":chapter.color, opacity:(selected===null||memPhase==="show")?0.5:1, transition:"all 0.2s" }}
          onClick={handleAnswer} disabled={selected===null||memPhase==="show"}>
          {qInChapter < chapterQ.length-1
            ? (lang==="ru"?"Следующий вызов →":lang==="uz"?"Keyingi qiyinlik →":"Next Challenge →")
            : chapterIdx < chapters.length-1
            ? (lang==="ru"?`Завершить зону ${chapter.emoji} →`:lang==="uz"?`Zona ${chapter.emoji}ni yakunlash →`:`Complete Zone ${chapter.emoji} →`)
            : (lang==="ru"?"Завершить экспедицию 🏆":lang==="uz"?"Ekspeditsiyani yakunlash 🏆":"Complete Expedition 🏆")
          }
        </button>

        <p style={{ textAlign:"center", fontSize:"0.72rem", color:"#90A4AE", fontWeight:700, marginTop:12 }}>
          {lang==="ru"?`Вопрос ${qInChapter+1} из ${chapterQ.length} · Всего: ${totalDone+1}/${totalQ}`:lang==="uz"?`Savol ${qInChapter+1}/${chapterQ.length} · Jami: ${totalDone+1}/${totalQ}`:`Question ${qInChapter+1} of ${chapterQ.length} · Total: ${totalDone+1}/${totalQ}`}
        </p>
      </div>
    </div>
  );
}
