const express = require('express')
const router = express.Router()

router.get('/test', (req, resp) => {
  console.log('Get request recieved')
  resp.status(200).send({
    greeting: "Hi"
  })
})

module.exports = router;
