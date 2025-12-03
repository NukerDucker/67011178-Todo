# Todo App

A simple full-stack Todo application with React frontend and Node.js/Express backend.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) (v8 or higher) — or use Docker
- [Docker](https://www.docker.com/) (optional, for database setup)
- npm (comes with Node.js)

## Project Structure

```
├── backend/          # Express API server
├── frontend/         # React application
├── db-setup/         # Database setup files & Docker Compose
├── .env.example      # Environment variables template
└── package.json      # Root package (npm workspaces)
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NukerDucker/67011178-Todo.git
cd 67011178-Todo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

#### Option A: Using Docker (Recommended)

Start MySQL and phpMyAdmin with Docker Compose:

```bash
docker-compose -f db-setup/db-compose-dev.yml up -d
```

This will start:
- **MySQL** on port `3306`
- **phpMyAdmin** on http://localhost:8080

Then import the schema via phpMyAdmin or run:

```bash
docker exec -i <mysql_container_name> mysql -uroot -pCEiAdmin0 ceidb < db-setup/todo.sql
```

To stop the containers:

```bash
docker-compose -f db-setup/db-compose-dev.yml down
```

#### Option B: Using local MySQL

1. Create a MySQL database named `ceidb`
2. Run the SQL script to create tables:

```bash
mysql -u root -p ceidb < db-setup/todo.sql
```

Or import `db-setup/todo.sql` using your MySQL client (e.g., MySQL Workbench).

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```
PORT=5001
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=ceidb
REACT_APP_API_URL=http://localhost:5001/api
```

### 5. Run the application

**Start the backend:**

```bash
npm --workspace=backend run start
```

**Start the frontend (in a new terminal):**

```bash
npm --workspace=frontend run start
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login with username |
| GET | `/api/todos/:username` | Get all todos for a user |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update todo status |
| DELETE | `/api/todos/:id` | Delete a todo |

## License

ISC
