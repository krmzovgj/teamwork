<!-- prettier-ignore-start -->
<div align="center">

# 💬 Teamwork — Real‑Time Chat App

<img alt="Teamwork banner" src="https://img.shields.io/badge/Express-5.1.0-black?logo=express"> 
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript">
<img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma">
<img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white">
<img alt="Socket.io" src="https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socketdotio">
<img alt="Node.js" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white">

<p><b>Slack‑style team collaboration backend</b> with workspaces, channels, auth, and real‑time chat.</p>

[🧪 Postman Collection](./Teamwork.postman_collection.json) • [⚙️ Prisma Schema](#-prisma-schema-core) • [⚡ Socket Events](#-socketio-events)

</div>
<!-- prettier-ignore-end -->

---

## 📚 Table of Contents
- [Tech Stack](#-tech-stack)
- [Setup](#-setup)
- [REST API (from Postman)](#-rest-api-from-postman)
- [Socket.io Events](#-socketio-events)
- [Prisma Schema (core)](#-prisma-schema-core)
- [Postman Collection](#-postman-collection)
- [Author](#-author)

---

## 🧩 Tech Stack

| Layer | Technology |
|------:|:----------|
| Backend | **Express 5** (TypeScript) |
| Database | **PostgreSQL** |
| ORM | **Prisma** |
| Auth | **JWT** + **bcryptjs** |
| Realtime | **Socket.io** |
| DX | `tsx`, `typescript` |

> Minimal, fast, and type‑safe foundation for a production chat backend.

---

## ⚙️ Setup

> Works with **npm**, **pnpm**, or **yarn**. Examples below use **npm**.

### 1) Install
```bash
npm install
```

### 2) Environment
Create a `.env` file:

```dotenv
DATABASE_URL="postgresql://postgres:admin@localhost:5432/teamwork"
PORT=8080
JWT_SECRET="change_me"
NODE_ENV="development"
```

### 3) Database & Prisma
```bash
npx prisma generate
npx prisma migrate dev
```

### 4) Run
```bash
npm run dev
# build:  npm run build
# start:  npm start
```

Server: **http://localhost:8080**

---

## 🧾 REST API (from Postman)

> ✅ All routes below are parsed from your Postman collection and corrected for typos.

### 📁 Auth
| Method | Path | Name |
|---|---|---|
| `POST` | `/auth/create-account` | Create Account |
| `POST` | `/auth/sign-in` | Sign In |

### 📁 Channel
| Method | Path | Name |
|---|---|---|
| `POST` | `/channel/:workspaceId` | Create Channel |
| `GET` | `/channel/:id` | Get Channel By Id |
| `PATCH` | `/channel/:id` | Update Channel |
| `DELETE` | `/channel/:id` | Delete Channel |

### 📁 Message
| Method | Path | Name |
|---|---|---|
| `POST` | `/message/:channelId` | Create Message |
| `PUT` | `/message/:id` | Update Message |
| `DELETE` | `/message/:id` | Delete Message |

### 📁 User
| Method | Path | Name |
|---|---|---|
| `PUT` | `/user/:id` | Update User |
| `GET` | `/user/:id` | Get User |
| `DELETE` | `/user/:id` | Delete User |

### 📁 Workspace
| Method | Path | Name |
|---|---|---|
| `POST` | `/workspace` | Create Workspace |
| `GET` | `/workspace/:id` | Get Workspace By Id |
| `PATCH` | `/workspace/:id` | Update Workspace |
| `PATCH` | `/workspace/join/:inviteCode` | Join Workspace |
| `PATCH` | `/workspace/leave/:id` | Leave Workspace |
| `DELETE` | `/workspace/:id` | Delete Workspace |

> 📝 Tip: After signing in, add the JWT as a **Bearer token** in Postman for all protected routes.

---

## ⚡ Socket.io Events

These match your Socket client console events.

| Event | Direction | Description |
|---|---|---|
| `register` | Client → Server | Identify/authenticate socket (e.g. user id/JWT). |
| `workspaceCreated` | Server → Client | A new workspace was created. |
| `userJoined` | Server → Client | User joined a workspace or channel. |
| `userLeft` | Server → Client | User left a workspace or channel. |
| `channelCreated` | Server → Client | New channel created. |
| `channelUpdated` | Server → Client | Channel renamed/updated. |
| `channelDeleted` | Server → Client | Channel deleted. |
| `newMessage` | Server → Client | New message created. |
| `messageUpdated` | Server → Client | Message edited. |
| `messageDeleted` | Server → Client | Message deleted. |

**Client Example**
```ts
import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  auth: { token: "YOUR_JWT" },
});

socket.on("connect", () => console.log("✅ connected", socket.id));
socket.emit("register", { id: 123 });
socket.emit("channel:join", { channelId: 1 });

socket.on("newMessage", (msg) => console.log("💬", msg));
```

---

## 🧱 Prisma Schema (core)

```prisma
model User {
  id          Int        @id @default(autoincrement())
  firstName   String
  lastName    String
  email       String     @unique
  password    String
  workspaceId String? // null = not in workspace
  workspace   Workspace? @relation(fields: [workspaceId], references: [id])
  role        UserRole   @default(MEMBER)
  messages    Message[]
}

model Workspace {
  id         String    @id @default(uuid())
  name       String
  inviteCode String    @unique
  users      User[]
  channels   Channel[]
  createdAt  DateTime  @default(now())
}

model Channel {
  id          Int       @id @default(autoincrement())
  name        String
  messages    Message[]
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
}

model Message {
  id        Int      @id @default(autoincrement())
  content   String
  userId    Int
  User      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  channelId Int
  Channel   Channel  @relation(fields: [channelId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  MEMBER
  ADMIN
  OWNER
}
```

---

## 🧪 Postman Collection

Import **Teamwork.postman_collection.json** in Postman:  
**Postman → Import → File → Select JSON**

---

## 👨‍💻 Author

**Gjorgi Krmzov**  
📧 krmzovgj@gmail.com

---

> 🧡 Built with Express, TypeScript, Prisma, PostgreSQL & Socket.io
