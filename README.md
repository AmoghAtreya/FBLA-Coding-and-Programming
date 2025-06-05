# Capitex

## Overview
Capitex is a web application developed for the FBLA Coding and Programming event. Built using **React**, **Supabase**, and **TSX**, Capitex provides a secure and user-friendly platform for managing digital transactions and financial interactions. This project showcases modern web development practices, including responsive design, secure backend integration, and a seamless user experience.

## Features
- **User Authentication**: Secure sign-up, login, and logout functionality powered by Supabase Auth.
- **Transaction Management**: Create, view, and manage transactions with real-time updates.
- **User Dashboard**: Personalized dashboard for tracking account activity and balances.
- **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.
- **Type-Safe Development**: Built with TypeScript for enhanced code reliability and maintainability.

## Tech Stack
- **Frontend**: React, TSX, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Realtime)
- **Language**: TypeScript
- **Hosting**: Deployed via [Vercel/Netlify/Other Platform] (replace with actual hosting platform)

## Installation
To run Capitex locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/projectname
   cd capitex
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   Replace `your-supabase-project-url` and `your-supabase-anon-key` with your Supabase project credentials.

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Usage
- **Sign Up/Login**: Create an account or log in using the authentication interface.
- **Dashboard**: View your account balance and recent transactions.
- **Send/Receive Funds**: Use the transaction form to send or request funds securely.
- **Profile Management**: Update user information and manage account settings.

## Project Structure
```
capitex/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/              # Page components (e.g., Home, Dashboard, Transactions)
│   ├── supabase/           # Supabase client configuration and queries
│   ├── styles/             # Tailwind CSS and custom styles
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
├── README.md               # This file
```

## Supabase Setup
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Set up the following tables in your Supabase database:
   - `users`: Stores user information (id, email, etc.).
   - `transactions`: Stores transaction details (sender_id, receiver_id, amount, timestamp).
3. Enable Realtime for the `transactions` table to support live updates.
4. Configure Supabase Authentication with email/password and/or OAuth providers.

## Contributing
This project was developed for the FBLA Coding and Programming event. Contributions are welcome for educational purposes! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Built for the FBLA Coding and Programming event.
- Thanks to the React, Supabase, and Tailwind CSS communities for their excellent documentation and tools.
