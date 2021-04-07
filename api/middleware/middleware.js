const Users = require("./../users/users-model")

function logger(req, res, next) {
  // DO YOUR MAGIC
}

const validateUserId = async (req, res, next) => {
  // DO YOUR MAGIC
  const { id } = req.params
  try {
    const userId = await Users.getById(id)
    if(!userId){
      res.status(404).json(`No user with the ID: ${id}`)
    } else {
      req.userId = userId
      next()
    }
  } catch(err){
    res.status(500).json(err.message)
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.name){
    res.status(400).json({ message: "missing required name field" })
  } else{
    next()
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.text){
    res.status(400).json({ message: "missing required text field" })
  } else{
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}
