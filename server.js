const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

let classes = [];
let students = [];
let leagueQuestions = [];

const practiceQuestions = [
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
body{
  margin:0;
  font-family:Arial,sans-serif;
  background:linear-gradient(180deg,#4a90ff,#6ab7ff);
  min-height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
}
.card{
  background:white;
  padding:35px;
  border-radius:25px;
  box-shadow:0 10px 30px rgba(0,0,0,.25);
  text-align:center;
  width:480px;
  max-width:92%;
}
h1{color:#1f3f75;margin-top:0;}
.btn{
  display:block;
  width:100%;
  box-sizing:border-box;
  padding:14px;
  margin:10px 0;
  border:none;
  border-radius:15px;
  font-size:18px;
  font-weight:bold;
  cursor:pointer;
  text-decoration:none;
}
.yellow{background:#ffcc00;color:black}
.green{background:#4caf50;color:white}
.blue{background:#2196f3;color:white}
.red{background:#e53935;color:white}
.gray{background:#ddd;color:#222}
.purple{background:#7b3ff2;color:white}
input, select{
  width:100%;
  box-sizing:border-box;
  padding:12px;
  font-size:17px;
  border-radius:12px;
  border:1px solid #ccc;
  margin:8px 0;
}
.list{
  text-align:left;
  background:#f2f6ff;
  border-radius:14px;
  padding:12px;
  margin:10px 0;
}
.small{font-size:14px;color:#666;}
.symbols{font-size:34px;margin-top:20px;}
.correct{font-size:60px;color:#4caf50;}
.wrong{font-size:60px;color:#e53935;}
.separator{
  margin:22px 0 14px 0;
  border-top:1px solid #ddd;
}
.status{
  background:#eef5ff;
  padding:10px;
  border-radius:12px;
  margin-bottom:15px;
  font-weight:bold;
}
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
    <a class="btn purple" href="/admin">♣ Adminbereich</a>
    <a class="btn blue" href="/practice">♦ Practice Mode</a>
    <div class="symbols">♥ ♠ ♦ ♣</div>
  `));
});

/* ADMINBEREICH */

app.get("/admin", (req, res) => {
  const list = leagueQuestions.map((q, index) => `
    <div class="list">
      <strong>Frage ${index + 1}:</strong> ${q.q}<br>
      <span class="small">Richtig: ${q.answers[q.correct]}</span>
      <form method="POST" action="/admin/question/${q.id}/delete">
        <button class="btn red" type="submit">Frage löschen</button>
      </form>
    </div>
  `).join("") || "<p>Noch keine offiziellen Liga-Fragen angelegt.</p>";

  res.send(page(`
    <h1>Adminbereich</h1>
    <p>Nur der Admin legt offizielle Liga-Fragen an.</p>

    <a class="btn purple" href="/admin/new-question">Neue Liga-Frage anlegen</a>

    <h2>Offizielle Liga-Fragen</h2>
    ${list}

    <a class="btn yellow" href="/">Startseite</a>
  `));
});

app.get("/admin/new-question", (req, res) => {
  res.send(page(`
    <h1>Neue Liga-Frage</h1>

    <form method="POST" action="/admin/questions">
      <input name="question" placeholder="Frage" required>
      <input name="a0" placeholder="Antwort ♥" required>
      <input name="a1" placeholder="Antwort ♠" required>
      <input name="a2" placeholder="Antwort ♦" required>
      <input name="a3" placeholder="Antwort ♣" required>

      <select name="correct" required>
        <option value="0">♥ Antwort 1 ist richtig</option>
        <option value="1">♠ Antwort 2 ist richtig</option>
        <option value="2">♦ Antwort 3 ist richtig</option>
        <option value="3">♣ Antwort 4 ist richtig</option>
      </select>

      <button class="btn purple" type="submit">Liga-Frage speichern</button>
    </form>

    <a class="btn yellow" href="/admin">Zurück</a>
  `));
});

app.post("/admin/questions", (req, res) => {
  leagueQuestions.push({
    id: Date.now().toString(),
    q: req.body.question,
    answers: [req.body.a0, req.body.a1, req.body.a2, req.body.a3],
    correct: Number(req.body.correct)
  });

  res.redirect("/admin");
});

app.post("/admin/question/:id/delete", (req, res) => {
  leagueQuestions = leagueQuestions.filter(q => q.id !== req.params.id);
  res.redirect("/admin");
});

/* LEHRERBEREICH */

app.get("/teacher", (req, res) => {
  const classList = classes.map(c => `
    <div class="list">
      <strong>${c.name}</strong><br>
      <span class="small">${students.filter(s => s.classId === c.id).length} Schüler/innen</span>
      <a class="btn blue" href="/teacher/class/${c.id}">Öffnen</a>
      <form method="POST" action="/teacher/class/${c.id}/delete">
        <button class="btn red" type="submit">Klasse löschen</button>
      </form>
    </div>
  `).join("") || "<p>Noch keine Klasse angelegt.</p>";

  res.send(page(`
    <h1>Lehrerbereich</h1>
    <p>Lehrer legen Klassen und Schüler/innen an.</p>

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

app.post("/teacher/class/:id/delete", (req, res) => {
  classes = classes.filter(c => c.id !== req.params.id);
  students = students.filter(s => s.classId !== req.params.id);
  res.redirect("/teacher");
});

app.get("/teacher/class/:id", (req, res) => {
  const schoolClass = classes.find(c => c.id === req.params.id);
  if (!schoolClass) return res.redirect("/teacher");

  const classStudents = students.filter(s => s.classId === schoolClass.id);

  const studentList = classStudents.map(s => `
    <div class="list">
      <strong>${s.name}</strong>
      <form method="POST" action="/teacher/student/${s.id}/delete">
        <button class="btn red" type="submit">Schüler/in entfernen</button>
      </form>
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

app.post("/teacher/student/:id/delete", (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.redirect("/teacher");

  const classId = student.classId;
  students = students.filter(s => s.id !== req.params.id);

  res.redirect(`/teacher/class/${classId}`);
});

app.get("/teacher/class/:id/start-league", (req, res) => {
  const schoolClass = classes.find(c => c.id === req.params.id);
  if (!schoolClass) return res.redirect("/teacher");

  res.send(page(`
    <h1>Offizielles Liga-Spiel</h1>
    <p>Klasse: <strong>${schoolClass.name}</strong></p>
    <p>Offizielle Liga-Fragen vorhanden: <strong>${leagueQuestions.length}</strong></p>
    <p class="small">Regel: Pro Klasse und pro Schüler/in nur 1× spielbar.</p>
    <p>Das echte Liga-Spiel mit Spielcode und Sperre kommt im nächsten Schritt.</p>
    <a class="btn yellow" href="/teacher/class/${schoolClass.id}">Zurück</a>
  `));
});

/* SPIEL BEITRETEN */

app.get("/join", (req, res) => {
  res.send(page(`
    <h1>Spiel beitreten</h1>
    <p>Spielcode-System kommt im nächsten Schritt.</p>
    <input placeholder="Spielcode">
    <a class="btn yellow" href="/">Zurück</a>
  `));
});

/* PRACTICE MODE */

app.get("/practice", (req, res) => {
  res.send(page(`
    <h1>Practice Mode</h1>
    <p>Übungsfragen werden später KI-generiert.</p>
    <form method="POST" action="/practice/start">
      <input name="name" placeholder="Dein Name" required>
      <button class="btn blue" type="submit">Start</button>
    </form>

    <div class="separator"></div>
    <a class="btn yellow" href="/">Practice Mode verlassen</a>
  `));
});

app.post("/practice/start", (req, res) => {
  res.redirect(`/practice/question/0?score=0&name=${encodeURIComponent(req.body.name)}`);
});

app.get("/practice/question/:id", (req, res) => {
  const id = Number(req.params.id);
  const score = Number(req.query.score || 0);
  const name = req.query.name || "Player";

  if (id >= practiceQuestions.length) {
    return res.redirect(`/practice/result?score=${score}&name=${encodeURIComponent(name)}`);
  }

  const q = practiceQuestions[id];

  res.send(page(`
    <div class="status">Frage ${id + 1}/${practiceQuestions.length} · Punkte: ${score}</div>
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

    <div class="separator"></div>
    <a class="btn yellow" href="/">Practice Mode verlassen</a>
  `));
});

app.post("/practice/answer", (req, res) => {
  const id = Number(req.body.id);
  const oldScore = Number(req.body.score || 0);
  const answer = Number(req.body.answer);
  const name = req.body.name || "Player";

  const isCorrect = answer === practiceQuestions[id].correct;
  const newScore = isCorrect ? oldScore + 1 : oldScore;

  res.redirect(`/practice/feedback/${id}?score=${newScore}&name=${encodeURIComponent(name)}&correct=${isCorrect}`);
});

app.get("/practice/feedback/:id", (req, res) => {
  const id = Number(req.params.id);
  const q = practiceQuestions[id];
  const score = Number(req.query.score || 0);
  const name = req.query.name || "Player";
  const isCorrect = req.query.correct === "true";

  res.send(page(`
    ${isCorrect ? `<div class="correct">✓</div><h1>Richtig!</h1>` : `<div class="wrong">✗</div><h1>Leider falsch!</h1>`}

    <p><strong>Frage:</strong> ${q.q}</p>
    <p><strong>Richtige Antwort:</strong><br>${q.answers[q.correct]}</p>
    <p class="small">Aktueller Punktestand: ${score}</p>

    <a class="btn blue" href="/practice/question/${id + 1}?score=${score}&name=${encodeURIComponent(name)}">Weiter</a>

    <div class="separator"></div>
    <a class="btn yellow" href="/">Practice Mode verlassen</a>
  `));
});

app.get("/practice/result", (req, res) => {
  res.send(page(`
    <h1>🏆 Ergebnis</h1>
    <h2>${req.query.name}</h2>
    <p>Du hast <strong>${req.query.score} von ${practiceQuestions.length}</strong> Punkten erreicht.</p>
    <a class="btn blue" href="/practice">Nochmal spielen</a>
    <a class="btn yellow" href="/">Startseite</a>
  `));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("English Champ läuft auf Port " + PORT));
