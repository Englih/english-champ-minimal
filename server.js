const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

let classes = [];
let students = [];

const questions = [
  { q: "What does 'I have got' mean?", answers: ["Ich bin", "Ich habe", "Ich gehe", "Ich sehe"], correct: 1 },
  { q: "Choose the correct sentence.", answers: ["He have got a book.", "He has got a book.", "He got has a book.", "He is got a book."], correct: 1 },
  { q: "What is the plural of 'child'?", answers: ["childs", "childes", "children", "childrens"], correct: 2 },
  { q: "Translate: 'pirate'", answers: ["Pirat", "König", "Lehrer", "Schüler"], correct: 0 },
  { q: "Which word is an animal?", answers: ["ship", "parrot", "island", "treasure"], correct: 1 }
];

function page(content) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>English Champ</title>
<style>
body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(180deg,#4a90ff,#6ab7ff);min-height:100vh;display:flex;justify-content:center;align-items:center;}
.card{background:white;padding:35px;border-radius:25px;box-shadow:0 10px 30px rgba(0,0,0,.25);text-align:center;width:460px;max-width:90%;}
h1{color:#1f3f75;margin-top:0;}
.btn{display:block;width:100%;box-sizing:border-box;padding:14px;margin:10px 0;border:none;border-radius:15px;font-size:18px;font-weight:bold;cursor:pointer;text-decoration:none;}
.yellow{background:#ffcc00;color:black}.green{background:#4caf50;color:white}.blue{background:#2196f3;color:white}.red{background:#e53935;color:white}.gray{background:#ddd;color:#222}
input,select{width:100%;box-sizing:border-box;padding:12px;font-size:17px;border-radius:12px;border:1px solid #ccc;margin:8px 0;}
.list{text-align:left;background:#f2f6ff;border-radius:14px;padding:12px;margin:10px 0;}
.small{font-size:14px;color:#666;}
.symbols{font-size:34px;margin-top:20px;}
</style>
</head>
<body><div class="card">${content}</div></body></html>`;
}

app.get("/", (req, res) => {
  res.send(page(`
    <h1>🏆 English Champ</h1>
    <p>Play • Connect • Grow</p>
    <a class="btn yellow" href="/join">❤ Spiel beitreten</a>
    <a class="btn green" href="/teacher">♠ Lehrerbereich</a>
    <a class="btn blue" href="/practice">♦ Practice Mode</a>
    <div class="symbols">♥ ♠ ♦ ♣</div>
  `));
});

app.get("/teacher", (req, res) => {
  const classList = classes.map(c => `
    <div class="list">
      <strong>${c.name}</strong><br>
      <span class="small">${students.filter(s => s.classId === c.id).length} Schüler/innen</span>
      <a class="btn blue" href="/teacher/class/${c.id}">Öffnen</a>
    </div>
  `).join("") || "<p>Noch keine Klasse angelegt.</p>";

  res.send(page(`
    <h1>Lehrerbereich</h1>
    <p>Klassen und Schüler/innen anlegen</p>

    <form method="POST" action="/teacher/classes">
      <input name="className" placeholder="z. B. 2A" required>
      <button class="btn green" type="submit">Klasse anlegen</button>
    </form>

    ${classList}

    <a class="btn yellow" href="/">Startseite</a>
  `));
});

app.post("/teacher/classes", (req, res) => {
  classes.push({ id: Date.now().toString(), name: req.body.className });
  res.redirect("/teacher");
});

app.get("/teacher/class/:id", (req, res) => {
  const schoolClass = classes.find(c => c.id === req.params.id);
  if (!schoolClass) return res.redirect("/teacher");

  const classStudents = students.filter(s => s.classId === schoolClass.id);

  const studentList = classStudents.map(s => `
    <div class="list">
      ${s.name}
    </div>
  `).join("") || "<p>Noch keine Schüler/innen angelegt.</p>";

  res.send(page(`
    <h1>Klasse ${schoolClass.name}</h1>

    <form method="POST" action="/teacher/class/${schoolClass.id}/students">
      <input name="studentName" placeholder="Name Schüler/in" required>
      <button class="btn green" type="submit">Schüler/in hinzufügen</button>
    </form>

    ${studentList}

    <a class="btn blue" href="/teacher/class/${schoolClass.id}/start-league">Liga-Spiel starten</a>
    <a class="btn yellow" href="/teacher">Zurück</a>
  `));
});

app.post("/teacher/class/:id/students", (req, res) => {
  students.push({
    id: Date.now().toString(),
    classId: req.params.id,
    name: req.body.studentName
  });
  res.redirect(`/teacher/class/${req.params.id}`);
});

app.get("/teacher/class/:id/start-league", (req, res) => {
  const schoolClass = classes.find(c => c.id === req.params.id);
  if (!schoolClass) return res.redirect("/teacher");

  res.send(page(`
    <h1>Offizielles Liga-Spiel</h1>
    <p>Klasse: <strong>${schoolClass.name}</strong></p>
    <p>Hier startet später das freigegebene Liga-Spiel.</p>
    <p class="small">Regel: Pro Klasse und pro Schüler nur 1× spielbar.</p>
    <a class="btn yellow" href="/teacher/class/${schoolClass.id}">Zurück</a>
  `));
});

app.get("/join", (req, res) => {
  res.send(page(`
    <h1>Spiel beitreten</h1>
    <p>Spielcode-System kommt im nächsten Schritt.</p>
    <input placeholder="Spielcode">
    <a class="btn yellow" href="/">Zurück</a>
  `));
});

app.get("/practice", (req, res) => {
  res.send(page(`
    <h1>Practice Mode</h1>
    <form method="POST" action="/practice/start">
      <input name="name" placeholder="Dein Name" required>
      <button class="btn blue" type="submit">Start</button>
    </form>
    <a class="btn yellow" href="/">Zurück</a>
  `));
});

app.post("/practice/start", (req, res) => {
  res.redirect(`/practice/question/0?score=0&name=${encodeURIComponent(req.body.name)}`);
});

app.get("/practice/question/:id", (req, res) => {
  const id = Number(req.params.id);
  const score = Number(req.query.score || 0);
  const name = req.query.name || "Player";

  if (id >= questions.length) {
    return res.redirect(`/practice/result?score=${score}&name=${encodeURIComponent(name)}`);
  }

  const q = questions[id];

  res.send(page(`
    <h1>Frage ${id + 1}/${questions.length}</h1>
    <h2>${q.q}</h2>
    <form method="POST" action="/practice/answer">
      <input type="hidden" name="id" value="${id}">
      <input type="hidden" name="score" value="${score}">
      <input type="hidden" name="name" value="${name}">
      ${q.answers.map((a, i) => `
        <button class="btn ${["red","green","yellow","blue"][i]}" name="answer" value="${i}" type="submit">
          ${["♥","♠","♦","♣"][i]} ${a}
        </button>
      `).join("")}
    </form>
  `));
});

app.post("/practice/answer", (req, res) => {
  const id = Number(req.body.id);
  let score = Number(req.body.score || 0);
  if (Number(req.body.answer) === questions[id].correct) score++;
  res.redirect(`/practice/question/${id + 1}?score=${score}&name=${encodeURIComponent(req.body.name)}`);
});

app.get("/practice/result", (req, res) => {
  res.send(page(`
    <h1>🏆 Ergebnis</h1>
    <h2>${req.query.name}</h2>
    <p>Du hast <strong>${req.query.score} von ${questions.length}</strong> Punkten erreicht.</p>
    <a class="btn blue" href="/practice">Nochmal spielen</a>
    <a class="btn yellow" href="/">Startseite</a>
  `));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("English Champ läuft auf Port " + PORT));
