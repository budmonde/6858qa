main = () => {
  get('/api/whoami', {}, (user) => {
    renderNavbar(user);
    renderTAQ(user);

    const socket = io();
  });
}

const renderTAQ = (user) => {
  if (!user.name) {
    const enqueue = document.getElementById('enqueue');
    enqueue.appendChild(enqueueDOMObject());
  }
}

function queueDOMObject(itemJSON, user) {
  const card = document.createElement('div');
  card.setAttribute('id', item._id);
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
  creatorSpan.innerHTML = itemJSON.author;
  cardBody.appendChild(creatorSpan);

  const contentSpan = document.createElement('p');
  contentSpan.className = 'item-content card-text';
  contentSpan.innerHTML = itemJSON.content;
  cardBody.appendChild(contentSpan);

  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer';
  card.appendChild(cardFooter);

  return card;
}

const enqueueDOMObject = () => {
  const enqueueDiv = document.createElement('div');
  enqueueDiv.className = 'input-group my-3';

  const enqueueName = document.createElement('input');
  enqueueName.setAttribute('type', 'text');
  enqueueName.setAttribute('placeholder', 'Who are you?');
  enqueueName.className = 'form-control';
  enqueueName.setAttribute('id', 'enqueue-name')
  enqueueDiv.appendChild(enqueueName);

  const enqueueLocationDiv = document.createElement('div');
  enqueueLocationDiv.className = 'input-group-append';
  enqueueDiv.appendChild(enqueueLocationDiv);

  const enqueueLocation = document.createElement('input');
  enqueueLocation.setAttribute('type', 'text');
  enqueueLocation.setAttribute('placeholder', 'Where are you?');
  enqueueLocation.className = 'form-control';
  enqueueLocation.setAttribute('id', 'enqueue-location');
  enqueueDiv.appendChild(enqueueLocation);

  const enqueueButtonDiv = document.createElement('div');
  enqueueButtonDiv.className = 'input-group-append';
  enqueueDiv.appendChild(enqueueButtonDiv);

  const enqueueSubmit = document.createElement('button');
  enqueueSubmit.innerHTML = 'Submit';
  enqueueSubmit.className = 'btn btn-outline-dark';
  enqueueSubmit.addEventListener('click', submitEnqueueHandler);
  enqueueButtonDiv.appendChild(enqueueSubmit);

  return enqueueDiv;
}

const submitEnqueueHandler = (e) => {
  const enqueueName = document.getElementById('enqueue-name');;
  const enqueueLocation = document.getElementById('enqueue-location');;

  const data = {
    name: enqueueName.value,
    location: enqueueLocation.value,
  };

  post('/api/enqueue', data, () => {
    enqueueName.value = '';
    enqueueLocation.value = '';
  });
}

main();
