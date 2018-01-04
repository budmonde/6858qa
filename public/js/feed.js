function storyDOMObject(storyJSON, user) {
  const card = document.createElement('div');
  card.setAttribute('id', storyJSON._id);
  card.className = 'story card';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  card.appendChild(cardBody);

  const ownerSpan = document.createElement('h5');
  ownerSpan.className = 'story-owner card-title';
  ownerSpan.innerHTML = storyJSON.owner + ": ";
  cardBody.appendChild(ownerSpan);

  const messageSpan = document.createElement('p');
  messageSpan.className = 'story-message card-text';
  messageSpan.innerHTML = storyJSON.message;
  cardBody.appendChild(messageSpan);

  const commentsDiv = document.createElement('div');
  commentsDiv.setAttribute('id', storyJSON._id + '-comments');
  commentsDiv.className = 'story-comments card-footer';

  if (user._id)
    commentsDiv.appendChild(newCommentDOMObject(storyJSON._id));

  card.appendChild(commentsDiv);

  return card;
}

function commentDOMObject(commentJSON) {
    commentDiv = document.createElement('div');
    commentDiv.setAttribute('id', commentJSON._id);
    commentDiv.className = 'comment';

    commentOwnerSpan = document.createElement('span');
    commentOwnerSpan.className = 'comment-owner';
    commentOwnerSpan.innerHTML = commentJSON.owner + ": ";
    commentDiv.appendChild(commentOwnerSpan);

    commentMessageSpan = document.createElement('span');
    commentMessageSpan.className = 'comment-message';
    commentMessageSpan.innerHTML = commentJSON.message;
    commentDiv.appendChild(commentMessageSpan);

    return commentDiv;
}

function newCommentDOMObject(parent) {
  const newCommentDiv = document.createElement('div');
  newCommentDiv.className = 'comment input-group mb-3';

  const newCommentMessage = document.createElement('input');
  newCommentMessage.setAttribute('type', 'text');
  newCommentMessage.setAttribute('name', 'message');
  newCommentMessage.setAttribute('placeholder', 'New Comment');
  newCommentDiv.appendChild(newCommentMessage);

  const newCommentParent = document.createElement('input');
  newCommentParent.setAttribute('type', 'hidden');
  newCommentParent.setAttribute('name', 'parent');
  newCommentParent.setAttribute('value', parent);
  newCommentDiv.appendChild(newCommentParent);

  const newCommentSubmit = document.createElement('button');
  newCommentSubmit.innerHTML = 'Submit';
  newCommentSubmit.addEventListener('click', submitCommentHandler);
  newCommentDiv.appendChild(newCommentSubmit);

  return newCommentDiv;
}

function submitCommentHandler() {
  const newCommentDiv = this.parentElement;
  const storyDiv = newCommentDiv.parentElement.parentElement;
  const data = {
    message: newCommentDiv.children[0].value,
    owner: storyDiv.id
  };
  post('/api/comment', data);
  newCommentDiv.children[0].value = '';
}

function newStoryDOMObject() {
  const newStoryDiv = document.createElement('div');
  newStoryDiv.className = 'input-group my-3';

  const newStoryMessage = document.createElement('input');
  newStoryMessage.setAttribute('type', 'text');
  newStoryMessage.setAttribute('placeholder', 'New Story');
  newStoryMessage.className = 'form-control';
  newStoryDiv.appendChild(newStoryMessage);

  const newStoryButtonDiv = document.createElement('div');
  newStoryButtonDiv.className = 'input-group-append';
  newStoryDiv.appendChild(newStoryButtonDiv);

  const newStorySubmit = document.createElement('button');
  newStorySubmit.innerHTML = 'Submit';
  newStorySubmit.className = 'btn btn-outline-primary';
  newStorySubmit.addEventListener('click', submitStoryHandler);
  newStoryButtonDiv.appendChild(newStorySubmit);

  return newStoryDiv;
}

function submitStoryHandler() {
  const newStoryDiv = this.parentElement;
  const data = {
    message: newStoryDiv.children[0].value,
  };
  post('/api/story', data);
  newStoryDiv.children[0].value = '';
}

async function renderStories(user) {
  try {

    if (user._id)
      document.getElementById('new-story').appendChild(newStoryDOMObject());

    const storiesDiv = document.getElementById('stories');

    const storiesArr = await get('/api/stories', '', '');
    for (let story of storiesArr) {
      story.owner = (await get('api/user', 'id', story.owner)).name;
      storiesDiv.prepend(storyDOMObject(await story, user));

      const comments = await(get('/api/comment', 'parent', story._id));
      for (let comment of comments) {
        const storyDiv = document.getElementById(comment.parent);
        comment.owner = (await get('/api/user', 'id', comment.owner)).name;
        const commentDiv = document.getElementById(comment.parent + '-comments')
        commentDiv.appendChild(commentDOMObject(await comment));
      }
    }

  } catch(err) {
    console.log(err);
  }
}
