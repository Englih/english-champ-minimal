const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>English Champ</title>

<style>
body{
margin:0;
font-family:Arial, sans-serif;
background:linear-gradient(180deg,#4a90ff,#6ab7ff);
display:flex;
justify-content:center;
align-items:center;
height:100vh;
}

.card{
background:white;
padding:40px;
border-radius:25px;
box-shadow:0 10px 30px rgba(0,0,0,0.25);
text-align:center;
width:420px;
}

.logo{
font-size:48px;
margin-bottom:10px;
}

h1{
margin:0;
color:#1f3f75;
}

.subtitle{
margin-top:10px;
margin-bottom:30px;
color:#666;
}

.btn{
display:block;
width:100%;
padding:15px;
margin:12px 0;
border:none;
border-radius:15px;
font-size:20px;
font-weight:bold;
cursor:pointer;
}

.join{
background:#ffcc00;
}

.teacher{
background:#4caf50;
color:white;
}

.practice{
background:#2196f3;
color:white;
}

.symbols{
font-size:36px;
margin-top:25px;
}

.red{color:red;}
.green{color:green;}
.yellow{color:#d4aa00;}
.blue{color:blue;}
</style>
</head>

<body>

<div class="card">

<div class="logo">🏆</div>

<h1>English Champ</h1>

<div class="subtitle">
Play • Connect • Grow
</div>

<button class="btn join">
❤ Spiel beitreten
</button>

<button class="btn teacher">
♠ Lehrer Login
</button>

<button class="btn practice">
♦ Practice Mode
</button>

<div class="symbols">
<span class="red">♥</span>
<span class="green">♠</span>
<span class="yellow">♦</span>
<span class="blue">♣</span>
</div>

</div>

</body>
</html>
`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("English Champ läuft auf Port " + PORT);
});
