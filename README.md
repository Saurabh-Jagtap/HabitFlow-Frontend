---

### 2. Frontend README (`HabitFlow-Frontend`)

```markdown
# HabitFlow - Frontend 🎨

The modern, responsive user interface for **HabitFlow**, built to help users build and track good habits efficiently.

![App Screenshot](https://via.placeholder.com/800x400?text=Upload+Your+App+Screenshot+Here)
*(Tip: Replace this link with a screenshot of your actual Dashboard!)*

## 🌟 Key Features

* **⚡ Next.js App Router:** Utilizing the latest Next.js features for server-side rendering and optimized routing.
* **🔒 Protected Routes:** Custom High-Order Components (HOC) to secure dashboard and settings pages from unauthorized access.
* **🎨 Responsive Design:** Mobile-first UI built with **Tailwind CSS** and DaisyUI components.
* **🚦 Smart Error Handling:** Real-time feedback and toast notifications for user actions (e.g., Rate limit warnings, Success messages).
* **🔄 Dynamic Dashboard:** Real-time state updates for habit tracking without page reloads.

## 🛠️ Tech Stack

* **Framework:** Next.js 13+
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **HTTP Client:** Axios (with Interceptors)
* **Deployment:** Vercel

## ⚙️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/HabitFlow-Frontend.git](https://github.com/your-username/HabitFlow-Frontend.git)
    cd HabitFlow-Frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_BACKEND_URL=[https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)
    ```

4.  **Run the development server:**
    ```bash
    npm run dev

├── app/ │ ├── (auth)/ # Login & Signup Routes │ ├── dashboard/ # Protected Habit Dashboard │ ├── layout.js # Main Root Layout │ └── page.js # Landing Page ├── components/ # Reusable UI Components ├── context/ # AuthProvider & Global State └── utils/ # Axios instance & Helpers

## 🚀 Deployment

Deployed live on **Vercel**: `https://habit-flow-frontend-delta.vercel.app`
    ```

## 📂 Project Structure
