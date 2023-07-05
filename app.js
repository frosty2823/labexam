const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "asdasdasd123!!",
  database: "registration_database",
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database as ID: " + connection.threadId);

  // Create the registration_database database if it doesn't exist
  connection.query(
    "CREATE DATABASE IF NOT EXISTS registration_database",
    (err) => {
      if (err) {
        console.error("Error creating database: " + err.stack);
        return;
      }
      console.log("Database 'registration_database' created successfully");

      // Use the registration_database
      connection.query("USE registration_database", (err) => {
        if (err) {
          console.error("Error selecting database: " + err.stack);
          return;
        }
        console.log("Using database 'registration_database'");

        // Check if the register table exists
        const checkTableQuery = `
        SELECT COUNT(*) AS count
        FROM information_schema.tables
        WHERE table_schema = 'registration_database'
        AND table_name = 'register'
      `;

        connection.query(checkTableQuery, (err, result) => {
          if (err) {
            console.error("Error checking table: " + err.stack);
            return;
          }

          const tableExists = result[0].count === 1;

          if (!tableExists) {
            // Create the register table
            const createTableQuery = `
            CREATE TABLE register (
              id INT AUTO_INCREMENT PRIMARY KEY,
              title VARCHAR(255) NOT NULL,
              author VARCHAR(255) NOT NULL,
              genre VARCHAR(255) NOT NULL,
              publication_date DATE NOT NULL
            )
          `;

            connection.query(createTableQuery, (err) => {
              if (err) {
                console.error("Error creating table: " + err.stack);
                return;
              }
              console.log("Table 'register' created successfully");
            });
          } else {
            console.log("Table 'register' already exists");
          }
        });
      });
    }
  );
});

// Route to create a new publication
app.post("/publications", (req, res) => {
  const { title, author, genre, publication_date } = req.body;

  // Insert the new publication into the register table
  const insertQuery = `
      INSERT INTO register (title, author, genre, publication_date)
      VALUES (?, ?, ?, ?)
    `;

  connection.query(
    insertQuery,
    [title, author, genre, publication_date],
    (err, result) => {
      if (err) {
        console.error("Error creating publication: " + err.stack);
        return res.status(500).json({ message: "Internal server error" });
      }

      console.log("Publication created successfully");

      // Return the created publication
      const createdPublication = {
        id: result.insertId,
        title: title,
        author: author,
        genre: genre,
        publication_date: publication_date,
      };

      res.status(201).json({ publication: createdPublication });
    }
  );
});

// Route to retrieve all publications
app.get("/publications", (req, res) => {
  // Retrieve all publications from the register table
  const selectQuery = "SELECT * FROM register";

  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error retrieving publications: " + err.stack);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.json(results);
  });
});

// Route to delete a publication
app.delete("/publications/:id", (req, res) => {
  const publicationId = req.params.id;

  // Delete the publication from the register table
  const deleteQuery = "DELETE FROM register WHERE id = ?";

  connection.query(deleteQuery, [publicationId], (err, result) => {
    if (err) {
      console.error("Error deleting publication: " + err.stack);
      return res.status(500).json({ message: "Internal server error" });
    }

    console.log("Publication deleted successfully");

    res.sendStatus(204);
  });
});

app.put("/publications/:id", (req, res) => {
  const publicationId = req.params.id;
  const { title, author, genre, publication_date } = req.body;

  // Update the publication in the register table
  const updateQuery =
    "UPDATE register SET title = ?, author = ?, genre = ?, publication_date = ? WHERE id = ?";

  connection.query(
    updateQuery,
    [title, author, genre, publication_date, publicationId],
    (err, result) => {
      if (err) {
        console.error("Error updating publication: " + err.stack);
        return res.status(500).json({ message: "Internal server error" });
      }

      console.log("Publication updated successfully");

      res.sendStatus(204);
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
