import express from "express"
import bodyParser from "body-parser"
import {dirname} from "path"
import {fileURLToPath} from "url"
import "dotenv/config"
import client from "@mailchimp/mailchimp_marketing"

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const api = process.env.API
const id = process.env.ID

// Home Route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/main.html")
})
// Post Request
app.post("/", (req, res) => {
  const {fName, lName, email} = req.body

  // API Post Call

  client.setConfig({
    apiKey: api,
    server: "us21",
  })

  const run = async () => {
    try {
      const response = await client.lists.addListMember(id, {
        email_address: email.toLowerCase(),
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      })

      res.sendFile(__dirname + "/success.html")
      console.log(response.status)
    } catch (error) {
      res.sendFile(__dirname + "/error.html")
    }
  }
  run()
})
// Redirect

app.post("/error", (req, res) => {
  res.redirect("/")
})

// Server Port

app.listen(process.env.PORT || 3000, () => {
  console.log("Port Started on a 3000")
})
