
Github-Data is an application for uploading, analyzing, and exporting data of Github users, particularly the user's particular skills.


### Features
- **Saving User Data**: A CSV file of Github users can be uploaded via a CSV file; the app will find each user's skills from using Github's API and save the data into the database. The CSV file should have this basic structure:

(*link file here*)

 - ..though the only necessary column is 'giturl'. If latitude and longitude data are given, the app will calculate and save the user's distance from the Liquid Talent office in New York (distance_from_lt).

- **Exporting User Data** In addition to (or instead of) saving the data into the database, the data can be exported as a new CSV file with the skills column (and possibly distance_from_lt filled out.)

- **Finding Matches** If a CSV of Github users and a CSV of Jobs are uploaded, a new CSV file can be exported that lists each jobs top matches (users with most skills in common with those on the job opening.) Elastic string matching is used for matching skills. The job CSV file must have a skills column with skills listed in this fashion:

(*link file here*)

- **Database** The runs on top of a postgreSQL database of roughly 150,000 Github users. The data saved into the database is authenticated for valid Github url and valid email. The data-structure and data-types can be seen in the User.js file in the apps root directory.

  - Sample query:
*Show the Email address and Github urls of  100 users that have both JavaScript and Ruby as skills:*

```sql
SELECT emails, giturl FROM users WHERE skills @> '{JavaScript, Ruby}'::text[] LIMIT 100;
```

### Note on API Limit
Gathering a user's skills requires a single request to Github's API. The rate limit for an authenticated user of the API is 5000 requests per hour. The current status of the app's rate limit can be retrieved by hitting the '/API/ratelimit' route.

#### Technologies Used:
- **Node-Express (with Morgan and Body-parser)**
- **PostgreSQL/ PG/ Sequelize**
- **Request-Promise**: Hitting Github API
- **json2csv / jQuery-csv**: CSV uploading and parsing
- **fs**: Creating CSV file for download
- **Node-Cron**: Cron job for initial data-scrape (not currently actively used by the app)
- **Natural**: Implementation of Jaro Winkler distance algorithm for inexact string matching

### To Do
- Searching Github for job matches
- Properly configure environmental variables for hosting on heroku
