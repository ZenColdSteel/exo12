import http from "http";
import { handleArticleRequest as handleArticleRequest } from "./routes/articles.js";
import { handleUserRequest } from "./routes/users.js"; // <- Import de la gestion des utilisateurs
import { logRequest, logError } from "./utils/logger.js";

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Préflight CORS
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // Log la requête
    await logRequest(req.method, req.url);

    try {
        if (req.url.startsWith("/articles")) {
            await handleArticleRequest(req, res);
        } else if (req.url.startsWith("/users")) {
            // <- Ajout de la route pour /users
            await handleUserRequest(req, res);
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Route not found" }));
        }
    } catch (error) {
        await logError(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
});

const PORT = 4001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
