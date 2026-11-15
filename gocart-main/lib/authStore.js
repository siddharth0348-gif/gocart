// In-memory persistent state for users, stores, and tokens
let users = [
    {
        id: 1,
        name: "Platform Admin",
        email: "admin@gocart.com",
        password: "admin123",
        role: "ROLE_ADMIN",
    },
    {
        id: 2,
        name: "Tech Zone Vendor",
        email: "vendor@gocart.com",
        password: "vendor123",
        role: "ROLE_VENDOR",
    },
    {
        id: 3,
        name: "John Doe",
        email: "customer@gocart.com",
        password: "customer123",
        role: "ROLE_CUSTOMER",
    }
];

let stores = [
    {
        id: 1,
        name: "TechZone Official",
        username: "techzone",
        description: "Premier audio, gadgets, and consumer electronics provider.",
        email: "contact@techzone.com",
        contact: "+1-234-567-8900",
        status: "APPROVED",
        ownerId: 2,
    }
];

export function findUserByEmail(email) {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function registerUser({ name, email, password, role }) {
    const existing = findUserByEmail(email);
    if (existing) {
        throw new Error("Email is already registered");
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: role || "ROLE_CUSTOMER",
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    return newUser;
}

export function authenticateUser(email, password) {
    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
        throw new Error("Invalid email or password");
    }

    // Generate token string
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role, time: Date.now() })).toString('base64');

    return {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}

export function createStore({ name, username, description, email, contact, userId }) {
    const newStore = {
        id: Date.now(),
        name,
        username,
        description,
        email,
        contact,
        status: "PENDING",
        ownerId: userId,
        createdAt: new Date().toISOString(),
    };

    stores.push(newStore);
    return newStore;
}
