# Weather Monitoring System

A real-time data processing system to monitor weather conditions and provide
summarized insights using rollups and aggregates. The system will utilize data from the
OpenWeatherMap API (https://openweathermap.org/).

## Installation

Follow these steps to set up the application locally:

### Backend Setup

1. **Change Directory to Server:**

   ```bash
   cd server
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Create Environment Configuration:**

   Create a `.env` file in the server directory using the sample provided below:

   ```
   MONGODB_URL="your_database_url"
   OPENWEATHER_API_KEY="your_api_key"
   PORT=5000
   EMAIL_USER="your_ethereal_email"
   EMAIL_PASS="your_ethereal_pass"
   ALERT_EMAIL="reciever_email"
   ```

4. **Start the Backend Server:**

   ```bash
   npm run start
   ```

### Frontend Setup

1. **Change Directory to Client:**

   ```bash
   cd client
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the Frontend:**

   ```bash
   npm run dev
   ```

## Usage

Once both the backend and frontend servers are running, you can access the application in your browser at `http://localhost:5173`.
