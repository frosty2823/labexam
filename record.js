document.addEventListener("DOMContentLoaded", () => {
  // Function to format the date and remove the time
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Function to fetch publications from the server
  function fetchPublications() {
    fetch("http://localhost:3000/publications")
      .then((response) => response.json())
      .then((data) => {
        const publicationTableBody = document.getElementById(
          "publicationTableBody"
        );
        publicationTableBody.innerHTML = ""; // Clear existing content

        data.forEach((publication) => {
          const row = document.createElement("tr");

          const titleCell = document.createElement("td");
          const titleInput = document.createElement("input");
          titleInput.type = "text";
          titleInput.value = publication.title;
          titleCell.appendChild(titleInput);
          row.appendChild(titleCell);

          const authorCell = document.createElement("td");
          const authorInput = document.createElement("input");
          authorInput.type = "text";
          authorInput.value = publication.author;
          authorCell.appendChild(authorInput);
          row.appendChild(authorCell);

          const genreCell = document.createElement("td");
          const genreInput = document.createElement("input");
          genreInput.type = "text";
          genreInput.value = publication.genre;
          genreCell.appendChild(genreInput);
          row.appendChild(genreCell);

          const dateCell = document.createElement("td");
          const dateInput = document.createElement("input");
          dateInput.value = publication.publication_date;
          dateInput.addEventListener("click", (event) => {
            event.stopPropagation();
          });
          dateCell.appendChild(dateInput);
          row.appendChild(dateCell);

          const actionsCell = document.createElement("td");

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.classList.add(
            "px-4",
            "py-2",
            "bg-red-500",
            "text-white",
            "rounded-lg",
            "ml-2"
          );
          deleteButton.addEventListener("click", () =>
            deletePublication(publication.id)
          );
          actionsCell.appendChild(deleteButton);

          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.classList.add(
            "px-4",
            "py-2",
            "bg-indigo-500",
            "text-white",
            "rounded-lg"
          );
          editButton.addEventListener("click", () =>
            editPublication(
              publication,
              titleInput,
              authorInput,
              genreInput,
              dateInput
            )
          );
          actionsCell.appendChild(editButton);

          row.appendChild(actionsCell);

          publicationTableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error("Error retrieving publications:", error);
      });
  }

  // Function to delete a publication
  function deletePublication(publicationId) {
    fetch(`http://localhost:3000/publications/${publicationId}`, {
      method: "DELETE",
    })
      .then(() => {
        console.log("Publication deleted successfully");
        fetchPublications(); // Refresh the table after deletion
      })
      .catch((error) => {
        console.error("Error deleting publication:", error);
      });
  }

  // Function to edit a publication
  function editPublication(
    publication,
    titleInput,
    authorInput,
    genreInput,
    dateInput
  ) {
    // Perform the edit logic here
    console.log("Editing publication:", publication);

    // Get the updated values from the input fields
    const updatedPublication = {
      id: publication.id,
      title: titleInput.value,
      author: authorInput.value,
      genre: genreInput.value,
      publication_date: dateInput.value,
    };

    // Send a PUT request to update the publication details
    fetch(`http://localhost:3000/publications/${publication.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPublication),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating publication: " + response.statusText);
        }
        console.log("Publication updated successfully");
        fetchPublications(); // Refresh the table after updating
      })
      .catch((error) => {
        console.error("Error updating publication:", error);
      });
  }

  // Call the fetchPublications function to populate the table
  fetchPublications();
});
