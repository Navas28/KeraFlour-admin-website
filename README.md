# 🖥️ KeraFlour Admin Dashboard

A premium, high-performance management console for the KeraFlour Mill ecosystem. Built with **Next.js & Tailwind CSS**, this dashboard provides deep control over products, pricing, and live internal operations.



## 🌟 Key Features

### 🎮 Central Control Center

- **Live Pulse Management**: Instantly toggle machine status (Free, Busy, Maintenance) which syncs to all mobile users in real-time via Socket.io.
- **Mill Availability**: One-click mill closure settings for holidays or maintenance.

### 📦 Dynamic Product Engine

- **Cloudinary Integration**: Upload high-quality product images directly.
- **Real-time Pricing**: Update milling charges and product prices that reflect instantly on the mobile application.

### 🛡️ Secure Infrastructure

- **JWT Protection**: Full admin authentication flow.
- **Responsive Layout**: Designed for tablets and desktops with a modern, clean glassmorphism aesthetic.

---

## 📸 Dashboard Preview

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner / React Hot Toast
- **API**: Axios with centralized configuration

---

## 🚀 Setup & Installation

1. Clone the repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.local`:
   - `NEXT_PUBLIC_API_URL`
4. Run development server:
   ```bash
   npm run dev
   ```

---

