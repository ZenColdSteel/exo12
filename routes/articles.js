import {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticlesByUserId,
} from "../services/articleService.js";

export async function handleArticleRequest(req, res) {
    const urlParts = req.url.split("/").filter(Boolean);
    const id = urlParts.length > 1 ? urlParts[1] : null;
    const userId = urlParts.length > 2 ? urlParts[2] : null;

    try {
        if (req.method === "GET" && !id) {
            // Récupérer tous les articles
            await getAllArticles(req, res);
        } else if (req.method === "GET" && id && !userId) {
            // Récupérer un article par ID
            await getArticleById(req, res, id);
        } else if (req.method === "GET" && !id && userId) {
            // Récupérer les articles d'un utilisateur par user_id
            await getArticlesByUserId(req, res, userId);
        } else if (req.method === "POST") {
            // Créer un article
            await createArticle(req, res);
        } else if (req.method === "PUT" && id) {
            // Mettre à jour un article
            await updateArticle(req, res, id);
        } else if (req.method === "DELETE" && id) {
            // Supprimer un article
            await deleteArticle(req, res, id);
        } else {
            res.writeHead(400);
            res.end(JSON.stringify({ error: "Invalid request" }));
        }
    } catch (error) {
        console.error("Error handling article request:", error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
}
