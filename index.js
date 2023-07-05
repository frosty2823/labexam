async function fetchData() {
  try {
    const response = await fetch(
      "https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=f7d54802ae9d4e2eb6b90d6e456b63ee"
    );
    const data = await response.json();

    const cards = document.querySelectorAll(".card");
    data.articles.slice(0, cards.length).forEach((article, index) => {
      const card = cards[index];
      const titleElement = card.querySelector(".title");
      const descriptionElement = card.querySelector(".description");
      const imageElement = card.querySelector("img");
      const readMoreElement = card.querySelector(".read-more");

      const articleTitle = article.title;
      const articleImage = article.urlToImage;
      const articleDescription = article.description;
      const articleURL = article.url;

      titleElement.textContent = articleTitle;
      descriptionElement.textContent = articleDescription;
      imageElement.src = articleImage;
      readMoreElement.href = articleURL;

      const dateElement = card.querySelector(".date"); // Get the date element within the card
      const currentDate = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      dateElement.textContent = currentDate;
    });
  } catch (error) {
    console.log("Error fetching API data:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchData);
