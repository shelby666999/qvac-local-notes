const noteInput = document.getElementById("note");
const questionInput = document.getElementById("question");
const askButton = document.getElementById("askButton");
const status = document.getElementById("status");
const answer = document.getElementById("answer");

askButton.addEventListener("click", async () => {
  const note = noteInput.value.trim();
  const question = questionInput.value.trim();

  if (!note || !question) {
    status.textContent = "Please add a note and a question.";
    return;
  }

  askButton.disabled = true;
  status.textContent = "Loading QVAC and generating a local answer...";
  answer.textContent = "";

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        note,
        question
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The request failed.");
    }

    answer.textContent = data.answer;
    status.textContent = "Answer generated locally with QVAC.";
  } catch (error) {
    answer.textContent = "Unable to generate an answer.";
    status.textContent = error.message;
  } finally {
    askButton.disabled = false;
  }
});

questionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    askButton.click();
  }
});
