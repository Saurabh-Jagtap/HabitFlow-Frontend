# HabitFlow - Frontend 🎨

The modern, responsive user interface for **HabitFlow**, built to help users build and track good habits efficiently.

> **Looking for the Backend?** > Check out the [HabitFlow Backend Repository](https://github.com/Saurabh-Jagtap/HabitFlow-Backend.git) to see the API logic.

![App Screenshot](https://github.com/user-attachments/assets/4abd5e5e-c246-40eb-8977-ec039177eefe)
![Dashboard Screenshot](https://github.com/user-attachments/assets/badedfb4-565a-49d4-8cdc-6e34031829e9)

<details>
<summary>📸 Click to see more screenshots (Login, Settings, etc.)</summary>

![Register Screenshot](https://github.com/user-attachments/assets/086fc5f5-6055-406d-97f2-6bec80e96c04)
![Login Screenshot](https://github.com/user-attachments/assets/33f02391-5742-4943-ae54-90bab0ad0194)
![Habit Detail Screenshot](https://github.com/user-attachments/assets/ed37b64d-5bdf-4820-b866-7fb4e4a1f0bc)
![Settings Screenshot](https://github.com/user-attachments/assets/b945e2aa-6c8e-43e8-ba87-bfc4d129cdc6)
![Security Screenshot](https://github.com/user-attachments/assets/fed27954-5942-47c4-ae31-a783cf8292be)
![Forgot Password Screenshot](https://github.com/user-attachments/assets/fa05f32b-1a94-411c-ab40-08307b0135fc)
![Reset Password Screenshot](https://github.com/user-attachments/assets/e27c4ef4-9c4a-4136-afe3-9638c00c1ca2)
</details>

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
    git clone [https://github.com/Saurabh-Jagtap/HabitFlow-Frontend.git](https://github.com/Saurabh-Jagtap/HabitFlow-Frontend.git)
    cd HabitFlow-Frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    # Replace this with your actual deployed Backend URL
    NEXT_PUBLIC_BACKEND_URL=https://habitflow-backend-gf9f.onrender.com
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```bash
├── app/
│   ├── dashboard/          # Protected Habit Dashboard
│   ├── habits/
│   │   └── [id]/           # Dynamic Habit Details Page
│   ├── login/              # Login Page
│   ├── register/           # Register Page
│   ├── settings/           # Account Settings
│   ├── security/           # Security Settings
│   ├── forgotPassword/     # Password Recovery Flow
│   ├── resetPassword/      
        └── [token]/        # Dynamic Password Reset Page
│   ├── layout.js           # Main Root Layout
│   └── page.js             # Landing Page
├── components/             # Reusable UI Components
│   ├── AuthProvider/       # Authentication Context Wrapper
│   ├── ProtectedRoute/     # Route Guard (HOC)
│   ├── Navbar/             # Top Navigation
│   ├── Footer/             # Page Footer
│   ├── AvatarSection/      # User Profile Display
│   ├── LoadingSpinner/     # UI Loading States
│   ├── ProgressBar/        # Visual Habit Progress
│   └── Speedometer/        # Streak Visualization
└── utils/                  # Helper Functions & Hooks
    ├── axios/              # Axios Instance with Interceptors
    ├── emailValidation/    # Regex Validations
    ├── currentStreak/      # Streak Calculation Logic
    ├── longestStreak/      # Historical Data Logic
    ├── generateCalendar/   # Date Management
    └── useCooldown/        # Custom Timer Hook
```

## 🚀 Deployment

The application is deployed on Vercel and available for public access.

🔗 **Live Link:** [View Live Demo 🚀](https://habit-flow-frontend-delta.vercel.app)
