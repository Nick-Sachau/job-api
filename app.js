// Enviroment setup
require('express-async-errors')
require('dotenv').config()

// App Cores
const express = require('express')
const app = express()
const connectdb = require('./db/connect')

// Extra Security
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')

// Routes
const jobsRouter = require('./routes/jobs')
const authRouter = require('./routes/auth')

// Middleware
const auth = require('./middleware/auth')
const { notFound, errorHandlerMiddleware } = require('./middleware')

// SwaggerUI
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./swagger.yaml')

// Variable declarations
const PORT = process.env.PORT || 3000
const minutes = 1000 * 60

app
  .set("trust proxy", 1)
  // rate limiter limits the amount of calls that an IP can make to your API
  .use(rateLimiter({
    windowMs: 15* minutes,
    max: 100 // limit each ip to 100 requests per window
  }))
  .use([express.urlencoded({ extended: false }), express.json()])
  .use(helmet())
  .use(cors())
  // user sanitation, this prevents SOME user based hacking
  .use(xss())

  .get('/', (req, res) => {
    res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>')
  })

  .use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc))

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