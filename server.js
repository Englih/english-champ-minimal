const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>English Champ</title>
      </head>
      <body style="font-family:Arial;text-align:center;padding-top:50px;">
        <h1>🏆 English Champ</h1>
        <h2>Server läuft erfolgreich!</h2>
        <p>Minimal-Prototyp Version 1</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log("English Champ läuft auf Port " + PORT);
});
