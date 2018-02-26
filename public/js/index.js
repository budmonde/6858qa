function main() {
  renderNavbar();
  renderQuestions();

  const socket = io();

  socket.on('question', function(questionJSON) {
      const questionsDiv = document.getElementById('questions');
      questionsDiv.prepend(questionDOMObject(questionJSON));
  });

  socket.on('response', function(responseJSON) {
    const responseDiv = document.getElementById(responseJSON.parent + '-responses');
    responseDiv.appendChild(responseDOMObject(responseJSON));
  });
}

main();
