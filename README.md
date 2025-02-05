# JWT-Simples-Node-Example
Simple code exemplifying the use of JWT for authentication


### **Steps to run:**  
1. Install libs:  
   ```sh
   npm install jsonwebtoken express dotenv
   ```  
2. Run the serve.
   ```sh
   node app.js
   ```  

---

### **Code**
```javascript
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
```

---

### **How to test**  

1️⃣ **Generate a token:**  
   ```http
   POST http://localhost:3000/autenticacao
   Content-Type: application/json

   {
     "username": "Wata"
   }
   ```
   **Answer:**  
   ```json
   {
     "token": "eyJhbGciOiJIUzI1..."
   }
   ```

2️⃣ **Using token to access the proctected route:**  
   ```http
   GET http://localhost:3000/perfil
   Authorization: Bearer <token>
   ```
   **Answer:**  
   ```json
   {
     "mensagem": "Acesso autorizado!",
     "user": { "username": "wata" }
   }
   ```

---
