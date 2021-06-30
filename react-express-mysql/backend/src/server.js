// simple node web server that displays hello world
// optimized for Docker image

const express = require("express");
// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.

const morgan = require("morgan");
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

const database = require("./database");

const crypto = require("crypto");

const moment = require("moment");

// Appi
const app = express();

app.use(morgan("common"));
app.get("/initializeDb/", function(req, res, next) {
  database.raw("SHOW TABLES FROM `example` LIKE 'Example';")
    .then(([rows, columns]) => {
      if(rows[0] !== undefined) {
        console.log("DB Table already exists, proceeding to resolve")
        return;
      }
      else {
        database.raw("CREATE TABLE example.Example (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(64) not null, Value varchar(64) not null)")
        .then(() => {
          console.log("Created new DB.  Enjoy!")
          res.send()
        })
        .catch();
      }
    })  
    .then(() => res.send())
    .catch((e) => { throw e; });
});

app.get("/createRow/", function(req, res, next) {
  const newID = crypto.randomBytes(16).toString("hex");
  const newName = moment().format();
  console.log(`Entering ${newName} ${newID} into database.`)
  database.raw(`INSERT INTO example.Example (Name, Value) VALUES ('${newName}', '${newID}')`)
    .then(() => {
      console.log("Inserted Successfully");
      res.send();
    })
    .catch((e) => { throw e; });
});

app.get("/getLastRow/", function(req, res, next) {
  database.raw('SELECT * FROM example.Example ORDER BY Id DESC LIMIT 1')
    .then(([rows, columns]) => rows[0])
    .then((row) => res.json({ message: `Last row inserted had Name: ${row.Name} and Value: ${row.Value}!` }))
    .catch(next)
});

app.get("/", function(req, res, next) {
  database.raw('select VERSION() version')
    .then(([rows, columns]) => rows[0])
    .then((row) => res.json({ message: `Hello from MySQL ${row.version}` }))
    .catch((e) => { throw e; });
});

app.get("/healthz", function(req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send("I am happy and healthy\n");
});

module.exports = app;
