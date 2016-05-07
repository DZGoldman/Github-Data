
Github-Data is an application for uploading, analyzing, and exporting data of Github users, particularly the user's particular skills.

### Features
- **Saving User Data**: A CSV file of Github users can be uploaded via a CSV file; the app will find each user's skills from using Github's API and save the data into the database. The CSV file should have this basic structure:

(*link file here*)

 - ..though the only necessary column is 'giturl'. If latitude and longitude data are given, the app will calculate and save the user's distance from the Liquid Talent office in New York (distance_from_lt).

- **Exporting User Data** In addition to (or instead of) saving the data into the database, the data can be exported as a new CSV file with the skills column (and possibly distance_from_lt filled out.)

- **Finding Matches** If a CSV of Github users and a CSV of Jobs are uploaded, a new CSV file can be exported that lists each jobs top matches (users with most skills in common with those on the job opening.) Elastic string matching is used for matching skills. The job CSV file must have a skills column with skills listed in this fashion:

(*link file here*)

- **Seaching Github** Github users can be found directly from Github's API based on programming language and location search parameters. The results are exported as a CSV file (included each User's skills) in the same format as shown above. A search will return a Maximum of 100 results; only users with a public email address are included.

- **Database** The runs on top of a postgreSQL database of roughly 150,000 Github users. The data saved into the database is authenticated for valid Github url and valid email. The data-structure and data-types can be seen in the User.js file in the apps root directory.

  - Sample query:
*Show the Email address and Github urls of  100 users that have JavaScript, Ruby, and Python as skills:*

```sql
SELECT email, giturl FROM github_users WHERE skills @> '{JavaScript, Ruby, Python}'::text[] LIMIT 100;
```
- Sample query:
*Show the username and programming languages (skills) and Github urls of  100 users within 20 miles of Liquid Talent's New York Office*

```sql
SELECT username, skills FROM github_users WHERE distance_from_lt<20 LIMIT 100;

```


### Installation Instructions
1. Clone repo
2. Enter root directory
3. In terminal, run:
```bash
npm install
```
and
```bash
bower install
```
4. Set environmental variables:
```
USERNAME = (your Github user-name)
PASSWORD = (your Github password)
PORT = (port)
DATABASE_URL = (database url)
APP_LOGIN = (Your login for this app)
APP_PASSWORD = (Your password for this app)
```
Note: If the app is being run locally, the environmental variables can be set by creating a .env file in the app's root directory.

5. To run app locally, run:
```bash
npm start
```

### Note on API Limit
Gathering a user's skills requires a single request to Github's API. The rate limit for an authenticated user of the API is 5000 requests per hour. The current status of the app's rate limit can be retrieved by hitting the '/API/ratelimit' route.

#### Technologies Used
##### Server Side:
- **Node-Express (with Morgan and Body-parser)**
- **PostgreSQL/ PG/ Sequelize**
- **Request-Promise**:  Github API requests
- **json2csv** CSV parsing
- **fs**: Creating CSV file creation
- **Node-Cron**: Cron job for initial data-scrape (not currently actively used by the app)
- **Natural**: Implementation of Jaro Winkler distance algorithm for inexact string matching
- **DotEnv**: Setting/getting environmental variables
- **Express-Session**: Login / authentication
- **ejs**: Templating

##### Client Side:
- **jQuery**
- **jQuery-csv**: CSV uploading and parsing
- **spin.js**: Loading icon


### Potential Add-Ons
- Front-end interface for retrieving records / exporting CSV from the database.
- "Job" table in database.

### To Do
- Get location and email data if blank (for saving into db)
- Push sanitized data to heroku
