document.addEventListener('DOMContentLoaded', function(event){
  const apiUrl = 'http://fetch-message-in-the-bottle.herokuapp.com/api/v2/messages'
  const userName = "Working!"
  const newTweetForm = document.getElementById('new-tweet-form')
  const tweetText = document.getElementById('new-tweet-text')
  const tweetsContainer = document.getElementById('tweets-container')

  fetch(apiUrl).then(r=>r.json()).then(getHtmlsObjs)

  newTweetForm.addEventListener('submit', function(event){
    event.preventDefault()
    const tweet = tweetText.value;
    makeTweet(tweet)
    tweetText.value = ''
  })

  tweetsContainer.addEventListener('click', function(event){
    if (event.target.id == 'delete') {
      tweetDelete(event)
    } else if (event.target.id == 'update') {
      // var tweet = tweetText.value
      var updateForm = document.createElement('FORM')
      updateForm.setAttribute('id', `update-${event.target.parentElement.id}`)
      updateForm.innerHTML = `<label >Update the Tweet: <input id='update-tweet-text' type="text"></label>`
      const buttonUpdate = document.createElement('BUTTON')
      buttonUpdate.setAttribute('id', 'GO-UPDATE')
      buttonUpdate.innerText = "UPDATE THE TEXT"
      updateForm.appendChild(buttonUpdate)
      var li = event.target.parentElement
      // var tweet = text.value
      li.appendChild(updateForm)

      // var text = document.getElementById('update-tweet-text')
      // var tweet = text.value
      updateForm.addEventListener('click', function(event) {
        if (event.target.id == 'GO-UPDATE') {
          var text = document.getElementById('update-tweet-text')

          var tweet = text.value
          var id = event.target.parentElement.parentElement.id

          updateTweet(event, tweet, id)

        }



      })



    }
  })


  function getHtmlsObjs(objs) {
    objs.map(getHtmlobj)
  }

  function getHtmlobj(obj) {

    const li = document.createElement('LI');
    li.setAttribute('id', `${obj.id}`);
    li.setAttribute('data-user-name', `${obj.real_name}`);
    li.innerText = obj.message;
      const buttonDelete = document.createElement('BUTTON');
      buttonDelete.setAttribute('id', 'delete');
      buttonDelete.innerText = "Delete";

      const buttonUpdate = document.createElement('BUTTON');
      buttonUpdate.setAttribute('id', 'update');
      buttonUpdate.innerText = "Update";

    li.appendChild(buttonDelete);
    li.appendChild(buttonUpdate);
    tweetsContainer.appendChild(li);

  }

  function makeTweet(tweet) {
    const body = {
      message: {
        real_name: userName,
        message: tweet
      }
    }
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Data-Type': 'application/json'
      },
      body:JSON.stringify(body)
    };

    fetch(apiUrl, config).then(r => r.json()).then(getHtmlobj)

  }

  function tweetDelete(event) {
    fetch(`${apiUrl}/${event.target.parentElement.id}`, {method: 'DELETE'}).then(r=>r.json()).then(a => removeTweet(event, a))
  }

  function removeTweet(event, a) {
    event.target.parentElement.remove();
  }

  function updateTweet(event, tweet, tweetId) {
    // let id = event.target.parentElement.parentElement.id;
    const body = {
      message: {
        real_name: userName,
        message: tweet
      }
    }
    const config = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Data-Type': 'application/json'
      },
      body:JSON.stringify(body)
    };
    fetch(`${apiUrl}/${tweetId}`, config).then(r => r.json()).then(a => something(a))


  }

  function something(a) {
      debugger;
  }

  var clockcounter = document.getElementById('counter');
  const plus = document.getElementById('+');
  const minus = document.getElementById('-');
  const pause = document.getElementById('pause');
  const like = document.getElementById('<3');
  const thelikes = document.getElementsByClassName('likes')[0];
  var object = {};


  function add() {
    clockcounter.innerText = Number(clockcounter.innerText) + 1;
  }
  function subtract() {
    clockcounter.innerText = Number(clockcounter.innerText) - 1;
  }
  plus.addEventListener('click', add);
  minus.addEventListener('click', subtract);

  var time = setInterval(add, 1000);

  function toLike() {
    let key = clockcounter.innerText;
    if (object[key]) {
      let li = document.getElementById(`likes-${key}`);
      object[key] += 1;
      li.innerText = `${key} has been liked ${object[key]} times.`;
      thelikes.appendChild(li);
    } else {
      object[key] = 1;
      let li = document.createElement('LI');
      li.setAttribute('id', `likes-${key}`);
      li.innerText = `${key} has been liked ${object[key]} time.`;
      thelikes.appendChild(li);
    }

  }
  like.addEventListener('click', toLike);

  function toPause() {
    if (pause.innerText == 'pause') {
      pause.innerText = 'resume';
      plus.disabled = true;
      minus.disabled = true;
      like.disabled = true;
      clearInterval(time)
    } else if (pause.innerText == 'resume') {
      pause.innerText = 'pause';
      plus.disabled = false;
      minus.disabled = false;
      like.disabled = false;
      time = setInterval(add, 1000)
    }
  }

  pause.addEventListener('click', toPause)

  const postImageForm = document.getElementById('post-image-form')
  const imageContainer = document.getElementById('images-container')
  const imageURL = 'http://localhost:3000/api/v1/images'
  const imageText = document.getElementById('new-photo-text')
  const likesURL = 'http://localhost:3000/api/v1/likes'
  const imageForm = document.getElementById('new-image-form')

  fetch(imageURL).then(r => r.json()).then(showImages)

  imageContainer.addEventListener('click', function(event) {
    event.preventDefault();
    if (event.target.dataset.action) {
      const imageId = event.target.dataset.imageId
      var likes_count = Number(event.target.parentElement.children[2].innerText)
      addMoreLikes(event, likes_count, imageId)
    }
  })

  function addMoreLikes(event, likes_count, imageId) {
    const body = {
    image_id: imageId
  }
  const config = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body:JSON.stringify(body)
  }

    fetch(likesURL, config).then(r => r.json()).then(a => showTheLikes(event, a, likes_count))

  }

  function showTheLikes(event, a, likes_count) {
    event.target.parentElement.children[2].innerText = likes_count + 1
  }


  imageForm.addEventListener('submit', function(event){
    event.preventDefault();

    var image = imageText.value
    postImage(image)


  })

  function showImages(images) {
    images.map(showImage)
  }

  function showImage(image) {
    imageContainer.innerHTML += `<div class="image-container">
    <img src="${image.url}">
   <p>
        <img data-action="like-image" data-image-id="${image.id}" class="like-button" src="https://cdn.worldvectorlogo.com/logos/facebook-like.svg" width='70' height='70'><br>
        <span id="likes-${image.id}">${image.likes_count}</span>
        <img data-action="like-image" data-image-id="${image.id}" class="like-button" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFYVlvNihI4-OZ7UulMgyA-McYeoymHz5rr5C3avD2xyMFn5j9" width='70' height='70'><br>
    </p>
</div> `
  }

  function postImage(image) {

    const body = {
    url: image
  }
  const config = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  fetch(`${imageURL}`,config).then(r => r.json()).then(showImage)
  }





})
