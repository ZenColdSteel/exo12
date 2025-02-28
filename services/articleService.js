import {
    getAllArticlesRepo,
    getArticleByIdRepo,
    getArticlesByUserIdRepo,
    createArticleRepo,
    updateArticleRepo,
    deleteArticleRepo,
} from "../repositories/articleRepository.js";

import { validateArticle } from "../utils/errors/ValidationErrors.js";

async function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => resolve(JSON.parse(body)));
        req.on("error", reject);
    });
}

// Récupérer tous les articles
export async function getAllArticles(req, res) {
    const articles = await getAllArticlesRepo();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(articles));
}

// Récupérer un article par ID
export async function getArticleById(req, res, id) {
    const article = await getArticleByIdRepo(id);
    if (!article) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Article not found" }));
        return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(article));
}

// Créer un nouvel article
export async function createArticle(req, res) {
    const { title, content, user_id } = await parseBody(req);

    const errors = validateArticle({ title, content });
    if (errors.length > 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ errors }));
        return;
    }

    const newArticle = await createArticleRepo(title, content, user_id);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newArticle));
}

// Mettre à jour un article existant
export async function updateArticle(req, res, id) {
    const { title, content } = await parseBody(req);

    const errors = validateArticle({ title, content });
    if (errors.length > 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ errors }));
        return;
    }

    const updatedArticle = await updateArticleRepo(id, title, content);
    if (!updatedArticle) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Article not found" }));
        return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(updatedArticle));
}

// Supprimer un article
export async function deleteArticle(req, res, id) {
    const success = await deleteArticleRepo(id);
    if (!success) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Article not found" }));
        return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Article deleted successfully" }));
}

// Récupérer les articles d’un utilisateur
export async function getArticlesByUserId(req, res, userId) {
    const articles = await getArticlesByUserIdRepo(userId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(articles));
}
