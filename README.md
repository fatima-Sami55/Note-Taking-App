📓 Note-Taking App
==================

Welcome to the **Note-Taking App**! 🎉 This is a simple web application built with Node.js and MySQL, designed to allow users to create, edit, and delete notes. 📝

🌐 Check out the [Live Demo](https://note-taking-app-phi-ten.vercel.app)!

🛠️ Features
------------

*   **Create Notes:** Add new notes with a title and content. ✍️
*   **Edit Notes:** Modify the content of any existing note. ✏️
*   **Delete Notes:** Remove notes that are no longer needed. 🗑️
*   **Persistent Data:** Notes are saved in a MySQL database, so they are available even after restarting the app. 🔒
*   **Simple Interface:** A clean, user-friendly UI for managing your notes. 🎨

🧑‍💻 Technologies Used
-----------------------

*   **Node.js:** JavaScript runtime for building the backend. 🚀
*   **Express:** Web framework for Node.js to handle HTTP requests. 🌐
*   **MySQL:** Database to store user notes. 🗄️
*   **EJS:** Template engine to render dynamic HTML views. 🖥️
*   **Passport:** Authentication middleware for handling user login. 🔑
*   **Bcryptjs:** For securely hashing passwords. 🔒
*   **Connect-Flash:** For displaying flash messages (success, error, etc.). ⚡
*   **Dotenv:** For managing environment variables. ⚙️

📝 Installation
---------------

### Clone the Repository

1\. To get started, clone the repository to your local machine using the following command:

    git clone https://github.com/fatima-Sami55/Note-App.git

### Install Dependencies

2\. Navigate to the project directory and install the required dependencies using npm:

    cd Note-App
    npm install

### Configure the MySQL Database

3\. Make sure you have MySQL installed on your machine. 🖥️

4\. Create a database for the app. You can name it `note_app` or any name you prefer. 💾

5\. Set up your environment variables by creating a `.env` file in the root directory and add the following content (update with your own credentials):

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=note_app
    SESSION_SECRET=yourSecretKey

🚀 Run the Application
----------------------

Start the app by running:

    npm start

The app should now be running at [http://localhost:3000](http://localhost:3000) 🎉

Made with 🔥 by Fatima
