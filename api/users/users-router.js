const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model')
const Posts = require('./../posts/posts-model')
// The middleware functions also need to be required
const mw = require("./../middleware/middleware")

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(500).json({message: "could not fetch all users"})
    })
});

router.get('/:id', mw.validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.userId)
});

router.post('/', mw.validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json(err.message)
  })
});

router.put('/:id', mw.validateUserId, mw.validateUser, async (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params
  const changes = req.body
  try {
      const updatedUser = await Users.update(id, changes)
      if(!updatedUser){
        res.status(404).json({message: "user could not be updated"})
      } else {
        res.status(200).json(updatedUser)
      }
  } catch(err){
    res.status(500).json({ message: "The user information could not be modified" })

  }
});

router.delete('/:id', mw.validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    const { id } = req.params
    const deletedUser = await Users.remove(id)
    if(!deletedUser){
      res.status(404).json({message: "The user with the specified id does not exist"})
    } else {
      res.status(201).json(deletedUser)
    }
  } catch(err){
    res.status(500).json({ message: "The user could not be removed"})
  }
});

router.get('/:id/posts', mw.validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params
  Posts.getById(id)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    res.status(500).json({message: "could not get post with the specified id"})
  })
});

router.post('/:id/posts', mw.validateUserId, mw.validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const postInfo = {...req.body, user_id: req.params.id }
  Posts.insert(postInfo)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    res.status(500).json({message: "post could not be created"})
  })
});

// do not forget to export the router
module.exports = router
