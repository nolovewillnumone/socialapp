import { useState } from "react";
import Nav from "../components/Nav";
import Loader from "../components/Loader";
import { quizAPI } from "../api/client";

const STORY = {
  ru: {
    intro: {
      title: "Узнай свои таланты! 🌟",
      text: "Нет правильных или неправильных ответов — просто отвечай честно! 30 вопросов, 7 минут, и ты узнаешь какая профессия тебе идеально подойдёт.",
      btn: "Поехали →",
      note: "30 вопросов · 7 минут · Более 20 профессий",
    },
    chapters: [
      {
        id:"ch1", zone:"Свободное время", emoji:"⏰",
        color:"#0F6E56", bg:"linear-gradient(135deg,#E1F5EE,#C8E6C9)",
        intro:"Расскажи нам, что ты любишь делать! Когда нет уроков и домашних заданий — чем ты занимаешься?",
        questions:[
          { id:"q1", mission:"Любимое занятие", q:"Когда у тебя есть свободное время, ты чаще всего...", opts:["Решаю задачи, головоломки или программирую 🧩","Рисую, создаю или снимаю видео 🎨","Играю на инструменте или слушаю музыку 🎵","Общаюсь с друзьями или помогаю другим 👥"] },
          { id:"q2", mission:"Любимый предмет", q:"Какой школьный предмет тебе нравится больше всего?", opts:["Математика, физика или информатика 💻","Рисование, музыка или технология 🎨","Литература, история или иностранные языки 📚","Биология, природоведение или химия 🌿"] },
          { id:"q3", mission:"В группе", q:"Когда ты в группе одноклассников, ты обычно...", opts:["Предлагаю идеи и организую всех 👑","Придумываю что-то творческое и интересное 🎭","Слушаю и помогаю всем найти общий язык 💙","Наблюдаю за природой или погодой вокруг 🌱"] },
          { id:"q16", mission:"На природе", q:"Как ты относишься к природе и животным?", opts:["Обожаю спорт и активный отдых на свежем воздухе 🏃","Люблю наблюдать за животными, растениями, природой 🦋","Люблю рисовать природу и пейзажи 🎨","Предпочитаю быть дома за компьютером 💻"] },
          { id:"q17", mission:"С людьми", q:"Как тебе общение с разными людьми?", opts:["Легко нахожу общий язык, обожаю знакомиться 🗣️","Предпочитаю руководить и организовывать 👑","Люблю творческое общение — через искусство или музыку 🎨","Общаюсь только с близкими, остальных немного стесняюсь 🤔"] },
          { id:"q18", mission:"Мир вокруг", q:"Что тебя больше всего восхищает в окружающем мире?", opts:["Как работает природа — животные, экосистемы, биология 🌿","Как работают машины, технологии и системы ⚙️","Красота искусства, архитектуры и дизайна 🏛️","Истории и культуры разных народов 🌍"] },
        ],
        complete:"Отлично! Мы узнали о твоих любимых занятиях! 🎉",
      },
      {
        id:"ch2", zone:"Твои увлечения", emoji:"🎯",
        color:"#1D9E75", bg:"linear-gradient(135deg,#E1F5EE,#FAEEDA)",
        intro:"Теперь поговорим о хобби и том, что тебя по-настоящему захватывает!",
        questions:[
          { id:"q4", mission:"Музыка", q:"Как музыка присутствует в твоей жизни?", opts:["Играю на инструменте или пою — это моя страсть 🎹","Всегда слушаю музыку, замечаю мелодии и ритмы 🎧","Мне нравится, но это не главное в жизни 🎵","Предпочитаю тишину или другие звуки 📖"] },
          { id:"q5", mission:"Творчество", q:"Что из этого приносит тебе наибольшее удовольствие?", opts:["Рисовать, создавать дизайны или анимацию 🎬","Писать рассказы, стихи или вести блог ✍️","Конструировать, программировать или паять 🔧","Танцевать, играть в театре или петь 🎭"] },
          { id:"q6", mission:"Чтение и языки", q:"Как ты относишься к чтению и иностранным языкам?", opts:["Обожаю читать книги на разные темы 📚","Учу иностранные языки — это мне легко даётся 🌍","Читаю только по необходимости 📖","Смотрю видео и слушаю подкасты вместо чтения 🎧"] },
          { id:"q19", mission:"Спорт", q:"Какое место спорт занимает в твоей жизни?", opts:["Спорт — это моё всё! Тренируюсь постоянно 🏆","Играю в командные игры — футбол, баскетбол, волейбол 🏀","Занимаюсь для здоровья, но не на профессиональном уровне 🏃","Предпочитаю интеллектуальные игры, а не физические 🧩"] },
          { id:"q20", mission:"Идеальный проект", q:"Если бы у тебя был любой школьный проект, ты выбрал бы:", opts:["Написать программу или создать сайт 💻","Снять фильм или создать арт-инсталляцию 🎬","Провести социальный проект — помочь людям 🤲","Исследовать экосистему или поставить научный эксперимент 🔬"] },
          { id:"q21", mission:"Тип мышления", q:"Когда ты решаешь сложную задачу, ты чаще всего:", opts:["Ищешь нестандартные, необычные решения 🌈","Слушаешь музыку — она помогает думать 🎵","Анализируешь шаг за шагом, ищешь логику ⚙️","Обсуждаю с другими, ищу мнения команды 🤝"] },
        ],
        complete:"Замечательно! Твои увлечения рассказали нам о тебе очень много! ✨",
      },
      {
        id:"ch3", zone:"Ты и люди", emoji:"🤝",
        color:"#EF9F27", bg:"linear-gradient(135deg,#FAEEDA,#E1F5EE)",
        intro:"Расскажи, как ты взаимодействуешь с людьми и обществом вокруг тебя!",
        questions:[
          { id:"q7", mission:"Интересы", q:"Что тебя больше всего fascинирует и увлекает?", opts:["Как работают технологии, алгоритмы и системы ⚙️","Почему люди так себя ведут — психология и эмоции 🧠","Как создаётся красота — дизайн, живопись, музыка 🎨","Как устроены экосистемы и живые организмы 🌿"] },
          { id:"q8", mission:"Лидерство", q:"Если нужно организовать мероприятие в классе, ты:", opts:["С удовольствием возьмёшь на себя роль организатора 🌟","Предложишь несколько творческих идей 💡","Создашь красивое оформление и декорации 🎨","Позаботишься о том, чтобы все чувствовали себя хорошо 😊"] },
          { id:"q22", mission:"Помощь другим", q:"В каких ситуациях ты чувствуешь себя наиболее полезным?", opts:["Когда помогаю разобраться в сложной теме или задаче 💡","Когда выслушиваю и поддерживаю тех, кто расстроен 💙","Когда создаю что-то, что радует людей 🎨","Когда организую команду для достижения цели 🏆"] },
          { id:"q23", mission:"Природа и экология", q:"Как ты относишься к охране природы?", opts:["Это очень важно! Хотел бы работать в этой сфере 🌿","Занимаюсь спортом на природе — это мотивирует заботиться о ней 🏃","Интересно изучать природные явления и живых существ 🦋","Поддерживаю экологию, но это не моё главное призвание 🌍"] },
          { id:"q24", mission:"Авторитет", q:"Кого из известных людей ты больше всего уважаешь?", opts:["Предпринимателей и лидеров — Маск, Цукерберг 👑","Учёных и изобретателей — Эйнштейн, Кюри 🔬","Артистов и творцов — Да Винчи, Моцарт 🎨","Спортсменов и чемпионов — мотивируют своей силой 🏆"] },
          { id:"q25", mission:"Будущее", q:"Когда ты думаешь о своём будущем, тебе важнее всего:", opts:["Решать сложные задачи и создавать инновации 🧠","Выражать себя творчески и создавать искусство 🌈","Помогать людям и делать мир лучше 💙","Жить в гармонии с природой и путешествовать 🌿"] },
        ],
        complete:"Прекрасно! Мы понимаем, как ты взаимодействуешь с миром! 🌈",
      },
      {
        id:"ch4", zone:"Твоя мечта", emoji:"🚀",
        color:"#BA7517", bg:"linear-gradient(135deg,#FAEEDA,#FAC775)",
        intro:"Поговорим о твоих мечтах и о том, каким ты видишь своё будущее!",
        questions:[
          { id:"q9", mission:"Профессия мечты", q:"Если бы ты мог выбрать любую профессию без ограничений:", opts:["Создавал бы технологии, которые изменят мир 💻","Создавал бы искусство, кино или музыку 🎭","Путешествовал бы и изучал другие языки и культуры ✈️","Организовывал бы важные события и вёл за собой людей 👑"] },
          { id:"q10", mission:"Карьера", q:"Что привлекает тебя в будущей работе больше всего?", opts:["Решать сложные технические задачи 🔬","Создавать что-то красивое и вдохновлять людей 🎨","Помогать людям, лечить или обучать 💙","Зарабатывать много денег и стать успешным 💰"] },
          { id:"q26", mission:"Музыкальные мечты", q:"Если говорить о музыке и выступлениях:", opts:["Мечтаю выступать на сцене — петь или играть 🎤","Хочу создавать музыку — писать песни или сочинять 🎼","Люблю музыку, но мечтаю о другом 🎵","Мне нравится за кулисами — звук, свет, режиссура 🎬"] },
          { id:"q27", mission:"Спортивные мечты", q:"Если говорить о спорте и физической активности:", opts:["Хочу стать профессиональным спортсменом или тренером 🏆","Спорт — часть жизни, но не карьера 🏃","Интересует спортивная медицина или психология 🩺","Предпочитаю интеллектуальные соревнования ♟️"] },
          { id:"q28", mission:"Языки и путешествия", q:"Как ты относишься к разным языкам и культурам?", opts:["Хочу знать 5+ языков и работать на международном уровне 🌍","Путешествия и новые культуры меня вдохновляют ✈️","Один-два языка — вполне достаточно 📖","Мне интереснее погружаться в одну культуру глубоко 🏛️"] },
          { id:"q29", mission:"Природа и наука", q:"Что из научных направлений тебя привлекает больше?", opts:["Биология, экология, зоология — живые организмы 🌿","Физика, астрономия, космос — законы вселенной 🌌","Химия, медицина — состав и реакции веществ 🧪","Психология, социология — поведение людей 🧠"] },
        ],
        complete:"Твои мечты помогают нам понять твоё предназначение! 🌟",
      },
      {
        id:"ch5", zone:"Ты в действии", emoji:"⚡",
        color:"#5DCAA5", bg:"linear-gradient(135deg,#E1F5EE,#F1EFE8)",
        intro:"Последние вопросы! Расскажи, как ты ведёшь себя в реальных ситуациях.",
        questions:[
          { id:"q11", mission:"Музыка в жизни", q:"Что ты думаешь о музыке в целом?", opts:["Музыка — это моя жизнь, не могу без неё 🎼","Люблю музыку и хочу научиться играть 🎸","Слушаю в фоне, нравится, но не главное 🎵","Другие занятия интереснее музыки 📚"] },
          { id:"q12", mission:"Суперсила", q:"Если бы у тебя была одна суперсила, ты выбрал бы:", opts:["Решать любые задачи мгновенно 🧠","Создавать шедевры — рисовать, писать, сочинять 🎨","Говорить на всех языках мира 🌍","Вдохновлять людей и быть их лидером 👑"] },
          { id:"q13", mission:"Выходные", q:"Идеальные выходные для тебя:", opts:["Создать что-то новое — нарисовать, написать 🖌️","Изучить новый язык или посмотреть документальный фильм 🎬","Поиграть в логические игры или попрограммировать 💻","Пойти на спортивную тренировку или в поход 🏃"] },
          { id:"q14", mission:"Общение", q:"Когда ты знакомишься с новыми людьми, ты...", opts:["Быстро находишь общий язык и говоришь о многом 🗣️","Слушаешь и наблюдаешь, прежде чем открываться 👁️","Предлагаешь сыграть в игру или устроить активность 🎯","Рассказываешь о своих увлечениях и интересах 💡"] },
          { id:"q30", mission:"Финальный вопрос", q:"Если бы тебя попросили описать себя одним словом:", opts:["Изобретатель 🔧","Художник 🎨","Музыкант 🎵","Лидер 👑"] },
          { id:"q15", mission:"О себе", q:"Что тебя лучше всего описывает?", opts:["Я люблю понимать КАК и ПОЧЕМУ работают вещи 🔍","Я выражаю себя через творчество и создание 🌈","Я нахожу радость в словах, языках и историях 📖","Я чувствую себя живым, когда помогаю и вдохновляю 💫"] },
        ],
        complete:"Экспедиция завершена! Анализируем твои таланты... 🚀",
      },
    ],
    finale:{title:"Анализируем! 🌟",text:"Наш ML-алгоритм составляет твою карту талантов и подбирает профессии...",mascot:"🏆"},
  },

  uz: {
    intro:{
      title:"Iste'dodlaringizni bilib oling! 🌟",
      text:"To'g'ri yoki noto'g'ri javoblar yo'q — faqat to'g'ridan-to'g'ri javob bering! 30 savol, 7 daqiqa va siz qaysi kasb sizga to'g'ri kelishini bilib olasiz.",
      btn:"Ketdik →",
      note:"30 savol · 7 daqiqa · 20+ kasb",
    },
    chapters:[
      { id:"ch1", zone:"Bo'sh vaqt", emoji:"⏰", color:"#0F6E56", bg:"linear-gradient(135deg,#E1F5EE,#C8E6C9)", intro:"Sevimli mashg'ulotlaringiz haqida gapiring!",
        questions:[
          { id:"q1", mission:"Sevimli mashg'ulot", q:"Bo'sh vaqtingizda ko'pincha nima qilasiz?", opts:["Masalalar yechaman, boshqotirmalar yoki dasturlash 🧩","Chizaman, yarataman yoki video suratga olaman 🎨","Cholg'u asbobi chalaman yoki musiqa tinglaymanlar 🎵","Do'stlar bilan muloqot qilaman yoki yordam beraman 👥"] },
          { id:"q2", mission:"Sevimli fan", q:"Qaysi maktab fani sizga ko'proq yoqadi?", opts:["Matematika, fizika yoki informatika 💻","Rasm, musiqa yoki texnologiya 🎨","Adabiyot, tarix yoki xorijiy tillar 📚","Biologiya, tabiat yoki kimyo 🌿"] },
          { id:"q3", mission:"Guruhda", q:"Sinfdoshlar guruhida qanday bo'lasiz?", opts:["G'oyalar taklif qilaman va hammasini tashkil qilaman 👑","Ijodiy va qiziqarli narsalar o'ylaymanlar 🎭","Tinglaymanlar va hammasiga yordam beraman 💙","Atrofdagi tabiatni kuzataman 🌱"] },
          { id:"q16", mission:"Tabiatda", q:"Tabiat va hayvonlarga qanday munosabatdasiz?", opts:["Sport va faol dam olishni yaxshi ko'raman 🏃","Hayvonlar, o'simliklar va tabiatni kuzatishni yaxshi ko'raman 🦋","Tabiat manzaralarini chizishni yaxshi ko'raman 🎨","Uyda kompyuter oldida bo'lishni afzal ko'raman 💻"] },
          { id:"q17", mission:"Odamlar bilan", q:"Turli odamlar bilan muloqot qanday?", opts:["Tez til topaman, tanishishni yaxshi ko'raman 🗣️","Boshqarish va tashkil qilishni afzal ko'raman 👑","Ijodiy muloqot — san'at yoki musiqa orqali 🎨","Faqat yaqinlar bilan muloqot qilaman 🤔"] },
          { id:"q18", mission:"Atrofdagi dunyo", q:"Atrofdagi dunyoda sizni eng ko'p nima hayratlantiradi?", opts:["Tabiat qanday ishlashi — hayvonlar, ekotizimlar 🌿","Texnologiyalar va mashinalar qanday ishlashi ⚙️","San'at, arxitektura va dizayn go'zalligi 🏛️","Turli xalqlar tarixi va madaniyati 🌍"] },
        ], complete:"Ajoyib! Sevimli mashg'ulotlaringiz haqida bildik! 🎉" },
      { id:"ch2", zone:"Qiziqishlar", emoji:"🎯", color:"#1D9E75", bg:"linear-gradient(135deg,#E1F5EE,#FAEEDA)", intro:"Hobbi va qiziqishlaringiz haqida gapirishng!",
        questions:[
          { id:"q4", mission:"Musiqa", q:"Musiqa hayotingizda qanday o'rin tutadi?", opts:["Cholg'u asbobini chalaman yoki qo'shiq aytaman 🎹","Musiqa tinglaymanlar, melodiya va ritmlarni sezaman 🎧","Yoqadi, lekin hayotimning asosiy qismi emas 🎵","Jimlikni yoki boshqa ovozlarni afzal ko'raman 📖"] },
          { id:"q5", mission:"Ijodkorlik", q:"Quyidagilardan qaysi biri sizga eng zavq beradi?", opts:["Chizish, dizayn yaratish yoki animatsiya 🎬","Hikoya, she'r yozish yoki blog yuritish ✍️","Konstruksiya qilish, dasturlash yoki lehimlash 🔧","Raqs, teatr yoki qo'shiq aytish 🎭"] },
          { id:"q6", mission:"O'qish va tillar", q:"O'qish va xorijiy tillarga qanday munosabatdasiz?", opts:["Turli mavzularda kitob o'qishni yaxshi ko'raman 📚","Xorijiy tillarni o'rganaman — menga oson beriladi 🌍","Faqat kerak bo'lganda o'qiyman 📖","Video va podkastlarni o'qishdan afzal ko'raman 🎧"] },
          { id:"q19", mission:"Sport", q:"Sport hayotingizda qanday o'rin egallaydi?", opts:["Sport — bu mening hammasim! Doim mashg'ul bo'laman 🏆","Jamoa o'yinlarini — futbol, basketbol o'ynayman 🏀","Sog'liq uchun shug'ullanaman, professional emas 🏃","Jismoniy emas, intellektual o'yinlarni afzal ko'raman 🧩"] },
          { id:"q20", mission:"Ideal loyiha", q:"Istalgan maktab loyihasini tanlasangiz:", opts:["Dastur yoki veb-sayt yarataman 💻","Film suratga olaman yoki art-installyatsiya yarataman 🎬","Odamlarga yordam beruvchi ijtimoiy loyiha 🤲","Ekotizimni tadqiq qilaman yoki ilmiy tajriba o'tkazaman 🔬"] },
          { id:"q21", mission:"Tafakkur turi", q:"Murakkab masalani yechishda ko'pincha:", opts:["Noodatiy, g'ayrioddiy yechimlar qidiraman 🌈","Musiqa yoqaman — u fikrlashga yordam beradi 🎵","Qadam-baqadam tahlil qilaman, mantiqni qidiraman ⚙️","Jamoa bilan muhokama qilaman 🤝"] },
        ], complete:"Ajoyib! Qiziqishlaringiz siz haqingizda ko'p narsani aytdi! ✨" },
      { id:"ch3", zone:"Siz va odamlar", emoji:"🤝", color:"#EF9F27", bg:"linear-gradient(135deg,#FAEEDA,#E1F5EE)", intro:"Odamlar va jamiyat bilan munosabatingiz haqida gapirishng!",
        questions:[
          { id:"q7", mission:"Qiziqishlar", q:"Sizni eng ko'p nima qiziqtiradi?", opts:["Texnologiyalar, algoritmlar va tizimlar qanday ishlashi ⚙️","Odamlar nima uchun shunday harakat qiladi — psixologiya 🧠","Go'zallik qanday yaratiladi — dizayn, rasm, musiqa 🎨","Ekotizimlar va tirik organizmlar qanday tuzilgan 🌿"] },
          { id:"q8", mission:"Liderlik", q:"Sinfda tadbir tashkil qilish kerak bo'lsa:", opts:["Mamnuniyat bilan tashkilotchi rolini o'z zimmangizga olasiz 🌟","Bir nechta ijodiy g'oyalar taklif qilasiz 💡","Chiroyli bezatish va dekoratsiya qilasiz 🎨","Hammaga qulay va yaxshi his qilishiga g'amxo'rlik qilasiz 😊"] },
          { id:"q22", mission:"Boshqalarga yordam", q:"Qaysi vaziyatlarda o'zingizni eng foydali his qilasiz?", opts:["Murakkab mavzu yoki masalani tushuntirganda 💡","Xafa bo'lgan kishini eshitib, qo'llab-quvvatlaganda 💙","Odamlarni xursand qiladigan narsa yaratganda 🎨","Maqsadga erishish uchun jamoani tashkil qilganda 🏆"] },
          { id:"q23", mission:"Tabiat va ekologiya", q:"Tabiatni muhofaza qilishga qanday munosabatdasiz?", opts:["Bu juda muhim! Shu sohadagi kasbda ishlashni xohlayman 🌿","Tabiatda sport bilan shug'ullanaman — bu uni muhofaza qilishga undaydi 🏃","Tabiiy hodisalar va tirik mavjudotlarni o'rganish qiziq 🦋","Ekologiyani qo'llab-quvvatlayman, lekin bu mening asosiy maqsadim emas 🌍"] },
          { id:"q24", mission:"Siz hurmat qilgan shaxs", q:"Mashhur odamlardan kimni ko'proq hurmat qilasiz?", opts:["Tadbirkor va liderlar — Mask, Zuckerberg 👑","Olimlar va ixtirochilar — Eynshteyn, Kyuri 🔬","San'atkorlar va ijodkorlar — Da Vinchi, Motsart 🎨","Sportchilar va chempionlar — o'z kuchi bilan rag'batlantirguchi 🏆"] },
          { id:"q25", mission:"Kelajak", q:"Kelajak haqida o'ylaganingizda, eng muhimi:", opts:["Murakkab masalalar yechish va innovatsiyalar yaratish 🧠","O'zingizni ijodiy ifodalash va san'at yaratish 🌈","Odamlarga yordam berish va dunyoni yaxshilash 💙","Tabiat bilan uyg'unlikda yashash va sayohat qilish 🌿"] },
        ], complete:"Zo'r! Siz odamlar bilan qanday o'zaro munosabatda bo'lishingizni tushundik! 🌈" },
      { id:"ch4", zone:"Sizning orzuyingiz", emoji:"🚀", color:"#BA7517", bg:"linear-gradient(135deg,#FAEEDA,#FAC775)", intro:"Kelajakdagi orzu va maqsadlaringiz haqida gapirishng!",
        questions:[
          { id:"q9", mission:"Orzu kasbi", q:"Cheklovlarsiz istalgan kasbni tanlasangiz:", opts:["Dunyoni o'zgartiradigan texnologiyalar yaratardim 💻","San'at, kino yoki musiqa yaratardim 🎭","Sayohat qilib, turli tillar va madaniyatlarni o'rganardim ✈️","Muhim tadbirlar tashkil qilardim va odamlarni boshqarardim 👑"] },
          { id:"q10", mission:"Karyera", q:"Kelajakdagi ishingizda eng ko'p nima jalb qiladi?", opts:["Murakkab texnik masalalar yechish 🔬","Chiroyli narsa yaratish va odamlarni ilhomlantirish 🎨","Odamlarga yordam berish, davolash yoki o'qitish 💙","Ko'p pul ishlash va muvaffaqiyatli bo'lish 💰"] },
          { id:"q26", mission:"Musiqa orzulari", q:"Musiqa va sahnada chiqish haqida:", opts:["Sahnada chiqishni orzu qilaman — qo'shiq yoki cholg'u 🎤","Musiqa yaratishni xohlayman — qo'shiq yoki besto yozish 🎼","Musiqani yaxshi ko'raman, lekin boshqa orzularim bor 🎵","Sahna ortida — ovoz, yorug'lik, rejissura qiziqroq 🎬"] },
          { id:"q27", mission:"Sport orzulari", q:"Sport va jismoniy faollik haqida:", opts:["Professional sportchi yoki murabbiy bo'lmoqchiman 🏆","Sport — hayot qismim, lekin kasb emas 🏃","Sport tibbiyoti yoki psixologiyasi qiziqtiradi 🩺","Intellektual musobaqalarni afzal ko'raman ♟️"] },
          { id:"q28", mission:"Tillar va sayohat", q:"Turli tillar va madaniyatlarga qanday munosabatdasiz?", opts:["5+ til bilmoqchiman va xalqaro darajada ishlashni xohlayman 🌍","Sayohat va yangi madaniyatlar meni ilhomlantiradi ✈️","Bir-ikki til yetarli 📖","Bitta madaniyatni chuqur o'rganishni afzal ko'raman 🏛️"] },
          { id:"q29", mission:"Tabiat va fan", q:"Qaysi ilmiy yo'nalish sizni ko'proq jalb qiladi?", opts:["Biologiya, ekologiya, zoologiya — tirik organizmlar 🌿","Fizika, astronomiya, kosmos — koinot qonunlari 🌌","Kimyo, tibbiyot — moddalar tarkibi va reaksiyalari 🧪","Psixologiya, sotsiologiya — odamlar xulq-atvori 🧠"] },
        ], complete:"Orzularingiz maqsadingizni tushunishga yordam beradi! 🌟" },
      { id:"ch5", zone:"Siz harakatda", emoji:"⚡", color:"#5DCAA5", bg:"linear-gradient(135deg,#E1F5EE,#F1EFE8)", intro:"Oxirgi savollar! Haqiqiy vaziyatlarda qanday harakat qilishingiz haqida!",
        questions:[
          { id:"q11", mission:"Musiqa", q:"Musiqa haqida umuman nima deb o'ylaysiz?", opts:["Musiqa — mening hayotim, usiz yasha olmayman 🎼","Musiqani yaxshi ko'raman va chalishni o'rganmoqchiman 🎸","Fonda tinglaymanlar, yoqadi lekin asosiy emas 🎵","Boshqa mashg'ulotlar musiqadan qiziqroq 📚"] },
          { id:"q12", mission:"Superkuch", q:"Bitta superkuch bo'lganida tanlagan bo'lardingiz:", opts:["Istalgan masalani bir zumda hal qilish 🧠","Shoh asarlar yaratish — chizish, yozish, bastakorlik 🎨","Dunyodagi barcha tillarda gapirish 🌍","Odamlarni ilhomlantirib, rahbarlik qilish 👑"] },
          { id:"q13", mission:"Dam olish kunlari", q:"Ideal dam olish kunlari:", opts:["Yangi narsa yaratish — chizish, yozish 🖌️","Yangi til o'rganish yoki hujjatli film ko'rish 🎬","Mantiqiy o'yinlar yoki dasturlash 💻","Sport mashg'uloti yoki yurish 🏃"] },
          { id:"q14", mission:"Muloqot", q:"Yangi odamlar bilan tanishganingizda:", opts:["Tez til topasiz va ko'p gaplashasiz 🗣️","Ochilishdan oldin tinglaysiz va kuzatasiz 👁️","O'yin yoki faoliyat taklif qilasiz 🎯","Qiziqishlaringiz va hobbingiz haqida gapirasiz 💡"] },
          { id:"q30", mission:"Yakuniy savol", q:"Agar bir so'z bilan tavsiflamoqchi bo'lsangiz:", opts:["Ixtirochi 🔧","Rassom 🎨","Musiqachi 🎵","Lider 👑"] },
          { id:"q15", mission:"O'zingiz haqida", q:"Sizni eng yaxshi tavsiflovchi narsa:", opts:["Narsalar QANDAY va NIMA UCHUN ishlashini tushunishni yaxshi ko'raman 🔍","O'zimni ijodkorlik va yaratish orqali ifodalaymanlar 🌈","So'zlar, tillar va hikoyalarda quvonch topaman 📖","Boshqalarga yordam berganimda va ilhomlantirganimda tirikman 💫"] },
        ], complete:"Barcha zonalar zabt etildi! Iste'dodlaringiz tahlil qilinmoqda... 🚀" },
    ],
    finale:{title:"Tahlil qilinmoqda! 🌟",text:"ML-algoritmimiz iste'dod xaritangizni va kasblarni tanlayapti...",mascot:"🏆"},
  },

  en: {
    intro:{
      title:"Discover Your Talents! 🌟",
      text:"No right or wrong answers — just answer honestly! 30 questions, 7 minutes, and you'll find out which profession suits you perfectly.",
      btn:"Let's go →",
      note:"30 questions · 7 minutes · 20+ professions",
    },
    chapters:[
      { id:"ch1", zone:"Free Time", emoji:"⏰", color:"#0F6E56", bg:"linear-gradient(135deg,#E1F5EE,#C8E6C9)", intro:"Tell us what you love doing when you have free time!",
        questions:[
          { id:"q1", mission:"Favourite Activity", q:"When you have free time, you usually...", opts:["Solve puzzles, problems or code 🧩","Draw, create or make videos 🎨","Play an instrument or listen to music 🎵","Talk with friends or help others 👥"] },
          { id:"q2", mission:"Favourite Subject", q:"Which school subject do you enjoy most?", opts:["Maths, physics or computer science 💻","Art, music or technology 🎨","Literature, history or foreign languages 📚","Biology, nature studies or chemistry 🌿"] },
          { id:"q3", mission:"In a Group", q:"When you're in a group of classmates, you usually...", opts:["Suggest ideas and organise everyone 👑","Think of something creative and interesting 🎭","Listen and help everyone get along 💙","Observe the nature or weather around you 🌱"] },
          { id:"q16", mission:"Nature", q:"How do you feel about nature and animals?", opts:["I love sports and active outdoor activities 🏃","I love observing animals, plants and nature 🦋","I love drawing landscapes and nature scenes 🎨","I prefer being at home on the computer 💻"] },
          { id:"q17", mission:"With People", q:"How do you feel about meeting different people?", opts:["I easily connect with people and love meeting them 🗣️","I prefer to lead and organise 👑","I like creative connection — through art or music 🎨","I mainly talk with close friends, feel shy with others 🤔"] },
          { id:"q18", mission:"The World Around You", q:"What amazes you most about the world?", opts:["How nature works — animals, ecosystems, biology 🌿","How machines, technology and systems work ⚙️","The beauty of art, architecture and design 🏛️","The stories and cultures of different peoples 🌍"] },
        ], complete:"Great! We've learned about your favourite activities! 🎉" },
      { id:"ch2", zone:"Your Hobbies", emoji:"🎯", color:"#1D9E75", bg:"linear-gradient(135deg,#E1F5EE,#FAEEDA)", intro:"Now let's talk about your hobbies and what truly captivates you!",
        questions:[
          { id:"q4", mission:"Music", q:"How does music feature in your life?", opts:["I play an instrument or sing — it's my passion 🎹","I always listen to music and notice melodies and rhythms 🎧","I enjoy it but it's not the main thing in my life 🎵","I prefer silence or other sounds 📖"] },
          { id:"q5", mission:"Creativity", q:"Which of these brings you the most enjoyment?", opts:["Drawing, creating designs or animation 🎬","Writing stories, poems or keeping a blog ✍️","Building, coding or soldering 🔧","Dancing, acting in theatre or singing 🎭"] },
          { id:"q6", mission:"Reading & Languages", q:"How do you feel about reading and foreign languages?", opts:["I love reading books on all kinds of topics 📚","I learn foreign languages — it comes easily to me 🌍","I only read when necessary 📖","I prefer videos and podcasts over reading 🎧"] },
          { id:"q19", mission:"Sport", q:"What place does sport have in your life?", opts:["Sport is everything to me! I train constantly 🏆","I play team sports — football, basketball, volleyball 🏀","I exercise for health, not at a professional level 🏃","I prefer intellectual games over physical ones 🧩"] },
          { id:"q20", mission:"Dream Project", q:"If you could do any school project, you'd choose:", opts:["Write a program or create a website 💻","Shoot a film or create an art installation 🎬","Run a social project — helping people 🤲","Research an ecosystem or conduct a science experiment 🔬"] },
          { id:"q21", mission:"Type of Thinking", q:"When you're solving a hard problem, you usually:", opts:["Look for unusual, non-standard solutions 🌈","Put on music — it helps you think 🎵","Analyse step by step, looking for the logic ⚙️","Discuss it with others and gather opinions 🤝"] },
        ], complete:"Wonderful! Your hobbies told us a great deal about you! ✨" },
      { id:"ch3", zone:"You & People", emoji:"🤝", color:"#EF9F27", bg:"linear-gradient(135deg,#FAEEDA,#E1F5EE)", intro:"Tell us how you interact with people and society around you!",
        questions:[
          { id:"q7", mission:"Interests", q:"What fascinates and captivates you most?", opts:["How technology, algorithms and systems work ⚙️","Why people behave the way they do — psychology 🧠","How beauty is created — design, painting, music 🎨","How ecosystems and living organisms are structured 🌿"] },
          { id:"q8", mission:"Leadership", q:"If your class needs to organise an event, you:", opts:["Happily take on the organiser role 🌟","Suggest several creative ideas 💡","Create beautiful decorations 🎨","Make sure everyone feels comfortable 😊"] },
          { id:"q22", mission:"Helping Others", q:"In which situations do you feel most useful?", opts:["When I help someone understand a complex topic 💡","When I listen to and support someone who is upset 💙","When I create something that brings people joy 🎨","When I organise a team to achieve a goal 🏆"] },
          { id:"q23", mission:"Nature & Ecology", q:"How do you feel about protecting nature?", opts:["It's very important! I'd love to work in this field 🌿","I do sport in nature — it motivates me to protect it 🏃","I find it interesting to study natural phenomena 🦋","I support ecology but it's not my main calling 🌍"] },
          { id:"q24", mission:"Who You Respect", q:"Which famous person do you respect most?", opts:["Entrepreneurs and leaders — Musk, Zuckerberg 👑","Scientists and inventors — Einstein, Curie 🔬","Artists and creators — Da Vinci, Mozart 🎨","Athletes and champions — motivated by their strength 🏆"] },
          { id:"q25", mission:"The Future", q:"When you think about your future, what matters most?", opts:["Solving complex problems and creating innovations 🧠","Expressing yourself creatively and making art 🌈","Helping people and making the world better 💙","Living in harmony with nature and travelling 🌿"] },
        ], complete:"Wonderful! We understand how you interact with the world! 🌈" },
      { id:"ch4", zone:"Your Dream", emoji:"🚀", color:"#BA7517", bg:"linear-gradient(135deg,#FAEEDA,#FAC775)", intro:"Let's talk about your dreams and how you see your future!",
        questions:[
          { id:"q9", mission:"Dream Profession", q:"If you could choose any profession without limits:", opts:["I'd create technologies that change the world 💻","I'd create art, film or music 🎭","I'd travel and learn different languages and cultures ✈️","I'd organise important events and lead people 👑"] },
          { id:"q10", mission:"Career", q:"What attracts you most about a future job?", opts:["Solving complex technical problems 🔬","Creating something beautiful and inspiring people 🎨","Helping people, healing or educating 💙","Earning good money and becoming successful 💰"] },
          { id:"q26", mission:"Music Dreams", q:"When it comes to music and performing:", opts:["I dream of performing on stage — singing or playing 🎤","I want to create music — write songs or compose 🎼","I love music but dream of something else 🎵","I'm more interested in backstage — sound, lighting, directing 🎬"] },
          { id:"q27", mission:"Sport Dreams", q:"When it comes to sport and physical activity:", opts:["I want to become a professional athlete or coach 🏆","Sport is part of life but not a career 🏃","Sports medicine or psychology interests me 🩺","I prefer intellectual competitions ♟️"] },
          { id:"q28", mission:"Languages & Travel", q:"How do you feel about different languages and cultures?", opts:["I want to know 5+ languages and work internationally 🌍","Travel and new cultures inspire me ✈️","One or two languages is quite enough 📖","I prefer diving deep into one culture 🏛️"] },
          { id:"q29", mission:"Nature & Science", q:"Which scientific field attracts you more?", opts:["Biology, ecology, zoology — living organisms 🌿","Physics, astronomy, space — laws of the universe 🌌","Chemistry, medicine — substances and reactions 🧪","Psychology, sociology — human behaviour 🧠"] },
        ], complete:"Your dreams help us understand your purpose! 🌟" },
      { id:"ch5", zone:"You In Action", emoji:"⚡", color:"#5DCAA5", bg:"linear-gradient(135deg,#E1F5EE,#F1EFE8)", intro:"Last questions! Tell us how you act in real situations.",
        questions:[
          { id:"q11", mission:"Music", q:"What do you think about music in general?", opts:["Music is my life, I can't live without it 🎼","I love music and want to learn to play 🎸","I listen in the background — I like it but it's not everything 🎵","Other activities are more interesting than music 📚"] },
          { id:"q12", mission:"Superpower", q:"If you had one superpower, you'd choose:", opts:["Solving any problem instantly 🧠","Creating masterpieces — drawing, writing, composing 🎨","Speaking all world languages 🌍","Inspiring people and leading them 👑"] },
          { id:"q13", mission:"Weekend", q:"Your ideal weekend:", opts:["Creating something new — drawing, writing 🖌️","Learning a language or watching a documentary 🎬","Logic games or coding 💻","Sports training or going on a hike 🏃"] },
          { id:"q14", mission:"Communication", q:"When you meet new people, you...", opts:["Quickly connect and talk about many things 🗣️","Listen and observe before opening up 👁️","Suggest a game or activity 🎯","Talk about your interests and hobbies 💡"] },
          { id:"q30", mission:"Final Question", q:"If you had to describe yourself in one word:", opts:["Inventor 🔧","Artist 🎨","Musician 🎵","Leader 👑"] },
          { id:"q15", mission:"About You", q:"What describes you best?", opts:["I love understanding HOW and WHY things work 🔍","I express myself through creativity and making 🌈","I find joy in words, languages and stories 📖","I feel most alive when helping and inspiring others 💫"] },
        ], complete:"All zones conquered! Analysing your talents... 🚀" },
    ],
    finale:{title:"Analysing! 🌟",text:"Our ML algorithm is building your talent map and selecting professions...",mascot:"🏆"},
  },
};

