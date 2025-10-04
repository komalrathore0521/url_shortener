# URL Shortener

<div align="center">
  <a href="https://brilliant-nougat-c446f0.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Launch_Demo-007BFF?style=for-the-badge&logo=rocket&logoColor=white" alt="Live Demo">
  </a>
</div>

<br>

A full-stack URL shortening service built with a Spring Boot backend and a React frontend with TypeScript.

## 📜 Description

This project provides a simple and efficient way to shorten long URLs, making them easier to share and manage. It includes advanced features like custom aliases, link expiration, click tracking, and link management. The backend is powered by Spring Boot, offering a robust and scalable API, while the frontend is a modern, responsive single-page application built with React and TypeScript.

## ✨ Features

* **Shorten Long URLs:** Convert long, cumbersome URLs into short and easy-to-share links.
* **Custom Alias:** Users can provide an optional custom alias for their shortened links for better branding and readability.
* **Link Expiration:** Set an optional expiration date for any shortened link, after which it will become inactive.
* **Click Count Tracking:** Automatically counts and displays the number of times each shortened link has been clicked.
* **Link Management Dashboard:**
    * View all created links in one place.
    * Delete links that are no longer needed.
    * Filter links based on their status: `Active`, `Expired`, `Expiring Soon`, and `All Links`.
* **Redirection:** Shortened links will seamlessly redirect to the original destination URL.
* **Responsive UI:** A clean and user-friendly interface that works on all devices.

## 🛠️ Tech Stack

### Backend

* **Java**
* **Spring Boot**
* **Spring Data JPA**
* **PostgreSQL** (hosted on [Neon Cloud](https://neon.tech/))
* **Maven**

### Frontend

* **React**
* **TypeScript**
* **CSS**
* **npm**

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:

* **Java Development Kit (JDK) 11 or later**
* **Maven**
* **Node.js and npm**

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/komalrathore0521/url_shortener.git](https://github.com/komalrathore0521/url_shortener.git)
    cd url_shortener
    ```

2.  **Set up the Backend (Spring Boot):**

    * Navigate to the backend directory (assuming it's named `backend` or similar):

        ```bash
        cd backend
        ```

    * **Configure the database connection:**
        You will need to create an `application.properties` file inside the `src/main/resources` directory. Add your PostgreSQL connection details from Neon Cloud to this file. It should look something like this:

        ```properties
        # PostgreSQL Database Configuration
        spring.datasource.url=jdbc:postgresql://<your-neon-host>/<your-db-name>
        spring.datasource.username=<your-username>
        spring.datasource.password=<your-password>
        spring.jpa.hibernate.ddl-auto=update
        spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
        ```

    * Build the project using Maven:

        ```bash
        mvn clean install
        ```

    * Run the Spring Boot application:

        ```bash
        mvn spring-boot:run
        ```

    The backend server will start on `http://localhost:8080`.

3.  **Set up the Frontend (React):**

    * Open a new terminal and navigate to the frontend directory (assuming it's named `frontend` or similar):

        ```bash
        cd frontend
        ```

    * Install the dependencies:

        ```bash
        npm install
        ```

    * Start the React development server:

        ```bash
        npm start
        ```

    The frontend will be available at `http://localhost:3000`.

## Usage

Once both the backend and frontend are running, open your browser and navigate to `http://localhost:3000`. You can use the interface to shorten URLs, set custom aliases and expiration dates, and manage your links from the dashboard.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
