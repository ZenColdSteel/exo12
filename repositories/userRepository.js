import { getDBConnection } from "../utils/db.js";

export async function getAllUsersRepo() {
    const db = await getDBConnection();
    return db.all("SELECT * FROM users");
}

export async function getUserByIdRepo(id) {
    const db = await getDBConnection();
    return db.get("SELECT * FROM users WHERE id = ?", [id]);
}

export async function createUserRepo(name, email) {
    const db = await getDBConnection();
    const result = await db.run(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email],
    );
    return { id: result.lastID, name, email };
}

export async function updateUserRepo(id, name, email) {
    const db = await getDBConnection();
    const result = await db.run(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, id],
    );
    if (result.changes === 0) return null;
    return { id, name, email };
}

export async function deleteUserRepo(id) {
    const db = await getDBConnection();
    const result = await db.run("DELETE FROM users WHERE id = ?", [id]);
    return result.changes > 0;
}
export async function getUserWithArticlesRepo(id) {
    const db = await getDBConnection();
    const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    if (!user) return null;

    const articles = await db.all("SELECT * FROM articles WHERE user_id = ?", [
        id,
    ]);
    return { ...user, articles };
}
