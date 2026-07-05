# 🍛🎉 Fooodle

> *Because standing in a canteen queue during a 10-minute break is not a personality trait anyone should have.* ⏳

Fooodle is a food ordering and token-management system built for a university canteen (**HUB**) 🍽️. It replaces the manual "stand in line, pay, wait, hope" routine with a digital menu, cart, and token system — so students and staff can order ahead, track prep time, and skip the queue entirely. 🚀

---

## 🎯 The Problem

Canteen ordering during peak hours usually means long queues, confusion, and no way to know when your food will actually be ready. There's no centralized way to manage multiple counters or orders — so everyone just waits and guesses. 🤷

Fooodle fixes that with a single web interface where users can browse 🔍, order 🛍️, and track 📍 — and admins can manage the whole counter digitally. 🧑‍💻

---

## 🍜 What it actually does

- 🔐 **Auth & Roles** — student/staff registration with email verification ✅, JWT sessions , and role-based access (user vs admin)
- 📋 **Centralized Menu** — browse dishes across multiple counters (South Indian , snacks , beverages ) from one screen, with live availability status 🟢🔴
- 🛒 **Smart Cart** — add ➕ / remove ➖ items with auto-calculated totals, GST , and delivery 
- 🎟️ **Digital Token Generation** — every order gets a unique pickup token with an estimated prep time ⏱️, no more manual queue slips
- 🧑‍🍳 **Admin Panel** — admins manage the daily menu and update item availability in real time ⚡
- 📦 **Order Tracking** — users can view order history, current status (🟡 Pending / ✅ Completed / ❌ Cancelled), and cancel orders
- 💳 **Checkout** — pickup time selection + Cash on Delivery , with a clean order summary 🧮

---

## 🧰 Tech Stack

| Layer | Tech |
|---|---|
| 🎨 Frontend | React, TypeScript, Vite |
| 💅 Styling | Tailwind CSS, shadcn-ui |
| ⚙️ Backend | Node.js, Express.js |
| 🗄️ Database | MongoDB (Mongoose ODM) |
| 🔒 Auth | JWT, bcrypt.js |
| 📡 HTTP Client | Axios |

**Architecture:** 🏗️ classic three-tier setup — React frontend talks to an Express REST API, which handles auth/business logic and reads/writes to MongoDB.

---

## 🔮 Future Enhancements

- 📲 SMS/push notifications when your token's ready 🔔
- 💳 Online payment integration (beyond COD) 💰
- 📊 Order analytics dashboard for admins 📈
- ⏱️ Smarter prep-time estimation based on live counter load 🧠

---

*Built to end canteen queue small talk forever.* 🍽️✌️
