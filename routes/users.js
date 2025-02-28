import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserWithArticles,
} from "../services/userService.js";

export async function handleUserRequest(req, res) {
    const parts = req.url.split("/").filter(Boolean);
    const id = parts.length > 1 ? parts[1] : null;
    try {
        if (req.method === "GET" && !id) {
            await getAllUsers(req, res);
        }
        if (req.method === "GET" && id && parts[2] === "articles") {
            await getUserWithArticles(req, res, id);
        } else if (req.method === "GET" && id) {
            await getUserById(req, res, id);
        } else if (req.method === "POST") {
            await createUser(req, res);
        } else if (req.method === "PUT" && id) {
            await updateUser(req, res, id);
        } else if (req.method === "DELETE" && id) {
            await deleteUser(req, res, id);
        }
    } catch (error) {
        console.error("Error handling article request:", error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
}
