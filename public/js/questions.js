function questionDOMObject(questionJSON) {
  const card = document.createElement('div');
  card.setAttribute('id', questionJSON._id);
  card.className = 'question card';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  card.appendChild(cardBody);

  const creatorSpan = document.createElement('p');
  creatorSpan.className = 'question-creator card-title';
  creatorSpan.innerHTML = questionJSON.author;
  cardBody.appendChild(creatorSpan);

  const contentSpan = document.createElement('p');
  contentSpan.className = 'question-content card-text';
  contentSpan.innerHTML = questionJSON.content;
  cardBody.appendChild(contentSpan);

  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer';
  card.appendChild(cardFooter);

  const responsesDiv = document.createElement('div');
  responsesDiv.setAttribute('id', questionJSON._id + '-responses');
  responsesDiv.className = 'question-responses';
  cardFooter.appendChild(responsesDiv);

  cardFooter.appendChild(newResponseDOMObject(questionJSON._id));

  return card;
}

function responseDOMObject(responseJSON) {
  responseDiv = document.createElement('div');
  responseDiv.setAttribute('id', responseJSON._id);
  responseDiv.className = 'response mb-2';

  responseCreatorSpan = document.createElement('span');
  responseCreatorSpan.className = 'response-creator';
  responseCreatorSpan.innerHTML = responseJSON.author;
  responseDiv.appendChild(responseCreatorSpan);

  responseContentSpan = document.createElement('span');
  responseContentSpan.className = 'response-content';
  responseContentSpan.innerHTML = ' | ' + responseJSON.content;
  responseDiv.appendChild(responseContentSpan);

  return responseDiv;
}

function newResponseDOMObject(parent) {
  const newResponseDiv = document.createElement('div');
  newResponseDiv.className = 'response input-group';

  const newResponseContent = document.createElement('input');
  newResponseContent.setAttribute('type', 'text');
  newResponseContent.setAttribute('name', 'content');
  newResponseContent.setAttribute('placeholder', 'New Response');
  newResponseContent.setAttribute('id', parent + '-response-input');
  newResponseContent.className = 'form-control';
  newResponseDiv.appendChild(newResponseContent);

  const newResponseParent = document.createElement('input');
  newResponseParent.setAttribute('type', 'hidden');
  newResponseParent.setAttribute('name', 'parent');
  newResponseParent.setAttribute('value', parent);
  newResponseDiv.appendChild(newResponseParent);

  const newResponseButtonDiv = document.createElement('div');
  newResponseButtonDiv.className = 'input-group-append';
  newResponseDiv.appendChild(newResponseButtonDiv);

  const newResponseSubmit = document.createElement('button');
  newResponseSubmit.innerHTML = 'Submit';
  newResponseSubmit.className = 'btn btn-outline-dark';
  newResponseSubmit.setAttribute('question-id', parent);
  newResponseSubmit.addEventListener('click', submitResponseHandler);
  newResponseButtonDiv.appendChild(newResponseSubmit);

  return newResponseDiv;
}

function submitResponseHandler() {
  const responseInput = document.getElementById(this.getAttribute('question-id') + '-response-input');
  const authorInput = document.getElementById('author').value;
  const responseAuthor = authorInput !== '' ? authorInput : 'Anonymous';

  const data = {
    author: responseAuthor,
    content: responseInput.value,
    parent: this.getAttribute('question-id')
  };
  console.log(data);

  post('/api/response', data);
  responseInput.value = '';
}

function newQuestionDOMObject() {
  const newQuestionDiv = document.createElement('div');
  newQuestionDiv.className = 'input-group my-3';

  const newQuestionContent = document.createElement('input');
  newQuestionContent.setAttribute('type', 'text');
  newQuestionContent.setAttribute('placeholder', 'New Question');
  newQuestionContent.className = 'form-control';
  newQuestionContent.setAttribute('id', 'question-content-input')
  newQuestionDiv.appendChild(newQuestionContent);

  const newQuestionButtonDiv = document.createElement('div');
  newQuestionButtonDiv.className = 'input-group-append';
  newQuestionDiv.appendChild(newQuestionButtonDiv);

  const newQuestionSubmit = document.createElement('button');
  newQuestionSubmit.innerHTML = 'Submit';
  newQuestionSubmit.className = 'btn btn-outline-dark';
  newQuestionSubmit.addEventListener('click', submitQuestionHandler);
  newQuestionButtonDiv.appendChild(newQuestionSubmit);

  return newQuestionDiv;
}

function submitQuestionHandler() {
  const newQuestionInput = document.getElementById('question-content-input');
  const authorInput = document.getElementById('author').value;
  const responseAuthor = authorInput !== '' ? authorInput : 'Anonymous';

  const data = {
    author: responseAuthor,
    content: newQuestionInput.value,
  };
  console.log(data);

  post('/api/question', data);
  newQuestionInput.value = '';
}

function renderQuestions() {
  document.getElementById('new-question').appendChild(newQuestionDOMObject());

  const questionsDiv = document.getElementById('questions');
  get('/api/questions', {}, function(questionsArr) {
    for (let i = 0; i < questionsArr.length; i++) {
      const currentQuestion = questionsArr[i];
      questionsDiv.prepend(questionDOMObject(currentQuestion));

      get('/api/response', { 'parent': currentQuestion._id }, function(responsesArr) {
        for (let j = 0; j < responsesArr.length; j++) {
          const currentResponse = responsesArr[j];
          const responseDiv = document.getElementById(currentResponse.parent + '-responses');
          responseDiv.appendChild(responseDOMObject(currentResponse));
        }
      });
    }
  });
}
