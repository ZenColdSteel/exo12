import {
    getAllUsersRepo,
    getUserByIdRepo,
    createUserRepo,
    updateUserRepo,
    deleteUserRepo,
    getUserWithArticlesRepo,
} from "../repositories/userRepository.js";
import { validateEmail } from "../utils/errors/ValidationErrors.js";

async function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => resolve(JSON.parse(body)));
        req.on("error", reject);
    });
}

export async function getAllUsers(req, res) {
    const users = await getAllUsersRepo();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
}

export async function getUserById(req, res, id) {
    const user = await getUserByIdRepo(id);
    if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "User not found" }));
        return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
}

export async function createUser(req, res) {
    const { name, email } = await parseBody(req);

    if (!name || !email || !validateEmail(email)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid name or email" }));
        return;
    }

    const newUser = await createUserRepo(name, email);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
}

export async function updateUser(req, res, id) {
    const { name, email } = await parseBody(req);

    if (!name || !email || !validateEmail(email)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid name or email" }));
        return;
    }

    const updatedUser = await updateUserRepo(id, name, email);
    if (!updatedUser) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "User not found" }));
        return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(updatedUser));
}

export async function deleteUser(req, res, id) {
    const success = await deleteUserRepo(id);
    if (!success) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "User not found" }));
        return;
    }
    res.writeHead(200);
    res.end(JSON.stringify({ message: "User deleted successfully" }));
}
export async function getUserWithArticles(req, res, id) {
    try {
        // Récupérer l'utilisateur avec ses articles depuis le repository
        const userWithArticles = await getUserWithArticlesRepo(id);

        if (!userWithArticles) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "User not found" }));
            return;
        }

        // Si l'utilisateur est trouvé, on renvoie les données
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(userWithArticles));
    } catch (error) {
        console.error("Error fetching user with articles:", error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
}
