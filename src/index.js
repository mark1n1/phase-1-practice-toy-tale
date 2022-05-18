let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const form = document.querySelector('.add-toy-form');

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // console.log(event.target.name.value)
    addToyToDB(event.target.name.value, event.target.image.value);
  })

  const toyCollectionDiv = document.querySelector("#toy-collection");

  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        createToy(toy);
      });
    });
  
  function addToyToDB(name, image) {
    const configurationObject = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0
      })
    }
    fetch('http://localhost:3000/toys', configurationObject)
    .then(response => response.json())
    .then(toy => {
      createToy(toy);
    });
  }
  
  function createToy(toy) {
    // console.log(toys);
    const div = document.createElement("div");
    const img = document.createElement('img');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    const button = document.createElement('button');

    div.className = 'card';

    img.src = `${toy.image}`;
    img.className = 'toy-avatar';

    h2.innerHTML = `${toy.name}`;

    p.innerHTML = `Likes: ${toy.likes}`;

    button.className = 'like-btn';
    button.innerHTML = 'like'
    button.style = 'cursor:pointer'
    button.id = toy.id;
    button.addEventListener('click', (event) => {
      incrementLikes(event, ++toy.likes);
      p.innerHTML = `Likes: ${toy.likes}`;
    });
    
    div.appendChild(h2);
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(button);
    toyCollectionDiv.appendChild(div);
  }

  function incrementLikes(event, likes) {
    const configurationObject = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": likes++
      })
    }
    fetch(`http://localhost:3000/toys/${event.target.id}`, configurationObject)
  }
});
