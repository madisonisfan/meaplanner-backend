# meaplanner-node-express-mongodb

In 2020 I particapted in Nucamp's Full-Stack Bootcamp. In the second course, we created dynamic web applications with React, and in the last phase, we were taught how to develop a backend with NodeJS.

This server was created as the backend of my MealPlanner React application. At the end of the course, I connected the Meal Planner React web app to the Mealplanner server. 

# Table Of Contents
- [Project Confusion](#project-confusion)
- [Data Stored ](#data-stored)
- [Technologies](#technologies)

<!-- - [Available Scripts](#available-scripts) --> 

## Data Stored
- users: Because users can log in with Facebook, their first name, last name, and Facebook id are stored. 
- recipes: all recipes added by myself (admin) and other users are stored, including data such as recipe name, ingredients, instructions, cook time, prep time, calories, servings, creation date, creator, and an image URL 
- posts: All posts added by myself (admin) and other users are stored, including data such as post content, post type (ex: a question), creator, and creation date
- comments: All comments made on posts are stored, including data such as the comment content, date, creator, and id of the post the comment was made on
<! --  All users can edit (put), add(post), and delete, their own recipes. The admin can apply edit, add, delete any recipes they want. -->

## Technologies 
It has not been updated since 2021, so there might be a few bugs. 

- Node.js
- Express
- Passport 
- Mongoose 
- CORS
- cookie-parser
- Mongoose 
- Morgan 
- Multer 
- JSON Web Token 

## Project Confusion
Why are there so many repositories: 
- The bootcamp was separated into 4 courses. The 2nd was React, and the last was Backend. 
- In the React course, I created a Meal Planner React app that is not integrated with a server. 
- In the backend course, I created this Meal Planner server that is not integrated with a React app (this file)
- As an extra, we were taught to integrate a React app with a server. But to do so, we created separate projects which were copies of our react app and server, but with a few new additions.
## Links to Similar Repositories
- [View Meal Planner React web app not integrated with this server](https://github.com/madisonisfan/mealplanner-react)
- [View Meal Planner React web app edited to be integrated with Meal Planner server](https://github.com/madisonisfan/meaplanner-react-integration)
- [View Meal Planner server edited to be integrated with Meal Planner web app](https://github.com/madisonisfan/meaplanner-server-integration)