// ── Score calculator ───────────────────────────────────────────────────────────
const INTEREST_MAP = {
  "q1":[{"logic":1.0},{"creativity":0.9},{"music":0.9},{"social":0.8}],
  "q2":[{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"nature":0.9}],
  "q3":[{"leadership":1.0},{"creativity":0.8},{"social":0.9},{"nature":0.6}],
  "q4":[{"music":1.0},{"music":0.8},{"music":0.4},{"logic":0.3}],
  "q5":[{"creativity":1.0},{"languages":1.0},{"logic":1.0},{"music":0.9}],
  "q6":[{"languages":1.0},{"languages":1.0},{"memory":0.5},{"music":0.4}],
  "q7":[{"logic":1.0},{"social":0.9},{"creativity":1.0},{"nature":0.9}],
  "q8":[{"leadership":1.0},{"creativity":0.8},{"creativity":1.0},{"social":0.9}],
  "q9":[{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
  "q10":[{"logic":1.0},{"creativity":1.0},{"social":1.0},{"leadership":0.9}],
  "q11":[{"music":1.0},{"music":0.85},{"music":0.5},{"logic":0.4}],
  "q12":[{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
  "q13":[{"creativity":1.0},{"languages":0.9},{"logic":1.0},{"sport":0.9}],
  "q14":[{"languages":1.0},{"memory":0.8},{"sport":0.7},{"creativity":0.7}],
  "q15":[{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
  "q16":[{"sport":1.0},{"nature":1.0},{"creativity":0.8},{"logic":0.7}],
  "q17":[{"social":1.0},{"leadership":0.9},{"creativity":0.8},{"memory":0.6}],
  "q18":[{"nature":1.0},{"logic":0.9},{"creativity":0.8},{"languages":0.7}],
  "q19":[{"sport":1.0},{"sport":0.9},{"social":0.7},{"logic":0.6}],
  "q20":[{"logic":1.0},{"creativity":1.0},{"social":1.0},{"nature":0.9}],
  "q21":[{"creativity":1.0},{"music":0.9},{"logic":0.8},{"social":0.7}],
  "q22":[{"social":1.0},{"social":0.9},{"creativity":0.8},{"leadership":0.9}],
  "q23":[{"nature":1.0},{"sport":0.8},{"nature":0.9},{"social":0.6}],
  "q24":[{"leadership":1.0},{"logic":0.9},{"creativity":0.9},{"sport":0.9}],
  "q25":[{"logic":1.0},{"creativity":0.9},{"social":1.0},{"nature":0.9}],
  "q26":[{"music":1.0},{"music":0.9},{"music":0.5},{"creativity":0.8}],
  "q27":[{"sport":1.0},{"sport":0.7},{"social":0.8},{"logic":0.7}],
  "q28":[{"languages":1.0},{"languages":0.9},{"languages":0.5},{"memory":0.6}],
  "q29":[{"nature":1.0},{"logic":0.9},{"nature":0.8},{"social":0.8}],
  "q30":[{"logic":0.8},{"creativity":1.0},{"music":1.0},{"leadership":1.0}],
};

const MAX_SCORES = {logic:7,creativity:8,memory:2,leadership:6,languages:6,music:5,sport:4,nature:5,social:6};

function calculateScores(answers) {
  const raw = {};
  for (const [qid, idx] of Object.entries(answers)) {
    const opts = INTEREST_MAP[qid];
    if (!opts || idx < 0 || idx >= opts.length) continue;
    for (const [t, v] of Object.entries(opts[idx])) {
      raw[t] = (raw[t] || 0) + v;
    }
  }
  const result = {};
  for (const [t, mx] of Object.entries(MAX_SCORES)) {
    const pct = ((raw[t] || 0) / mx) * 100;
    result[t] = Math.min(100, Math.max(5, Math.round(pct)));
  }
  return result;
}

function getAllQ(story) {
  return story.chapters.flatMap(ch => ch.questions.map(q => ({ ...q, chapterId: ch.id })));
}

export default function QuizPage({ setPage, setResults, lang, dark }) {
  const story    = STORY[lang] || STORY.en;
  const chapters = story.chapters;
  const allQ     = getAllQ(story);

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
  const totalDone = chapters.slice(0, chapterIdx).reduce((a, ch) => a + ch.questions.length, 0) + qInChapter;
  const totalQ   = allQ.length;
  const progress = Math.round((totalDone / totalQ) * 100);

  const handleAnswer = async () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [currentQ.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    const lastInChapter = qInChapter === chapterQ.length - 1;
    const lastChapter   = chapterIdx === chapters.length - 1;

    if (lastInChapter && lastChapter) {
      await submit(newAnswers);
    } else if (lastInChapter) {
      setPhase("chapter-complete");
    } else {
      setQInChapter(qInChapter + 1);
    }
  };

  const nextChapter = () => { setChapterIdx(chapterIdx + 1); setQInChapter(0); setPhase("chapter-intro"); };

  const submit = async (finalAnswers) => {
    setPhase("submitting");
    const localScores = calculateScores(finalAnswers);
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
            method:"POST", headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ answers:finalAnswers, scores:localScores, lang }),
          });
          data = await res.json();
          if (!data.scores) data.scores = localScores;
        } catch {
          data = { scores:localScores, careers:[], strengths:[], top_talents:Object.entries(localScores).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k) };
        }
      }
      setResults(data);
      setPage("results");
    } catch {
      setError(lang==="ru"?"Ошибка. Попробуй ещё раз.":lang==="uz"?"Xato. Qaytadan urinib ko'ring.":"Error. Please try again.");
      setPhase("question");
    }
  };

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background:dark?"linear-gradient(135deg,#0F1923,#1A2A3A)":"linear-gradient(135deg,#E1F5EE,#FAEEDA)" }}>
        <div style={{ fontSize:"5rem", marginBottom:16 }}>🌟</div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2.2rem", color:dark?"#E3F2FD":"#04342C", marginBottom:14, maxWidth:500 }}>{story.intro.title}</h1>
        <p style={{ fontSize:"1rem", fontWeight:600, color:dark?"#9FE1CB":"#0F6E56", maxWidth:460, lineHeight:1.8, marginBottom:18 }}>{story.intro.text}</p>
        <div style={{ background:dark?"#1A2A3A":"#fff", border:"1.5px solid #9FE1CB", borderRadius:14, padding:"10px 20px", marginBottom:24, fontSize:"0.85rem", fontWeight:800, color:"#0F6E56" }}>
          📋 {story.intro.note}
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:28, maxWidth:520 }}>
          {chapters.map((ch) => (
            <div key={ch.id} style={{ background:dark?"#1A2A3A":"#fff", border:`2px solid ${ch.color}55`, borderRadius:12, padding:"6px 14px", display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:800, color:dark?"#E3F2FD":ch.color }}>
              {ch.emoji} {ch.zone}
            </div>
          ))}
        </div>
        <button className="hero-cta" style={{ fontSize:"1.1rem", padding:"14px 40px", background:`linear-gradient(135deg,#0F6E56,#1D9E75)` }} onClick={() => setPhase("chapter-intro")}>
          {story.intro.btn}
        </button>
      </div>
    </div>
  );

  // ── CHAPTER INTRO ──────────────────────────────────────────────────────────
  if (phase === "chapter-intro") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background:dark?"#0F1923":chapter.bg }}>
        <div style={{ fontSize:"4rem", marginBottom:16 }}>{chapter.emoji}</div>
        <div style={{ background:chapter.color, color:"#fff", borderRadius:99, padding:"5px 20px", fontSize:"0.85rem", fontWeight:800, marginBottom:16 }}>
          {lang==="ru"?"ЗОНА":lang==="uz"?"ZONA":"ZONE"} {chapterIdx+1}/{chapters.length}
        </div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color:dark?"#E3F2FD":chapter.color, marginBottom:16 }}>{chapter.zone}</h2>
        <p style={{ fontSize:"1rem", fontWeight:600, color:dark?"#B0BEC5":"#546E7A", maxWidth:440, lineHeight:1.7, marginBottom:32 }}>{chapter.intro}</p>
        <button className="quiz-next" style={{ background:chapter.color, maxWidth:280 }} onClick={() => setPhase("question")}>
          {lang==="ru"?"Поехали! →":lang==="uz"?"Ketdik! →":"Let's go! →"}
        </button>
      </div>
    </div>
  );

  // ── CHAPTER COMPLETE ───────────────────────────────────────────────────────
  if (phase === "chapter-complete") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px", background:dark?"#0F1923":chapter.bg }}>
        <div style={{ fontSize:"4rem", marginBottom:16 }}>✅</div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", color:dark?"#E3F2FD":chapter.color, marginBottom:16, maxWidth:420 }}>{chapter.complete}</h2>
        <div style={{ display:"flex", gap:10, marginBottom:32 }}>
          {chapters.map((ch,i) => (
            <div key={i} style={{ width:14, height:14, borderRadius:"50%", background:i<=chapterIdx?ch.color:(dark?"#2A4070":"#E1F5EE"), transition:"all 0.4s" }} />
          ))}
        </div>
        {chapterIdx < chapters.length-1 && (
          <button className="quiz-next" style={{ background:chapters[chapterIdx+1]?.color||chapter.color, maxWidth:320 }} onClick={nextChapter}>
            {chapters[chapterIdx+1]?.emoji} {chapters[chapterIdx+1]?.zone} →
          </button>
        )}
      </div>
    </div>
  );

  // ── SUBMITTING ─────────────────────────────────────────────────────────────
  if (phase === "submitting") return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ textAlign:"center", padding:"60px 24px" }}>
        <div style={{ fontSize:"4rem", marginBottom:16 }}>{story.finale.mascot}</div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", color:dark?"#E3F2FD":"#0F6E56", marginBottom:12 }}>{story.finale.title}</h2>
        <p style={{ color:dark?"#9FE1CB":"#1D9E75", fontWeight:600, marginBottom:32 }}>{story.finale.text}</p>
        <Loader message={lang==="ru"?"Строим твою карту талантов... 🗺️":lang==="uz"?"Iste'dod xaritangiz tuzilmoqda... 🗺️":"Building your talent map... 🗺️"} />
      </div>
    </div>
  );

  // ── QUESTION ───────────────────────────────────────────────────────────────
  return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div className="progress-bar-wrap" style={{ marginTop:16 }}>
        <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
      </div>
      <div style={{ background:dark?"#1A2A3A":chapter.bg, padding:"10px 24px", display:"flex", alignItems:"center", gap:12, borderBottom:`2px solid ${chapter.color}33` }}>
        <span style={{ fontSize:"1.4rem" }}>{chapter.emoji}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:"0.7rem", fontWeight:800, color:chapter.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>
            {lang==="ru"?"Зона":lang==="uz"?"Zona":"Zone"} {chapterIdx+1}/{chapters.length} — {chapter.zone}
          </div>
          <div style={{ fontSize:"0.88rem", fontWeight:800, color:dark?"#E3F2FD":"#04342C" }}>{currentQ?.mission}</div>
        </div>
        <span style={{ fontSize:"0.8rem", fontWeight:800, color:"#9FE1CB" }}>{qInChapter+1}/{chapterQ.length}</span>
      </div>

      <div className="quiz-section">
        {error && <div style={{ background:"#FFEBEE", border:"1.5px solid #EF5350", borderRadius:10, padding:"10px 14px", color:"#C62828", fontWeight:700, marginBottom:14 }}>❌ {error}</div>}

        <p className="quiz-q" style={{ fontSize:"1.2rem", lineHeight:1.5, color:dark?"#E3F2FD":"#04342C" }}>{currentQ?.q}</p>

        <div className="quiz-options">
          {currentQ?.opts.map((opt, i) => (
            <button key={i}
              className={`quiz-option${selected===i?" selected":""}`}
              style={selected===i ? { borderColor:chapter.color, background:`${chapter.color}15`, color:chapter.color } : { color:dark?"#E3F2FD":"#37474F" }}
              onClick={() => setSelected(i)}>
              <span style={{ fontSize:"0.85rem", fontWeight:900, color:selected===i?chapter.color:"#9FE1CB", marginRight:10 }}>
                {["A","B","C","D"][i]}.
              </span>
              {opt}
            </button>
          ))}
        </div>

        <button className="quiz-next"
          style={{ background:selected===null?"#9FE1CB":chapter.color, opacity:selected===null?0.6:1, fontSize:"1.05rem", padding:"15px" }}
          onClick={handleAnswer} disabled={selected===null}>
          {qInChapter < chapterQ.length-1
            ? (lang==="ru"?"Следующий →":lang==="uz"?"Keyingi →":"Next →")
            : chapterIdx < chapters.length-1
            ? `${chapters[chapterIdx+1]?.emoji} ${lang==="ru"?"Следующая зона":lang==="uz"?"Keyingi zona":"Next zone"} →`
            : (lang==="ru"?"Узнать мои таланты! 🌟":lang==="uz"?"Iste'dodlarimni bilish! 🌟":"Discover my talents! 🌟")
          }
        </button>

        <p style={{ textAlign:"center", fontSize:"0.75rem", color:"#9FE1CB", fontWeight:700, marginTop:12 }}>
          {lang==="ru"?`Вопрос ${totalDone+1} из ${totalQ}`:lang==="uz"?`Savol ${totalDone+1} / ${totalQ}`:`Question ${totalDone+1} of ${totalQ}`}
        </p>
      </div>
    </div>
  );
}
