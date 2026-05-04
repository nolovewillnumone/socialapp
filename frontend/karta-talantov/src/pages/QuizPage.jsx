import { useState } from "react";
import Nav from "../components/Nav";
import Loader from "../components/Loader";
import { quizAPI } from "../api/client";

// ── INTEREST-BASED QUIZ ───────────────────────────────────────────────────────
// Based on Gardner's Multiple Intelligences self-assessment model
// Questions ask about what kids LOVE to do, not what they can do
// This is the correct approach used by schools worldwide

const STORY = {
  ru: {
    intro: {
      title: "Узнай свои таланты! 🌟",
      text: "Это не экзамен — здесь нет правильных или неправильных ответов! Просто отвечай честно о том, что тебе нравится делать. Мы найдём твои настоящие таланты!",
      btn: "Начать →",
      mascot: "🌟",
      note: "15 вопросов · 5 минут · Честные ответы = точный результат",
    },
    chapters: [
      {
        id:"ch1", zone:"Что ты любишь?", emoji:"❤️",
        color:"#E91E63", bg:"linear-gradient(135deg,#FCE4EC,#F8BBD9)",
        intro:"Расскажи нам о своих любимых занятиях! Чем ты занимаешься, когда тебе скучно или у тебя есть свободное время?",
        questions: [
          {
            id:"q1", talent:"logic",
            mission:"Свободное время",
            q:"Когда у тебя есть свободное время, ты чаще всего...",
            opts:["Решаешь головоломки, играешь в шахматы или собираешь кубик Рубика 🧩","Рисуешь, лепишь или создаёшь что-то руками 🎨","Слушаешь музыку или играешь на инструменте 🎵","Общаешься с друзьями или организуешь игры 👥"],
            score_map:{"logic":1.0,"creativity":0.8,"music":0.8,"leadership":0.8},
          },
          {
            id:"q2", talent:"creativity",
            mission:"Любимый предмет",
            q:"Какой школьный предмет тебе нравится больше всего?",
            opts:["Математика или информатика 💻","Рисование, музыка или технология 🎨","Литература или иностранные языки 📚","История или обществознание 🌍"],
            score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":0.8},
          },
          {
            id:"q3", talent:"leadership",
            mission:"В группе друзей",
            q:"Когда ты в группе друзей или одноклассников, ты обычно...",
            opts:["Предлагаешь идеи и организуешь всех 👑","Придумываешь креативные сценарии для игр 🎭","Следишь за тем, чтобы всем было хорошо и комфортно 💙","Предпочитаешь слушать и поддерживать других 🤝"],
            score_map:{"leadership":1.0,"creativity":0.8,"leadership":1.0,"memory":0.6},
          },
        ],
        complete:"Отлично! Мы узнали о твоих любимых занятиях! 🎉",
      },
      {
        id:"ch2", zone:"Твои увлечения", emoji:"🎯",
        color:"#9C27B0", bg:"linear-gradient(135deg,#F3E5F5,#E1BEE7)",
        intro:"Теперь расскажи о своих увлечениях и хобби. Что заставляет тебя забыть о времени?",
        questions: [
          {
            id:"q4", talent:"music",
            mission:"Музыка в жизни",
            q:"Как музыка присутствует в твоей жизни?",
            opts:["Играю на инструменте или пою — это моя страсть! 🎹","Всегда слушаю музыку, замечаю мелодии везде 🎧","Музыка мне нравится, но это не главное увлечение 🎵","Предпочитаю тишину или другие занятия 📖"],
            score_map:{"music":1.0,"music":0.8,"music":0.4,"logic":0.3},
          },
          {
            id:"q5", talent:"creativity",
            mission:"Творчество",
            q:"Что из перечисленного приносит тебе наибольшее удовольствие?",
            opts:["Рисовать, создавать дизайны или снимать видео 🎬","Писать рассказы, стихи или вести дневник ✍️","Конструировать, программировать или строить 🔧","Танцевать, выступать или играть в театре 🎭"],
            score_map:{"creativity":1.0,"languages":1.0,"logic":1.0,"music":0.8},
          },
          {
            id:"q6", talent:"languages",
            mission:"Книги и языки",
            q:"Как ты относишься к чтению и языкам?",
            opts:["Обожаю читать — книги, статьи, всё подряд! 📚","Интересуюсь иностранными языками, учу новые слова 🌍","Читаю, только когда интересная тема 📖","Предпочитаю смотреть видео или слушать 🎬"],
            score_map:{"languages":1.0,"languages":1.0,"memory":0.5,"music":0.4},
          },
        ],
        complete:"Замечательно! Твои увлечения многое говорят о тебе! ✨",
      },
      {
        id:"ch3", zone:"Как ты думаешь?", emoji:"💭",
        color:"#2196F3", bg:"linear-gradient(135deg,#E3F2FD,#BBDEFB)",
        intro:"Расскажи нам о том, как ты воспринимаешь мир вокруг себя. Что привлекает твоё внимание?",
        questions: [
          {
            id:"q7", talent:"logic",
            mission:"Интересные задачи",
            q:"Что тебя больше всего интересует и увлекает?",
            opts:["Как работают вещи, механизмы и технологии ⚙️","Почему люди ведут себя так или иначе 🧠","Как создаются красивые вещи — дизайн и искусство 🎨","Как общаться и понимать разных людей 🤝"],
            score_map:{"logic":1.0,"leadership":0.9,"creativity":1.0,"languages":0.9},
          },
          {
            id:"q8", talent:"leadership",
            mission:"Лидерство",
            q:"Если нужно организовать мероприятие в классе, ты...",
            opts:["С удовольствием возьмёшь на себя роль организатора! 🌟","Предложишь несколько творческих идей для мероприятия 💡","Поможешь сделать красивое оформление и декор 🎨","Постараешься, чтобы всем было комфортно и весело 😊"],
            score_map:{"leadership":1.0,"creativity":0.8,"creativity":1.0,"leadership":0.8},
          },
          {
            id:"q9", talent:"creativity",
            mission:"Твой идеальный проект",
            q:"Если бы у тебя был школьный проект на любую тему, ты бы выбрал:",
            opts:["Создать приложение или сайт 💻","Нарисовать комикс или снять короткометражку 🎬","Изучить другую культуру и её язык 🌏","Организовать благотворительное мероприятие 🤲"],
            score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":1.0},
          },
        ],
        complete:"Прекрасно! Мы всё лучше понимаем твой уникальный характер! 🌈",
      },
      {
        id:"ch4", zone:"Твоя мечта", emoji:"🚀",
        color:"#FF9800", bg:"linear-gradient(135deg,#FFF3E0,#FFE0B2)",
        intro:"Поговорим о будущем! Что тебя вдохновляет и о чём ты мечтаешь?",
        questions: [
          {
            id:"q10", talent:"logic",
            mission:"Кем ты хочешь стать?",
            q:"Когда ты думаешь о будущей профессии, тебя больше привлекает:",
            opts:["Работать с технологиями, наукой или математикой 🔬","Создавать — искусство, музыку, кино или игры 🎮","Помогать людям — врач, психолог или педагог 💙","Путешествовать, изучать мир и разные культуры ✈️"],
            score_map:{"logic":1.0,"creativity":1.0,"leadership":1.0,"languages":1.0},
          },
          {
            id:"q11", talent:"music",
            mission:"Музыкальная душа",
            q:"Что ты думаешь о музыке?",
            opts:["Музыка — это моя жизнь! Я не могу без неё 🎼","Люблю музыку и хотел бы научиться играть 🎸","Музыка мне нравится, слушаю в фоне 🎵","Другие занятия интереснее, чем музыка 📚"],
            score_map:{"music":1.0,"music":0.85,"music":0.5,"logic":0.4},
          },
          {
            id:"q12", talent:"leadership",
            mission:"Твоя суперсила",
            q:"Если бы у тебя была одна суперсила, ты бы выбрал:",
            opts:["Решать любые сложные задачи мгновенно 🧠","Создавать шедевры — рисовать, писать, сочинять 🎨","Понимать и говорить на всех языках мира 🌍","Вдохновлять людей и вести их за собой 👑"],
            score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":1.0},
          },
        ],
        complete:"Потрясающе! Твои мечты показывают твой настоящий потенциал! 🌟",
      },
      {
        id:"ch5", zone:"Ты в деле", emoji:"⚡",
        color:"#4CAF50", bg:"linear-gradient(135deg,#E8F5E9,#C8E6C9)",
        intro:"Последние вопросы! Расскажи нам о том, как ты действуешь в реальных ситуациях.",
        questions: [
          {
            id:"q13", talent:"creativity",
            mission:"Выходные",
            q:"Идеальные выходные для тебя — это:",
            opts:["Создать что-то новое: нарисовать, написать, сделать 🖌️","Изучить новый язык, посмотреть документальный фильм 🎬","Поиграть в логические игры или программировать 💻","Сходить с друзьями куда-нибудь и пообщаться 🎪"],
            score_map:{"creativity":1.0,"languages":0.9,"logic":1.0,"leadership":0.8},
          },
          {
            id:"q14", talent:"languages",
            mission:"Общение",
            q:"Когда ты общаешься с новыми людьми, ты...",
            opts:["Быстро находишь общий язык и много разговариваешь 🗣️","Слушаешь и наблюдаешь, прежде чем говорить 👁️","Предлагаешь интересные темы или игры для разговора 💡","Чаще предпочитаешь быть наедине с собой 📚"],
            score_map:{"languages":1.0,"memory":0.8,"leadership":0.9,"logic":0.5},
          },
          {
            id:"q15", talent:"logic",
            mission:"Финальный вопрос",
            q:"Что тебя больше всего описывает?",
            opts:["Я люблю понимать, КАК и ПОЧЕМУ работают вещи 🔍","Я выражаю себя через творчество и создание 🌈","Я нахожу удовольствие в словах, языках и историях 📖","Я чувствую себя живым, когда помогаю и вдохновляю других 💫"],
            score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":1.0},
          },
        ],
        complete:"Ты прошёл все зоны! Наш AI анализирует твои ответы... 🚀",
      },
    ],
    finale:{
      title:"Анализируем твои таланты! 🌟",
      text:"Секунду... Наш ML-алгоритм изучает твои ответы и составляет персональную карту талантов!",
      mascot:"🏆",
    },
  },

  uz: {
    intro:{
      title:"Iste'dodlaringizni bilib oling! 🌟",
      text:"Bu imtihon emas — bu yerda to'g'ri yoki noto'g'ri javoblar yo'q! Faqat sevgan narsalaringiz haqida to'g'ridan-to'g'ri javob bering. Biz sizning haqiqiy iste'dodlaringizni topamiz!",
      btn:"Boshlash →",
      mascot:"🌟",
      note:"15 savol · 5 daqiqa · Halol javoblar = aniq natija",
    },
    chapters:[
      {
        id:"ch1", zone:"Nima yaxshi ko'rasiz?", emoji:"❤️",
        color:"#E91E63", bg:"linear-gradient(135deg,#FCE4EC,#F8BBD9)",
        intro:"Sevimli mashg'ulotlaringiz haqida gapiring! Bo'sh vaqtingizda nima qilasiz?",
        questions:[
          { id:"q1", talent:"logic", mission:"Bo'sh vaqt", q:"Bo'sh vaqtingizda ko'pincha nima qilasiz?", opts:["Boshqotirmalar, shaxmat yoki Rubik kubini yechasiz 🧩","Chizasiz, yasaysiz yoki biror narsa yaratasiz 🎨","Musiqa tinglaysiz yoki cholg'u asbobi chalasiz 🎵","Do'stlar bilan muloqot qilasiz yoki o'yinlar tashkil qilasiz 👥"], score_map:{"logic":1.0,"creativity":0.8,"music":0.8,"leadership":0.8} },
          { id:"q2", talent:"creativity", mission:"Sevimli fan", q:"Qaysi maktab fani sizga ko'proq yoqadi?", opts:["Matematika yoki informatika 💻","Rasm, musiqa yoki texnologiya 🎨","Adabiyot yoki xorijiy tillar 📚","Tarix yoki ijtimoiyot 🌍"], score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":0.8} },
          { id:"q3", talent:"leadership", mission:"Do'stlar guruhida", q:"Do'stlar yoki sinfdoshlar guruhida qanday bo'lasiz?", opts:["G'oyalar taklif qilasiz va hammasini tashkil qilasiz 👑","O'yinlar uchun ijodiy stsenariylar o'ylaysiz 🎭","Hammaga yaxshi va qulay bo'lishini kuzatasiz 💙","Tinglashni va boshqalarni qo'llashni afzal ko'rasiz 🤝"], score_map:{"leadership":1.0,"creativity":0.8,"leadership":1.0,"memory":0.6} },
        ],
        complete:"Ajoyib! Sevimli mashg'ulotlaringiz haqida bildik! 🎉",
      },
      {
        id:"ch2", zone:"Qiziqishlaringiz", emoji:"🎯",
        color:"#9C27B0", bg:"linear-gradient(135deg,#F3E5F5,#E1BEE7)",
        intro:"Endi qiziqishlaringiz va hobbingiz haqida gapiring. Vaqtni unuttiradigan narsa nima?",
        questions:[
          { id:"q4", talent:"music", mission:"Musiqadagi o'rin", q:"Musiqa hayotingizda qanday o'rin tutadi?", opts:["Cholg'u asbobi chalaman yoki qo'shiq aytaman — bu mening ehtirosim! 🎹","Har doim musiqa tinglaymanlar va melodiyalarni hamma yerda sezaman 🎧","Musiqa yaxshi, lekin asosiy qiziqishim emas 🎵","Jimlikni yoki boshqa mashg'ulotlarni afzal ko'raman 📖"], score_map:{"music":1.0,"music":0.8,"music":0.4,"logic":0.3} },
          { id:"q5", talent:"creativity", mission:"Ijodkorlik", q:"Quyidagilardan qaysi biri sizga eng ko'p zavq beradi?", opts:["Chizish, dizayn yaratish yoki video tushirish 🎬","Hikoya, she'r yozish yoki kundalik yuritish ✍️","Konstruksiya qilish, dasturlash yoki qurilish 🔧","Raqs, sahna chiqishi yoki teatr 🎭"], score_map:{"creativity":1.0,"languages":1.0,"logic":1.0,"music":0.8} },
          { id:"q6", talent:"languages", mission:"Kitob va tillar", q:"O'qish va tillarga qanday munosabatdasiz?", opts:["Kitob o'qishni yaxshi ko'raman — kitoblar, maqolalar, hammasi! 📚","Xorijiy tillarga qiziqaman, yangi so'zlar o'rganaman 🌍","Faqat qiziqarli mavzu bo'lsa o'qiyman 📖","Video tomosha qilish yoki tinglashni afzal ko'raman 🎬"], score_map:{"languages":1.0,"languages":1.0,"memory":0.5,"music":0.4} },
        ],
        complete:"Ajoyib! Qiziqishlaringiz siz haqingizda ko'p narsani aytadi! ✨",
      },
      {
        id:"ch3", zone:"Qanday fikrlaysiz?", emoji:"💭",
        color:"#2196F3", bg:"linear-gradient(135deg,#E3F2FD,#BBDEFB)",
        intro:"Atrofdagi dunyoni qanday qabul qilishingiz haqida gapiring. Nima e'tiboringizni tortadi?",
        questions:[
          { id:"q7", talent:"logic", mission:"Qiziqarli vazifalar", q:"Sizni eng ko'p nima qiziqtiradi?", opts:["Narsalar, mexanizmlar va texnologiyalar qanday ishlashi ⚙️","Odamlar nima uchun shunday harakat qilishlari 🧠","Chiroyli narsalar qanday yaratilishi — dizayn va san'at 🎨","Turli odamlar bilan muloqot qilish va tushunish 🤝"], score_map:{"logic":1.0,"leadership":0.9,"creativity":1.0,"languages":0.9} },
          { id:"q8", talent:"leadership", mission:"Liderlik", q:"Sinfda tadbir tashkil qilish kerak bo'lsa, siz...", opts:["Mamnuniyat bilan tashkilotchi rolini o'z zimmangizga olasiz! 🌟","Tadbir uchun bir nechta ijodiy g'oyalar taklif qilasiz 💡","Chiroyli bezatish va dekoratsiya qilishga yordam berasiz 🎨","Hammaga qulay va qiziqarli bo'lishiga harakat qilasiz 😊"], score_map:{"leadership":1.0,"creativity":0.8,"creativity":1.0,"leadership":0.8} },
          { id:"q9", talent:"creativity", mission:"Ideal loyiha", q:"Istalgan mavzuda maktab loyihangiz bo'lsa, tanlagan bo'lardingiz:", opts:["Ilova yoki veb-sayt yaratish 💻","Komiks chizish yoki qisqa metraj film tushirish 🎬","Boshqa madaniyat va tilni o'rganish 🌏","Xayriya tadbirini tashkil qilish 🤲"], score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":1.0} },
        ],
        complete:"Zo'r! Sizning noyob xarakteringizni tobora yaxshiroq tushunyapmiz! 🌈",
      },
      {
        id:"ch4", zone:"Sizning orzuyingiz", emoji:"🚀",
        color:"#FF9800", bg:"linear-gradient(135deg,#FFF3E0,#FFE0B2)",
        intro:"Kelajak haqida gaplashamiz! Sizni nima ilhomlantiradi va nima haqida orzu qilasiz?",
        questions:[
          { id:"q10", talent:"logic", mission:"Kim bo'lmoqchisiz?", q:"Kelajakdagi kasb haqida o'ylaganingizda, sizni ko'proq nima jalb qiladi:", opts:["Texnologiya, fan yoki matematika bilan ishlash 🔬","Yaratish — san'at, musiqa, kino yoki o'yinlar 🎮","Odamlarga yordam berish — shifokor, psixolog yoki pedagog 💙","Sayohat qilish, dunyo va turli madaniyatlarni o'rganish ✈️"], score_map:{"logic":1.0,"creativity":1.0,"leadership":1.0,"languages":1.0} },
          { id:"q11", talent:"music", mission:"Musiqiy ruh", q:"Musiqa haqida nima deb o'ylaysiz?", opts:["Musiqa — bu mening hayotim! Men usiz yasha olmayman 🎼","Musiqani yaxshi ko'raman va chalishni o'rganmoqchiman 🎸","Musiqa yaxshi, fonda tinglaymanlar 🎵","Musiqadan ko'ra boshqa mashg'ulotlar qiziqroq 📚"], score_map:{"music":1.0,"music":0.85,"music":0.5,"logic":0.4} },
          { id:"q12", talent:"leadership", mission:"Sizning superkuchingiz", q:"Bitta superkuch bo'lganida, tanlagan bo'lardingiz:", opts:["Istalgan murakkab masalani bir zumda hal qilish 🧠","Shoh asarlar yaratish — chizish, yozish, bastakorlik 🎨","Dunyodagi barcha tillarda gapirish va tushunish 🌍","Odamlarni ilhomlantirib, ularni ergashtirib borish 👑"], score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":1.0} },
        ],
        complete:"Hayratlanarli! Orzularingiz haqiqiy potentsialingizni ko'rsatadi! 🌟",
      },
      {
        id:"ch5", zone:"Siz harakatda", emoji:"⚡",
        color:"#4CAF50", bg:"linear-gradient(135deg,#E8F5E9,#C8E6C9)",
        intro:"Oxirgi savollar! Haqiqiy vaziyatlarda qanday harakat qilishingiz haqida gapiring.",
        questions:[
          { id:"q13", talent:"creativity", mission:"Dam olish kunlari", q:"Ideal dam olish kunlari siz uchun:", opts:["Yangi narsa yaratish: chizish, yozish, qilish 🖌️","Yangi til o'rganish, hujjatli film ko'rish 🎬","Mantiqiy o'yinlar o'ynash yoki dasturlash 💻","Do'stlar bilan bir joyga borish va muloqot qilish 🎪"], score_map:{"creativity":1.0,"languages":0.9,"logic":1.0,"leadership":0.8} },
          { id:"q14", talent:"languages", mission:"Muloqot", q:"Yangi odamlar bilan muloqotda, siz...", opts:["Tez til topasiz va ko'p gaplashasiz 🗣️","Gapirmadan oldin tinglaysiz va kuzatasiz 👁️","Suhbat uchun qiziqarli mavzular yoki o'yinlar taklif qilasiz 💡","Yolg'iz bo'lishni afzal ko'rasiz 📚"], score_map:{"languages":1.0,"memory":0.8,"leadership":0.9,"logic":0.5} },
          { id:"q15", talent:"logic", mission:"Yakuniy savol", q:"Sizni eng yaxshi tavsiflaydigan narsa:", opts:["Men narsalar QANDAY va NIMA UCHUN ishlashini tushunishni yaxshi ko'raman 🔍","Men ijodkorlik va yaratish orqali o'zimni ifodalaymanlar 🌈","Men so'zlar, tillar va hikoyalarda zavq topaman 📖","Men boshqalarga yordam berganimda va ilhomlantirganimda o'zimni tirikdek his qilaman 💫"], score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":1.0} },
        ],
        complete:"Siz barcha zonalarni zabt etdingiz! AI javoblaringizni tahlil qilmoqda... 🚀",
      },
    ],
    finale:{
      title:"Iste'dodlaringiz tahlil qilinmoqda! 🌟",
      text:"Bir lahza... ML-algoritmimiz javoblaringizni o'rganib, shaxsiy iste'dod xaritasini tuzmoqda!",
      mascot:"🏆",
    },
  },

  en: {
    intro:{
      title:"Discover Your Talents! 🌟",
      text:"This is NOT an exam — there are no right or wrong answers here! Just answer honestly about what you love to do. We'll find your real talents!",
      btn:"Start →",
      mascot:"🌟",
      note:"15 questions · 5 minutes · Honest answers = accurate results",
    },
    chapters:[
      {
        id:"ch1", zone:"What Do You Love?", emoji:"❤️",
        color:"#E91E63", bg:"linear-gradient(135deg,#FCE4EC,#F8BBD9)",
        intro:"Tell us about your favourite activities! What do you do when you're bored or have free time?",
        questions:[
          { id:"q1", talent:"logic", mission:"Free Time", q:"When you have free time, you usually...", opts:["Solve puzzles, play chess or do a Rubik's cube 🧩","Draw, sculpt or create something with your hands 🎨","Listen to music or play an instrument 🎵","Hang out with friends or organise games 👥"], score_map:{"logic":1.0,"creativity":0.8,"music":0.8,"leadership":0.8} },
          { id:"q2", talent:"creativity", mission:"Favourite Subject", q:"Which school subject do you enjoy the most?", opts:["Maths or computer science 💻","Art, music or technology 🎨","Literature or foreign languages 📚","History or social studies 🌍"], score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":0.8} },
          { id:"q3", talent:"leadership", mission:"In a Group", q:"When you're in a group of friends or classmates, you usually...", opts:["Suggest ideas and organise everyone 👑","Come up with creative scenarios for games 🎭","Make sure everyone feels comfortable and happy 💙","Prefer to listen and support others 🤝"], score_map:{"leadership":1.0,"creativity":0.8,"leadership":1.0,"memory":0.6} },
        ],
        complete:"Great! We've learned about your favourite activities! 🎉",
      },
      {
        id:"ch2", zone:"Your Hobbies", emoji:"🎯",
        color:"#9C27B0", bg:"linear-gradient(135deg,#F3E5F5,#E1BEE7)",
        intro:"Now tell us about your hobbies and interests. What makes you lose track of time?",
        questions:[
          { id:"q4", talent:"music", mission:"Music in Your Life", q:"How does music feature in your life?", opts:["I play an instrument or sing — it's my passion! 🎹","I always listen to music and notice melodies everywhere 🎧","I enjoy music but it's not my main hobby 🎵","I prefer silence or other activities 📖"], score_map:{"music":1.0,"music":0.8,"music":0.4,"logic":0.3} },
          { id:"q5", talent:"creativity", mission:"Creativity", q:"Which of these brings you the most enjoyment?", opts:["Drawing, creating designs or making videos 🎬","Writing stories, poems or keeping a diary ✍️","Building, coding or constructing things 🔧","Dancing, performing or acting in theatre 🎭"], score_map:{"creativity":1.0,"languages":1.0,"logic":1.0,"music":0.8} },
          { id:"q6", talent:"languages", mission:"Books and Languages", q:"How do you feel about reading and languages?", opts:["I love reading — books, articles, everything! 📚","I'm interested in foreign languages and learn new words 🌍","I read only when the topic is interesting 📖","I prefer watching videos or listening 🎬"], score_map:{"languages":1.0,"languages":1.0,"memory":0.5,"music":0.4} },
        ],
        complete:"Wonderful! Your hobbies tell us a lot about you! ✨",
      },
      {
        id:"ch3", zone:"How You Think", emoji:"💭",
        color:"#2196F3", bg:"linear-gradient(135deg,#E3F2FD,#BBDEFB)",
        intro:"Tell us about how you experience the world around you. What captures your attention?",
        questions:[
          { id:"q7", talent:"logic", mission:"What Interests You", q:"What interests and fascinates you the most?", opts:["How things, mechanisms and technology work ⚙️","Why people behave the way they do 🧠","How beautiful things are created — design and art 🎨","How to communicate and understand different people 🤝"], score_map:{"logic":1.0,"leadership":0.9,"creativity":1.0,"languages":0.9} },
          { id:"q8", talent:"leadership", mission:"Leadership", q:"If your class needs to organise an event, you...", opts:["Happily take on the role of organiser! 🌟","Suggest several creative ideas for the event 💡","Help make beautiful decorations 🎨","Make sure everyone feels comfortable and has fun 😊"], score_map:{"leadership":1.0,"creativity":0.8,"creativity":1.0,"leadership":0.8} },
          { id:"q9", talent:"creativity", mission:"Your Dream Project", q:"If you had a school project on any topic, you'd choose:", opts:["Create an app or website 💻","Draw a comic or shoot a short film 🎬","Study another culture and its language 🌏","Organise a charity event 🤲"], score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":1.0} },
        ],
        complete:"Wonderful! We understand your unique character better and better! 🌈",
      },
      {
        id:"ch4", zone:"Your Dream", emoji:"🚀",
        color:"#FF9800", bg:"linear-gradient(135deg,#FFF3E0,#FFE0B2)",
        intro:"Let's talk about the future! What inspires you and what do you dream of?",
        questions:[
          { id:"q10", talent:"logic", mission:"Who Do You Want to Be?", q:"When you think about a future career, you're most drawn to:", opts:["Working with technology, science or maths 🔬","Creating — art, music, film or games 🎮","Helping people — doctor, psychologist or teacher 💙","Travelling and exploring the world and different cultures ✈️"], score_map:{"logic":1.0,"creativity":1.0,"leadership":1.0,"languages":1.0} },
          { id:"q11", talent:"music", mission:"Musical Soul", q:"What do you think about music?", opts:["Music is my life! I can't live without it 🎼","I love music and want to learn to play 🎸","I enjoy music and listen to it in the background 🎵","Other activities are more interesting than music 📚"], score_map:{"music":1.0,"music":0.85,"music":0.5,"logic":0.4} },
          { id:"q12", talent:"leadership", mission:"Your Superpower", q:"If you had one superpower, you'd choose:", opts:["Solving any complex problem instantly 🧠","Creating masterpieces — drawing, writing, composing 🎨","Speaking and understanding all world languages 🌍","Inspiring people and leading them 👑"], score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":1.0} },
        ],
        complete:"Amazing! Your dreams show your true potential! 🌟",
      },
      {
        id:"ch5", zone:"You In Action", emoji:"⚡",
        color:"#4CAF50", bg:"linear-gradient(135deg,#E8F5E9,#C8E6C9)",
        intro:"Last questions! Tell us how you act in real situations.",
        questions:[
          { id:"q13", talent:"creativity", mission:"Weekend", q:"Your ideal weekend is:", opts:["Creating something new: drawing, writing, making 🖌️","Learning a new language or watching a documentary 🎬","Playing logic games or coding 💻","Going out with friends and socialising 🎪"], score_map:{"creativity":1.0,"languages":0.9,"logic":1.0,"leadership":0.8} },
          { id:"q14", talent:"languages", mission:"Communication", q:"When meeting new people, you...", opts:["Quickly connect and talk a lot 🗣️","Listen and observe before speaking 👁️","Suggest interesting topics or games to talk about 💡","Prefer to be on your own 📚"], score_map:{"languages":1.0,"memory":0.8,"leadership":0.9,"logic":0.5} },
          { id:"q15", talent:"logic", mission:"Final Question", q:"Which best describes you?", opts:["I love understanding HOW and WHY things work 🔍","I express myself through creativity and making things 🌈","I find joy in words, languages and stories 📖","I feel most alive when helping and inspiring others 💫"], score_map:{"logic":1.0,"creativity":1.0,"languages":1.0,"leadership":1.0} },
        ],
        complete:"You've conquered all zones! Our AI is analysing your answers... 🚀",
      },
    ],
    finale:{
      title:"Analysing Your Talents! 🌟",
      text:"One moment... Our ML algorithm is studying your answers and building your personal talent map!",
      mascot:"🏆",
    },
  },
};

// ── Score calculator ──────────────────────────────────────────────────────────
function calculateScores(answers, story) {
  const totals = { logic:0, creativity:0, memory:0, leadership:0, languages:0, music:0 };
  const counts = { logic:0, creativity:0, memory:0, leadership:0, languages:0, music:0 };

  story.chapters.forEach(ch => {
    ch.questions.forEach(q => {
      const ansIdx = answers[q.id];
      if (ansIdx === undefined) return;
      const scoreMap = q.score_map;
      const talents = Object.keys(scoreMap);
      if (ansIdx < talents.length) {
        const talent = talents[ansIdx];
        const score  = scoreMap[talent];
        totals[talent] = (totals[talent] || 0) + score;
        counts[talent] = (counts[talent] || 0) + 1;
      }
    });
  });

  // Normalize to 0-100
  const maxPossible = { logic:5, creativity:5, memory:2, leadership:5, languages:4, music:3 };
  const result = {};
  Object.keys(totals).forEach(t => {
    result[t] = Math.min(100, Math.round((totals[t] / (maxPossible[t] || 1)) * 100));
  });
  return result;
}

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

  const chapter  = chapters[chapterIdx];
  const chapterQ = chapter?.questions || [];
  const currentQ = chapterQ[qInChapter];
  const totalDone = chapters.slice(0, chapterIdx).reduce((acc, ch) => acc + ch.questions.length, 0) + qInChapter;
  const totalQ   = allQ.length;
  const progress = Math.round((totalDone / totalQ) * 100);

  const handleAnswer = async () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [currentQ.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

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

    // Calculate scores locally first
    const localScores = calculateScores(finalAnswers, story);

    try {
      const token = localStorage.getItem("token");
      let data;
      if (token) {
        const res = await quizAPI.submitAnswers(finalAnswers, lang);
        data = res.data;
        if (!data.scores) data.scores = localScores;
      } else {
        try {
          const res = await fetch("https://karta-talantov-ml.onrender.com/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: finalAnswers, scores: localScores, lang }),
          });
          data = await res.json();
          if (!data.scores) data.scores = localScores;
        } catch {
          // If ML is down, use local scores
          data = { scores: localScores, careers: [], strengths: [], top_talents: Object.entries(localScores).sort((a,b) => b[1]-a[1]).slice(0,3).map(([k]) => k) };
        }
      }
      setResults(data);
      setPage("results");
    } catch {
      setError(lang==="ru"?"Ошибка соединения. Попробуй ещё раз.":lang==="uz"?"Ulanish xatosi. Qaytadan urinib ko'ring.":"Connection error. Please try again.");
      setPhase("question");
    }
  };

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background:dark?"linear-gradient(135deg,#0F1923,#1A2A3A)":"linear-gradient(135deg,#FCE4EC,#E8F5E9)" }}>
        <div style={{ fontSize:"5rem", marginBottom:16 }}>{story.intro.mascot}</div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2.2rem", color:dark?"#E3F2FD":"#1A237E", marginBottom:14, maxWidth:500 }}>{story.intro.title}</h1>
        <p style={{ fontSize:"1rem", fontWeight:600, color:dark?"#90CAF9":"#546E7A", maxWidth:460, lineHeight:1.8, marginBottom:20 }}>{story.intro.text}</p>
        <div style={{ background:dark?"#1A2A3A":"#fff", border:"1.5px solid #E3F2FD", borderRadius:14, padding:"10px 20px", marginBottom:28, fontSize:"0.85rem", fontWeight:800, color:"#78909C" }}>
          📋 {story.intro.note}
        </div>
        {/* Zone preview */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:28, maxWidth:500 }}>
          {chapters.map((ch) => (
            <div key={ch.id} style={{ background:dark?"#1A2A3A":"#fff", border:`2px solid ${ch.color}44`, borderRadius:12, padding:"6px 14px", display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:800, color:dark?"#E3F2FD":"#1A237E" }}>
              {ch.emoji} {ch.zone}
            </div>
          ))}
        </div>
        <button className="hero-cta" style={{ fontSize:"1.1rem", padding:"14px 40px", background:"linear-gradient(135deg,#E91E63,#9C27B0)" }} onClick={() => setPhase("chapter-intro")}>
          {story.intro.btn}
        </button>
        <p style={{ fontSize:"0.72rem", color:"#90A4AE", fontWeight:700, marginTop:16 }}>
          🎓 {lang==="ru"?"Основано на теории множественного интеллекта Гарднера (Гарвард)":lang==="uz"?"Gardner ko'p intellektlar nazariyasiga asoslangan (Harvard)":"Based on Gardner's Multiple Intelligences Theory (Harvard)"}
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
        <div style={{ background:chapter.color, color:"#fff", borderRadius:99, padding:"5px 20px", fontSize:"0.85rem", fontWeight:800, marginBottom:16, letterSpacing:"0.08em" }}>
          {lang==="ru"?"ЗОНА":lang==="uz"?"ZONA":"ZONE"} {chapterIdx+1}/{chapters.length}
        </div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color:dark?"#E3F2FD":chapter.color, marginBottom:16 }}>{chapter.zone}</h2>
        <p style={{ fontSize:"1rem", fontWeight:600, color:dark?"#B0BEC5":"#546E7A", maxWidth:440, lineHeight:1.7, marginBottom:32 }}>{chapter.intro}</p>
        <button className="quiz-next" style={{ background:chapter.color, maxWidth:300 }} onClick={() => setPhase("question")}>
          {lang==="ru"?"Поехали! →":lang==="uz"?"Ketdik! →":"Let's go! →"}
        </button>
      </div>
    </div>
  );

  // ── CHAPTER COMPLETE ──────────────────────────────────────────────────────
  if (phase === "chapter-complete") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background:dark?"#0F1923":chapter.bg }}>
        <div style={{ fontSize:"4rem", marginBottom:16 }}>✅</div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", color:dark?"#E3F2FD":chapter.color, marginBottom:16, maxWidth:420 }}>{chapter.complete}</h2>
        <div style={{ display:"flex", gap:10, marginBottom:32 }}>
          {chapters.map((ch,i) => (
            <div key={i} style={{ width:14, height:14, borderRadius:"50%", background:i<=chapterIdx?ch.color:(dark?"#2A4070":"#E3F2FD"), transition:"all 0.4s", boxShadow:i<=chapterIdx?`0 0 8px ${ch.color}66`:"none" }} />
          ))}
        </div>
        {chapterIdx < chapters.length - 1 && (
          <button className="quiz-next" style={{ background:chapters[chapterIdx+1]?.color||chapter.color, maxWidth:320 }} onClick={nextChapter}>
            {lang==="ru"?`${chapters[chapterIdx+1]?.emoji} ${chapters[chapterIdx+1]?.zone} →`:lang==="uz"?`${chapters[chapterIdx+1]?.emoji} ${chapters[chapterIdx+1]?.zone} →`:`${chapters[chapterIdx+1]?.emoji} ${chapters[chapterIdx+1]?.zone} →`}
          </button>
        )}
      </div>
    </div>
  );

  // ── SUBMITTING ────────────────────────────────────────────────────────────
  if (phase === "submitting") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ textAlign:"center", padding:"60px 24px" }}>
        <div style={{ fontSize:"4rem", marginBottom:16 }}>{story.finale.mascot}</div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", color:dark?"#E3F2FD":"#1565C0", marginBottom:12 }}>{story.finale.title}</h2>
        <p style={{ color:dark?"#90CAF9":"#78909C", fontWeight:600, marginBottom:32 }}>{story.finale.text}</p>
        <Loader message={lang==="ru"?"Составляем твою карту талантов... 🗺️":lang==="uz"?"Iste'dod xaritangiz tuzilmoqda... 🗺️":"Building your talent map... 🗺️"} />
      </div>
    </div>
  );

  // ── QUESTION ──────────────────────────────────────────────────────────────
  return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />

      {/* Progress */}
      <div className="progress-bar-wrap" style={{ marginTop:16 }}>
        <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
      </div>

      {/* Chapter badge */}
      <div style={{ background:dark?"#1A2A3A":chapter.bg, padding:"10px 24px", display:"flex", alignItems:"center", gap:12, borderBottom:`2px solid ${chapter.color}33` }}>
        <span style={{ fontSize:"1.4rem" }}>{chapter.emoji}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:"0.7rem", fontWeight:800, color:chapter.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>
            {lang==="ru"?"Зона":lang==="uz"?"Zona":"Zone"} {chapterIdx+1}/{chapters.length} — {chapter.zone}
          </div>
          <div style={{ fontSize:"0.88rem", fontWeight:800, color:dark?"#E3F2FD":"#1A237E" }}>{currentQ?.mission}</div>
        </div>
        <span style={{ fontSize:"0.8rem", fontWeight:800, color:"#90A4AE" }}>{qInChapter+1}/{chapterQ.length}</span>
      </div>

      <div className="quiz-section">
        {error && <div style={{ background:"#FFEBEE", border:"1.5px solid #EF5350", borderRadius:10, padding:"10px 14px", color:"#C62828", fontWeight:700, marginBottom:14, fontSize:"0.88rem" }}>❌ {error}</div>}

        <p className="quiz-q" style={{ fontSize:"1.2rem", lineHeight:1.5 }}>{currentQ?.q}</p>

        <div className="quiz-options">
          {currentQ?.opts.map((opt, i) => (
            <button key={i}
              className={`quiz-option${selected===i?" selected":""}`}
              style={{ ...(selected===i ? { borderColor:chapter.color, background:`${chapter.color}12`, color:chapter.color } : {}), padding:"14px 18px", fontSize:"0.95rem", lineHeight:1.4 }}
              onClick={() => setSelected(i)}>
              <span style={{ fontSize:"0.85rem", fontWeight:900, color:selected===i?chapter.color:"#90A4AE", marginRight:10, flexShrink:0 }}>
                {["A","B","C","D"][i]}.
              </span>
              {opt}
            </button>
          ))}
        </div>

        <button className="quiz-next"
          style={{ background:selected===null?"#B0BEC5":chapter.color, opacity:selected===null?0.6:1, transition:"all 0.2s", fontSize:"1.05rem", padding:"15px" }}
          onClick={handleAnswer} disabled={selected===null}>
          {qInChapter < chapterQ.length-1
            ? (lang==="ru"?"Следующий вопрос →":lang==="uz"?"Keyingi savol →":"Next question →")
            : chapterIdx < chapters.length-1
            ? (lang==="ru"?`Следующая зона ${chapters[chapterIdx+1]?.emoji} →`:lang==="uz"?`Keyingi zona ${chapters[chapterIdx+1]?.emoji} →`:`Next zone ${chapters[chapterIdx+1]?.emoji} →`)
            : (lang==="ru"?"Узнать мои таланты! 🌟":lang==="uz"?"Iste'dodlarimni bilish! 🌟":"Discover my talents! 🌟")
          }
        </button>

        <p style={{ textAlign:"center", fontSize:"0.75rem", color:"#90A4AE", fontWeight:700, marginTop:12 }}>
          {lang==="ru"?`Вопрос ${totalDone+1} из ${totalQ}`:lang==="uz"?`Savol ${totalDone+1} / ${totalQ}`:`Question ${totalDone+1} of ${totalQ}`}
        </p>
      </div>
    </div>
  );
}
