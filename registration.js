// Function to add a new publication to the database
function addPublication(title, author, genre, publication_date) {
  const publicationData = {
    title: title,
    author: author,
    genre: genre,
    publication_date: publication_date,
  };

  fetch("http://127.0.0.1:3000/publications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(publicationData),
  })
    .then((response) => {
      console.log("Response: ", response);
      if (!response.ok) {
        throw new Error("Error creating publication: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const createdPublication = data.publication;
      console.log("Publication created successfully:", createdPublication);

      // Handle the created publication data
    })
    .catch((error) => {
      console.error("Error creating publication:", error);
    });
}

window.addEventListener("load", function () {
  document.getElementById("button").addEventListener("click", function (e) {
    e.preventDefault();
    var title = document.getElementById("title").value;
    var author = document.getElementById("author").value;
    var genre = document.getElementById("genre").value;
    var publication_date = document.getElementById("publication_date").value;

    addPublication(title, author, genre, publication_date);
  });
});
