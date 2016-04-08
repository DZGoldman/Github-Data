
Github-data is an application for uploading, analyzing, and exporting data of github users, particularly the user's particular skills.


### Functionality
- **Saving User Data**: A CSV file of github users can be uploaded via a CSV file; the app will find each user's skills (programming languages) and save the data into the database. The CSV file should have this basic structure:

(*link file here*)

 - ..though the only necessary column is 'giturl'. If latitude and longitude data are given, the app will calculate and save the user's distance from the Liquid Talent office in New York (distance_from_lt).

- **Exporting User Data** In addition to (or instead of) saving the data into the database, the data can be exported as a new CSV file with the skills column (and possibly distance_from_lt filled out.)

- **Finding Matches** If a CSV of github users and a CSV of Jobs are uploaded, a new CSV file can be exported that lists each jobs top matches (users with most skills in common with those on the job opening.) Elastic string matching is used for matching skills. The job CSV file must have a skills column with skills listed in this fashion:

(*link file here*)

- **Database** The runs on top of a postgresQL Database of roughly 150,000 Github users. The data saved into the database is authenticated for valid github url and valid email. The data-structure and data-types can be seen in the User.js file in the apps root directory.

  - Sample query:
*Show the Email address and github urls of  100 users that have both JavaScript and Ruby as skills:*

```sql
SELECT emails, giturl FROM users WHERE skills @> '{JavaScript, Ruby}'::text[] LIMIT 100;
```

###
Api Limit

#### Technologies Used:
- **Node-Express (with Morgan and body-parser)**
- **PostgreSQL/ Sequelize**
- **Request-Promise**
- **json2csv / jquery-csv**: CSV uploading and parsing
- **fs** Creating CSV file for download
- **Cron**: Cron job for initial data-scrape (not currently actively used by the app)
- **Natural**: Implementation of Jaro Winkler distance algorithm for inexact string matching
