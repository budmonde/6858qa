function main() {
  get('/api/whoami', {}, (user) => {
    renderNavbar(user);
    renderQuestions(user);

    const socket = io();

    socket.on('question', function(questionJSON) {
        const questionsDiv = document.getElementById('questions');
        questionsDiv.prepend(questionDOMObject(questionJSON, user));
    });

    socket.on('deletequestion', function(questionId) {
        const questionCard = document.getElementById(questionId);
        questionCard.remove();
    });

    socket.on('response', function(responseJSON) {
      const responseDiv = document.getElementById(responseJSON.parent + '-responses');
      responseDiv.appendChild(responseDOMObject(responseJSON, user));
    });

    socket.on('deleteresponse', function(responseId) {
        const responseSpan = document.getElementById(responseId);
        responseSpan.remove();
    });
  });
}

main();
