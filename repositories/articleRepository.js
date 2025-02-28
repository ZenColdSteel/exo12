import { getDBConnection } from "../utils/db.js";

export async function getAllArticlesRepo() {
    const db = await getDBConnection();
    return db.all("SELECT * FROM articles");
}

export async function getArticleByIdRepo(id) {
    const db = await getDBConnection();
    return db.get("SELECT * FROM articles WHERE id = ?", [id]);
}

export async function getArticlesByUserIdRepo(userId) {
    const db = await getDBConnection();
    return db.all("SELECT * FROM articles WHERE user_id = ?", [userId]);
}

export async function createArticleRepo(title, content, userId) {
    const db = await getDBConnection();
    const result = await db.run(
        "INSERT INTO articles (title, content, user_id) VALUES (?, ?, ?)",
        [title, content, userId],
    );
    return { id: result.lastID, title, content, user_id: userId };
}

export async function updateArticleRepo(id, title, content) {
    const db = await getDBConnection();
    const result = await db.run(
        "UPDATE articles SET title = ?, content = ? WHERE id = ?",
        [title, content, id],
    );
    if (result.changes === 0) return null;
    return { id, title, content };
}

export async function deleteArticleRepo(id) {
    const db = await getDBConnection();
    const result = await db.run("DELETE FROM articles WHERE id = ?", [id]);
    return result.changes > 0;
}
