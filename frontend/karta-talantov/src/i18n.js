// src/i18n.js
// All text in the app in 3 languages.
// Usage: import { t } from "../i18n"; then t(lang, "home.title")

const translations = {
  // ── Nav ──────────────────────────────────────────────────────────────────
  "nav.home":     { ru: "Главная",   uz: "Bosh sahifa", en: "Home"    },
  "nav.tasks":    { ru: "Задания",   uz: "Vazifalar",   en: "Tasks"   },
  "nav.quiz":     { ru: "Тест",      uz: "Test",        en: "Quiz"    },
  "nav.results":  { ru: "Карта",     uz: "Xarita",      en: "Results" },
  "nav.develop":  { ru: "Развитие",  uz: "Rivojlanish", en: "Develop" },
  "nav.logout":   { ru: "Выйти",     uz: "Chiqish",     en: "Logout"  },

  // ── Home ─────────────────────────────────────────────────────────────────
  "home.title":      { ru: "Узнай свои таланты!",         uz: "Iste'dodingni bil!",         en: "Discover your talents!" },
  "home.cta":        { ru: "Начать тест",                  uz: "Testni boshlash",             en: "Start quiz"             },
  "home.step1":      { ru: "Играй",                        uz: "O'yna",                       en: "Play"                   },
  "home.step1desc":  { ru: "Проходи весёлые мини-игры",    uz: "Qiziqarli mini-o'yinlar o'yna", en: "Play fun mini-games"  },
  "home.step2":      { ru: "Получай результат",            uz: "Natijani ol",                 en: "Get results"            },
  "home.step2desc":  { ru: "Узнай свои сильные стороны",   uz: "Kuchli tomonlaringni bil",    en: "Know your strengths"    },
  "home.step3":      { ru: "Развивайся",                   uz: "Rivojlan",                    en: "Grow"                   },
  "home.step3desc":  { ru: "Найди подходящее занятие",     uz: "Mos mashg'ulot top",          en: "Find the right activity"},

  // ── Auth ─────────────────────────────────────────────────────────────────
  "auth.login":      { ru: "Войти",              uz: "Kirish",           en: "Login"           },
  "auth.register":   { ru: "Регистрация",        uz: "Ro'yxatdan o'tish", en: "Register"       },
  "auth.name":       { ru: "Твоё имя",           uz: "Ismingiz",         en: "Your name"       },
  "auth.age":        { ru: "Возраст (необяз.)",  uz: "Yosh (ixtiyoriy)", en: "Age (optional)"  },
  "auth.email":      { ru: "Email",              uz: "Email",            en: "Email"            },
  "auth.password":   { ru: "Пароль",             uz: "Parol",            en: "Password"         },
  "auth.loginBtn":   { ru: "Войти 🚀",           uz: "Kirish 🚀",        en: "Login 🚀"         },
  "auth.registerBtn":{ ru: "Создать аккаунт ⭐", uz: "Akkaunt yaratish ⭐", en: "Create account ⭐"},
  "auth.guest":      { ru: "Попробовать без входа →", uz: "Kirmasdan sinash →", en: "Try without login →"},
  "auth.success":    { ru: "Аккаунт создан! Теперь войди 🎉", uz: "Akkaunt yaratildi! Endi kiring 🎉", en: "Account created! Now login 🎉"},
  "auth.errFill":    { ru: "Заполни все поля!",  uz: "Barcha maydonlarni to'ldiring!", en: "Fill in all fields!" },
  "auth.errLogin":   { ru: "Неверный email или пароль", uz: "Email yoki parol noto'g'ri", en: "Incorrect email or password"},
  "auth.subtitle":   { ru: "Узнай свои способности!", uz: "Qobiliyatingni bil!", en: "Discover your abilities!" },
  "auth.loading.login": { ru: "Входим в аккаунт... 🚀", uz: "Hisobga kirilmoqda... 🚀", en: "Logging in... 🚀" },
  "auth.loading.reg":   { ru: "Создаём аккаунт... ⭐",  uz: "Akkaunt yaratilmoqda... ⭐", en: "Creating account... ⭐" },

  // ── Quiz ─────────────────────────────────────────────────────────────────
  "quiz.counter":   { ru: "Вопрос",                      uz: "Savol",                   en: "Question"              },
  "quiz.of":        { ru: "из",                           uz: "dan",                     en: "of"                    },
  "quiz.next":      { ru: "Следующий вопрос →",          uz: "Keyingi savol →",         en: "Next question →"       },
  "quiz.finish":    { ru: "Получить результат 🎉",       uz: "Natijani olish 🎉",       en: "Get results 🎉"        },
  "quiz.analyzing": { ru: "Анализируем таланты... 🧠",   uz: "Iste'dodlar tahlil qilinmoqda... 🧠", en: "Analyzing talents... 🧠"},
  "quiz.errServer": { ru: "Сервер не отвечает. Убедись, что бэкенд запущен.", uz: "Server javob bermayapti.", en: "Server not responding. Make sure backend is running."},
  "quiz.retry":     { ru: "Попробовать снова",           uz: "Qayta urinish",           en: "Try again"             },

  // ── Results ──────────────────────────────────────────────────────────────
  "results.title":    { ru: "ТВОЯ КАРТА ТАЛАНТОВ",       uz: "ISTE'DOD XARITANG",       en: "YOUR TALENT MAP"       },
  "results.progress": { ru: "Общий прогресс",            uz: "Umumiy progress",          en: "Overall progress"      },
  "results.strengths":{ ru: "Твои сильные стороны:",     uz: "Kuchli tomonlaring:",      en: "Your strengths:"       },
  "results.careers":  { ru: "Профессии для тебя:",       uz: "Sening kasblar:",          en: "Careers for you:"      },
  "results.develop":  { ru: "Развивать таланты →",       uz: "Iste'dodlarni rivojlantirish →", en: "Develop talents →"},
  "results.demo":     { ru: "📋 Это демо-данные. Пройди тест!", uz: "📋 Bu demo ma'lumotlar. Testni o'ting!", en: "📋 Demo data. Take the quiz for real results!"},
  "results.loading":  { ru: "Загружаем твои результаты... 📊", uz: "Natijalar yuklanmoqda... 📊", en: "Loading your results... 📊"},
  "results.allround": { ru: "Всесторонне развитый!",     uz: "Har tomonlama rivojlangan!", en: "Well-rounded!"       },

  // ── Talent labels ─────────────────────────────────────────────────────────
  "talent.logic":      { ru: "Логика",      uz: "Mantiq",       en: "Logic"      },
  "talent.creativity": { ru: "Творчество",  uz: "Ijodkorlik",   en: "Creativity" },
  "talent.memory":     { ru: "Память",      uz: "Xotira",       en: "Memory"     },
  "talent.leadership": { ru: "Лидерство",   uz: "Liderlik",     en: "Leadership" },
  "talent.languages":  { ru: "Языки",       uz: "Tillar",       en: "Languages"  },
  "talent.music":      { ru: "Музыка",      uz: "Musiqa",       en: "Music"      },

  // ── Develop ──────────────────────────────────────────────────────────────
  "develop.banner":   { ru: "Развивай свои таланты!",    uz: "Iste'dodingni rivojlantir!", en: "Develop your talents!" },
  "develop.personal": { ru: "⭐ Персональные рекомендации", uz: "⭐ Shaxsiy tavsiyalar",  en: "⭐ Personal recommendations"},
  "develop.fits":     { ru: "Тебе подойдёт программирование:", uz: "Sanga dasturlash mos keladi:", en: "Programming suits you:" },
  "develop.tip1":     { ru: "Пройди курс по кодингу",    uz: "Kodlash kursini o'ta",     en: "Take a coding course"  },
  "develop.tip2":     { ru: "Собери робота",             uz: "Robot yig'",               en: "Build a robot"         },
  "develop.tip3":     { ru: "Попробуй создать свою игру",uz: "O'z o'yiningni yaratishga urush", en: "Try creating your own game"},
  "develop.careers":  { ru: "Профессии рядом с тобой:", uz: "Yaqiningdagi kasblar:",     en: "Careers near you:"     },
  "develop.course":   { ru: "Курс «Юный программист»",  uz: "«Yosh dasturchi» kursi",    en: "Young Programmer course"},
  "develop.robotics": { ru: "Секция робототехники",      uz: "Robototexnika sektsiyasi",  en: "Robotics section"      },
  "develop.chess":    { ru: "Шахматный кружок",          uz: "Shaxmat to'garagi",         en: "Chess club"            },
  "develop.helper":   { ru: "Твой личный помощник в обучении!", uz: "Sizning shaxsiy o'quv yordamchingiz!", en: "Your personal learning assistant!"},
  "develop.nearby":   { ru: "📍 Рядом с Tashkent:",     uz: "📍 Toshkent yaqinida:",     en: "📍 Near Tashkent:"     },
  "develop.toHome":   { ru: "← На главную",             uz: "← Bosh sahifa",             en: "← Home"                },
  "develop.toTasks":  { ru: "Пройти игры 🎮",           uz: "O'yinlarni o'yna 🎮",       en: "Play games 🎮"         },

  // ── Tasks ─────────────────────────────────────────────────────────────────
  "tasks.title":      { ru: "Выбери задание:",           uz: "Vazifani tanlang:",         en: "Choose a task:"        },
  "tasks.logic":      { ru: "Логика",                    uz: "Mantiq",                    en: "Logic"                 },
  "tasks.creativity": { ru: "Творчество",                uz: "Ijodkorlik",                en: "Creativity"            },
  "tasks.memory":     { ru: "Память",                    uz: "Xotira",                    en: "Memory"                },
  "tasks.comm":       { ru: "Коммуникация",              uz: "Muloqot",                   en: "Communication"         },
  "tasks.desc1":      { ru: "Реши головоломку",          uz: "Jumboqni yech",             en: "Solve a puzzle"        },
  "tasks.desc2":      { ru: "Нарисуй картину",           uz: "Rasm chiz",                 en: "Draw a picture"        },
  "tasks.desc3":      { ru: "Запомни порядок",           uz: "Tartibni esla",             en: "Remember the order"    },
  "tasks.desc4":      { ru: "Ответь на вопросы",         uz: "Savollarga javob ber",      en: "Answer questions"      },
};

// Helper: get translated string
export function t(lang, key) {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry["ru"] || key;
}

export default translations;
