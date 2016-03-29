ToDo:


- fix sheet important so it doesn't double up
- set up route that,
for 5000 records where skills aren't found
take in url,
strips for username,
gets all users repos,
gets all languages,
sorts them,
updates user for skills and "skills found"
- restructure
- hourly chron job





Done:
- DONE Set up authenticaion
- DONE Configure pg database
- put on github in private repo


 - configure sequalize?

 - increase rate limit
 - Scraping emails from a google sheet
 - Public vs Private repos?- figure out location issue - done?
- refactor cattching errors


3/29
-Testing 5000 fetch; strange bug where the route gets recalled about scraping about 500 users; build a workaround (still don't understand the source of the problem, but it works; prevent route from being recalled until it's done scraping; so problem)
