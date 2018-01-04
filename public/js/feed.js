function storyDOMObject(storyJSON, user) {
  console.log(storyJSON);
  console.log(user);
  const storyDiv = document.createElement('div');
  storyDiv.setAttribute('id', storyJSON._id);
  storyDiv.className = 'story';

  const ownerSpan = document.createElement('span');
  ownerSpan.className = 'story-owner';
  ownerSpan.innerHTML = storyJSON.owner + ": ";
  storyDiv.appendChild(ownerSpan);

  const messageSpan = document.createElement('span');
  messageSpan.className = 'story-message';
  messageSpan.innerHTML = storyJSON.message;
  storyDiv.appendChild(messageSpan);

  const commentsDiv = document.createElement('div');
  commentsDiv.className = 'story-comments';

  if (user._id)
    commentsDiv.appendChild(newCommentDOMObject(storyJSON._id));

  storyDiv.appendChild(commentsDiv);

  return storyDiv;
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
  newCommentDiv.className = 'comment';

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
  newStoryDiv.className = 'story';

  const newStoryMessage = document.createElement('input');
  newStoryMessage.setAttribute('type', 'text');
  newStoryMessage.setAttribute('placeholder', 'New Story');
  newStoryDiv.appendChild(newStoryMessage);

  const newStorySubmit = document.createElement('button');
  newStorySubmit.innerHTML = 'Submit';
  newStorySubmit.addEventListener('click', submitStoryHandler);
  newStoryDiv.appendChild(newStorySubmit);

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
    const storiesDiv = document.getElementById('stories');

    if (user._id)
      storiesDiv.appendChild(newStoryDOMObject());

    const storiesArr = await get('/api/stories', '', '');
    for (let story of storiesArr) {
      storiesDiv.appendChild(storyDOMObject(story, user));

      const comments = await(get('/api/comment', 'parent', story._id));
      for (let comment of comments) {
        const storyDiv = document.getElementById(comment.parent);
        comment.owner = (await get('/api/user', 'id', comment.owner)).name;
        storyDiv.children[2].appendChild(commentDOMObject(await comment));
      }
    }

  } catch(err) {
    console.log(err);
  }
}
