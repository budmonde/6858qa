function questionDOMObject(questionJSON, user) {
  const card = document.createElement('div');
  card.setAttribute('id', questionJSON._id);
  card.className = 'item card';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  card.appendChild(cardBody);

  if (user.name) {
    const cardDelete = document.createElement('button');
    cardDelete.className = 'close';
    cardDelete.addEventListener('click', deleteQuestionHandler);

    const deleteSpan = document.createElement('span');
    deleteSpan.innerHTML = '&times;';
    cardDelete.appendChild(deleteSpan);

    cardBody.appendChild(cardDelete);
  }

  const creatorSpan = document.createElement('p');
  creatorSpan.className = 'item-creator card-title';
  creatorSpan.innerHTML = questionJSON.author;
  cardBody.appendChild(creatorSpan);

  const contentSpan = document.createElement('p');
  contentSpan.className = 'item-content card-text';
  contentSpan.innerHTML = questionJSON.content;
  cardBody.appendChild(contentSpan);

  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer';
  card.appendChild(cardFooter);

  const responsesDiv = document.createElement('div');
  responsesDiv.setAttribute('id', questionJSON._id + '-responses');
  responsesDiv.className = 'item-responses';
  cardFooter.appendChild(responsesDiv);

  cardFooter.appendChild(newResponseDOMObject(questionJSON._id));

  return card;
}

function deleteQuestionHandler() {
  const proceed = confirm("Are you sure you want to delete this response?");
  if (!proceed) return;
  const parentCard = this.parentElement.parentElement;
  const data = {
    _id: parentCard.id
  };
  post('/api/deletequestion', data, function(res) {
    if (res.deleted) {
      parentCard.remove();
    } else {
      alert("Delete failed!");
    }
  });
}

function responseDOMObject(responseJSON, user) {
  responseDiv = document.createElement('div');
  responseDiv.setAttribute('id', responseJSON._id);
  responseDiv.className = 'response mb-2';

  if (user.name) {
    const cardDelete = document.createElement('button');
    cardDelete.className = 'close';
    cardDelete.addEventListener('click', deleteResponseHandler);

    const deleteSpan = document.createElement('span');
    deleteSpan.innerHTML = '&times;';
    cardDelete.appendChild(deleteSpan);

    responseDiv.appendChild(cardDelete);
  }

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

function deleteResponseHandler() {
  const proceed = confirm("Are you sure you want to delete this response?");
  if (!proceed) return;
  const parentSpan = this.parentElement;
  const data = {
    _id: parentSpan.id
  };
  post('/api/deleteresponse', data, function(res) {
    if (res.deleted) {
      parentSpan.remove();
    } else {
      alert("Delete failed!");
    }
  });
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

  const data = {
    author: document.getElementById('author') ? document.getElementById('author').value : '',
    content: responseInput.value,
    parent: this.getAttribute('question-id')
  };

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

  const data = {
    author: document.getElementById('author') ? document.getElementById('author').value : '',
    content: newQuestionInput.value,
  };
  console.log(data);

  post('/api/question', data);
  newQuestionInput.value = '';
}

function renderQuestions(user) {
  document.getElementById('new-question').appendChild(newQuestionDOMObject());

  const questionsDiv = document.getElementById('questions');
  get('/api/questions', {}, function(questionsArr) {
    for (let i = 0; i < questionsArr.length; i++) {
      const currentQuestion = questionsArr[i];
      questionsDiv.prepend(questionDOMObject(currentQuestion, user));

      get('/api/response', { 'parent': currentQuestion._id }, function(responsesArr) {
        for (let j = 0; j < responsesArr.length; j++) {
          const currentResponse = responsesArr[j];
          const responseDiv = document.getElementById(currentResponse.parent + '-responses');
          responseDiv.appendChild(responseDOMObject(currentResponse, user));
        }
      });
    }
  });
}
