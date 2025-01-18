# PartnersDAO 

A Node.js/TypeScript project that fetches tweets, stores them in MongoDB, updates user profiles, and periodically cleans old tweets.

## Features
- Scrapes tweets via [agent-twitter-client](https://www.npmjs.com/package/agent-twitter-client).
- Stores tweets in MongoDB, upserting by Twitter `id`.
- Automatically updates user profiles and increments an `eligibleTweetsCount`.
- Cleans old tweets if total documents exceed a specified maximum.
- Designed to run as a scheduled job (e.g. on GitHub Actions).

## Requirements
- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Twitter credentials** (username/password) for scraping

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/partnersDAO-dasbhoard-cron.git
   ```
2. Install dependencies:
   ```bash
   cd partnersDAO-dashboard-cron.git 
   npm install
   ```
   or
   ```bash
   yarn
   ```
3. Create a `.env` file at the project root with the following variables:
   ```env
   MONGODB_URI="your_mongo_connection_string"
   TWITTER_USERNAME="your_twitter_username"
   TWITTER_PASSWORD="your_twitter_password"
   LOG_LEVEL="info"
   ```

## Usage
1. **Local Run**:
   ```bash
   npm run start
   ```
    - This connects to your MongoDB, logs in to Twitter, fetches new tweets, updates the DB, and then closes connections.

2. **Production / CI**:
    - You can schedule this script to run periodically (e.g., every 20 minutes) on a CI/CD platform such as GitHub Actions or a cron job.
    - Each run opens a DB connection, fetches data, updates records, then cleanly exits.

## Project Structure
```
├─ .env
├─ package.json
├─ tsconfig.json
├─ /src
│   ├─ /config
│   │   └─ db.ts          # Database connection logic
│   ├─ /jobs
│   │   └─ fetchTweetsJob.ts
│   ├─ /models
│   │   ├─ tweet.model.ts # Mongoose schema for tweets
│   │   └─ user.model.ts  # Mongoose schema for users
│   ├─ /scraper
│   │   └─ twitterScraper.ts
│   ├─ /services
│   │   ├─ tweet.service.ts
│   │   └─ user.service.ts
│   ├─ /utils
│   │   └─ logger.ts      # Pino-based logger
│   └─ index.ts
```

## Key Scripts
- **`npm run start`**: Transpile and run the main script via `ts-node`.

## Customization
- **Tweet Deletion**: The max tweet count for cleanup is set to `10,000` in `fetchTweetsJob.ts`. Adjust as needed.
- **Logging**: Controlled by `LOG_LEVEL` in `.env`. The default is `"info"`. Use `"debug"` or `"trace"` for more verbose output.
- **Scraping**: Customize the search query in `fetchTweetsJob.ts` to fetch tweets for different keywords.

## Contributing
1. Fork this repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit and push your changes
4. Create a Pull Request

## License
[MIT](./LICENSE) (or whichever license you prefer)