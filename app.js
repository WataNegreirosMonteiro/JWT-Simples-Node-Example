const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || "chaveSecreta123";

app.post("/autenticacao", (req, res) => {
    const { username } = req.body;

    if (!username) return res.status(400).json({ error: "Usuário obrigatório" });

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
});

function autenticarTokenMiddleware(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Acesso negado" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token inválido" });

        req.user = decoded;
        next();
    });
}

app.get("/perfil", autenticarTokenMiddleware, (req, res) => {
    res.json({ mensagem: "Acesso autorizado!", user: req.user });
});

app.listen(3000, () => console.log("[SERVIDOR ATIVO] | [PORTA: 3000]"));
