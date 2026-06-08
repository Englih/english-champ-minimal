const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

const questions = [
  {
    q: "What does 'I have got' mean?",
    answers: ["Ich bin", "Ich habe", "Ich gehe", "Ich sehe"],
    correct: 1
  },
  {
    q: "Choose the correct sentence.",
    answers: ["He have got a book.", "He has got a book.", "He got has a book.", "He is got a book."],
    correct: 1
  },
  {
    q: "What is the plural of 'child'?",
    answers: ["childs", "childes", "children", "childrens"],
    correct: 2
  },
  {
    q: "Translate: 'pirate'",
    answers: ["Pirat", "König", "Lehrer", "Schüler"],
    correct: 0
  },
  {
    q: "Which word is an animal?",
    answers: ["ship", "parrot", "island", "treasure"],
    correct: 1
  }
];

function page(content) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>English Champ</title>
<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: linear-gradient(180deg,#4a90ff,#6ab7ff);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card {
  background: white;
  padding: 35px;
  border-radius: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  text-align: center;
  width: 430px;
}
h1 { color: #1f3f75; }
.btn {
  display: block;
  width: 100%;
  padding: 15px;
  margin: 12px 0;
  border: none;
  border-radius: 15px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}
.yellow { background:#ffcc00; color:black; }
.green { background:#4caf50; color:white; }
.blue { background:#2196f3; color:white; }
.red { background:#e53935; color:white; }
input {
  width: 90%;
  padding: 14px;
  font-size: 18px;
  border-radius: 12px;
  border: 1px solid #ccc;
}
.symbols { font-size: 34px; margin-top: 25px; }
</style>
</head>
<body>
<div class="card">
${content}
</div>
</body>
</html>`;
}

app.get("/", (req, res) => {
  res.send(page(`
    <h1>🏆 English Champ</h1>
    <p>Play • Connect • Grow</p>
    <a class="btn yellow" href="/join">❤ Spiel beitreten</a>
    <a class="btn green" href="/teacher">♠ Lehrer Login</a>
    <a class="btn blue" href="/practice">♦ Practice Mode</a>
    <div class="symbols">♥ ♠ ♦ ♣</div>
  `));
});

app.get("/join", (req, res) => {
  res.send(page(`
    <h1>Spiel beitreten</h1>
    <p>Offizielle Liga-Spiele kommen im nächsten Schritt.</p>
    <a class="btn yellow" href="/">Zurück</a>
  `));
});

app.get("/teacher", (req, res) => {
  res.send(page(`
    <h1>Lehrerbereich</h1>
    <p>Lehrer legen später Klassen und Schüler an und starten freigegebene Liga-Spiele.</p>
    <a class="btn green" href="/">Zurück</a>
  `));
});

app.get("/practice", (req, res) => {
  res.send(page(`
    <h1>Practice Mode</h1>
    <form method="POST" action="/practice/start">
      <p>Dein Name:</p>
      <input name="name" required>
      <button class="btn blue" type="submit">Start</button>
    </form>
    <a class="btn yellow" href="/">Zurück</a>
  `));
});

app.post("/practice/start", (req, res) => {
  const name = encodeURIComponent(req.body.name || "Player");
  res.redirect(`/practice/question/0?score=0&name=${name}`);
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
  const answer = Number(req.body.answer);
  const name = req.body.name || "Player";

  if (answer === questions[id].correct) {
    score++;
  }

  res.redirect(`/practice/question/${id + 1}?score=${score}&name=${encodeURIComponent(name)}`);
});

app.get("/practice/result", (req, res) => {
  const score = Number(req.query.score || 0);
  const name = req.query.name || "Player";

  res.send(page(`
    <h1>🏆 Ergebnis</h1>
    <h2>${name}</h2>
    <p>Du hast <strong>${score} von ${questions.length}</strong> Punkten erreicht.</p>
    <a class="btn blue" href="/practice">Nochmal spielen</a>
    <a class="btn yellow" href="/">Startseite</a>
  `));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("English Champ läuft auf Port " + PORT);
});
