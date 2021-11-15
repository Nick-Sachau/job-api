const express = require('express')
const connectdb = require('./db/connect')
const app = express()
require('dotenv').config()
require('express-async-errors')
const { notFound, errorHandlerMiddleware } = require('./middleware')
const jobsRouter = require('./routes/jobs')
const authRouter = require('./routes/auth')

// security libs

const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')

const auth = require('./middleware/auth')

const PORT = process.env.PORT || 3000

app
  .set("trust proxy", 1)
  // rate limiter limits the amount of calls that an IP can make to your API
  .use(rateLimiter({
    windowMs: 1000 * 60 * 15, // 15 mintues
    max: 100 // limit each ip to 100 requests per window
  }))
  .use([express.urlencoded({ extended: false }), express.json()])
  .use(helmet())
  .use(cors())
  // user sanitation, this prevents SOME user based hacking
  .use(xss())
  // .use(express.static("./public"))

  .use('/api/v1/jobs', auth, jobsRouter)
  .use('/api/v1/auth', authRouter)
  
  .use(notFound)
  .use(errorHandlerMiddleware)

const start = async() => {
  try {
    await connectdb(process.env.MONGO_URL)
    app.listen(PORT, () => {
      console.log(`listening at ${PORT}`);
    })
  } catch(err) {
    console.log(err);
  }
}

start()