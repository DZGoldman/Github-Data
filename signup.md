

### 1) Sign Up
  - Name
  - Email

### 2) Upload resume/Online Presence
  - User Uploads resume
  - Github handle
    - Scraped via email. User confirms that handle is correct, has option to change it.


### 3) Tell Us About Yourself
  - Role
    - Auto-select designer/developer based on User's skills
  - Years working
    - Give estimate based on timeline of git-commits and experience on resume
  - Top skills/ Other skills
    - Weighed by github
  - Education
    - Scrape from resume
  - Location
    - Scrape from resume/github
  - Type of work, hourly rate


### Other info Gathered for Approval
- Store git hub skills (to compare with user's claimed skills)
- timeline on github (from first commit to most recent, frequency?)
- Number of github repos

### additional considerations
- 2 Components: autofilling for user's ease, and verifying user's claims. Say their claims are contradicted by github - what then?
- Finding github by email has much lower api limit (30 per day? Check Lt's methods)
