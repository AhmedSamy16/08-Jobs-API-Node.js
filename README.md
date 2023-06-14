# 08-Jobs-API-Node.js

This project 8/50 of my Node.js project series. 

It's a jobs API that includes authentication, error handling globally and query selection.

## Auth

POST /users/signup will create a user and hash the password if it follows all the validations in the User Schema.

POST /users/login will log in the user if it exists in the DB and the email and password are valid.

## Jobs

GET /jobs/ will return the first 20 jobs for the logged in user and you can filter, sort, limit fields and paginate in the query added to the link.

GET /jobs/:id will return the job with that id if it exists for the logged in user.

POST /jobs/ will create a job for the logged in user and save to DB if it follows all validations in the Job Schema.

PATCH /jobs/:id will update the job with that id if it's owned by the logged in user and it follows all validations in the Job Schema.

DELETE /jobs/:id will delete the job with that id if it's owned by the logged in user.

## Errors

The project handles all Invalid id errors, duplicate key errors, not found errors, validation errors, token expired errors and JWT errors globally in one handler.

## Topics covered

Node.js, Express.js, Mongoose, JWT
