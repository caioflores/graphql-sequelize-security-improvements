## Description
This project was created to test some security improvements using GraphQL and Sequelize. The first goal is to prevent accidental requests getting data from other users without permission.

## Setup

Clone project

```sh
git clone git@github.com:caioflores/graphql-sequelize-security-improvements.git
```

Install dependecies

```sh
yarn
```

Go to http://localhost:3000, create two different users, create tasks for each user, try to request tasks from one user with another one's authentication token.

## Checklist

[x] Test a auth middleware with private and public methods.
[x] Create a hasPermission function to filter data by users id, to fetch only data that is avaiable to a user.
[ ] Test hasPermission with more use cases.  
[ ] Create a way to apply Row Level Security with Sequelize.