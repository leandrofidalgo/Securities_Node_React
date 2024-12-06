# Engine AI | Full Stack Exercise

## ⚠️ When we run the dockers the database docker take sometime to start so check if is already ready to work

This project implements a full-stack web application for displaying securities and their historical data over time. It is part of the **Engine AI Full Stack Developer Exercise**. The backend is powered by **Node.js** with **TypeScript** and a **PostgreSQL database**, while the frontend uses **ReactJS**, styled with **Material UI**, and includes data visualizations using **Highcharts**.

---

## 📋 Features

### Backend
- **Node.js/TypeScript** REST API or GraphQL:
  - **Security List Endpoint**: Fetches a list of securities with summary data.
  - **Security Detail Endpoint**: Fetches detailed information for a specific security, including daily time-series data.
- **PostgreSQL Database**:
  - Seeded with data from the provided `data.json` file that was created an python file to make a .sql that have all the INSERTS that is in the `data.json`.
  - Stores securities' metadata and their associated time-series data.

### Frontend
- **ReactJS Single Page Application**:
  - **Material UI** for styling.
  - **Highcharts** for interactive chart visualizations.
- **Screens**:
  1. **Security List**:
     - Displays a table with the following fields:
       - Symbol/Ticker
       - Name
       - Sector
       - Country
       - Trend
     - Background color for the **Trend** field:
       - **Red**: Trend value between -100 to -20.
       - **Green**: Trend value between -20 to 20.
       - **Blue**: Trend value between 20 to 100.
     - Clickable rows to navigate to the **Security Detail** screen.
  2. **Security Detail**:
     - Displays detailed information about a specific security:
       - Symbol
       - Name
       - Sector
       - Country
     - Includes a chart showing:
       - Close prices over time.
       - Volume over time.

---

## Paths and Routes

### Backend API Endpoints
- `GET /securities`: Retrieves a list of all securities.
- `GET /securities/:securityId`: Retrieves detailed data for a specific security.

### Frontend Routes
- `/`: Redirects to `/securities`.
- `/securities`: Displays the **Security List**.
- `/securities/:symbol`: Displays the **Security Detail**.

---

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16 or later)
- **Docker** and **Docker Compose**

### 🚀 Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/leandrofidalgo/Engine-AI-Code-Challenge.git
   cd Engine-AI-Code-Challenge

2. With docker:
   - Run the containers:
      ```bash
      docker-compose up -d --build
   
3. If necessary to run api and frontend locally instead of docker:
   - Run the api locally:
      ```bash
      cd api
      npm install
      npm start

   - Run the frontend locally:
      ```bash
      cd frontend
      npm install
      npm start

## 🛠️ Technologies Used
# Backend:
   - Node.js
   - TypeScript
   - PostgreSQL
   - REST API or GraphQL

# Frontend:
   - ReactJS
   - Material UI
   - Highcharts

# DevOps:
   - Docker

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
