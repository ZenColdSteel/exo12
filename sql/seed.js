import { openDb } from "../utils/db.js";
import { logError } from "../utils/logger.js";

const schemaSQL = `
/* Supprime les anciennes tables */
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;

/* Crée la table des utilisateurs */
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* Crée la table des articles */
CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* Index pour optimiser les recherches */
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON articles(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;

const sampleUsers = [
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" },
];

const sampleArticles = [
    {
        title: "Premier article",
        content: "Contenu du premier article",
    },
    {
        title: "Deuxième article",
        content: "Contenu du deuxième article",
    },
    {
        title: "Troisième article",
        content: "Contenu du troisième article",
    },
];

async function seedDatabase() {
    try {
        const db = await openDb();

        // Crée les tables si elles n'existent pas
        await db.exec(schemaSQL);
        console.log("Database schema created successfully");

        // Supprime les données existantes
        await db.run("DELETE FROM articles");
        await db.run("DELETE FROM users");

        // Insère les utilisateurs de test
        for (const user of sampleUsers) {
            await db.run("INSERT INTO users (name, email) VALUES (?, ?)", [
                user.name,
                user.email,
            ]);
        }

        // Récupère un utilisateur pour associer les articles
        const user = await db.get("SELECT id FROM users LIMIT 1");
        if (!user) {
            throw new Error("No users found in the database");
        }

        // Insère les articles avec user_id
        for (const article of sampleArticles) {
            await db.run(
                "INSERT INTO articles (title, content, user_id) VALUES (?, ?, ?)",
                [article.title, article.content, user.id],
            );
        }

        console.log("Database seeded successfully");
        process.exit(0);
    } catch (error) {
        await logError(error);
        console.error("Error seeding database:", error.message);
        process.exit(1);
    }
}

seedDatabase();
