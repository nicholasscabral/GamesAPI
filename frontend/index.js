function checkIfItsEmpty() {
  if (document.getElementById('carrinho').hasChildNodes(false)) {
    document.write("Nenhum item no carrinho")
  }
}
checkIfItsEmpty()

var carrinho = []

function removeCarrinho(item) {
  var list = document.getElementById('carrinho')
  
  list.removeChild(item)
}

function addCarrinho(ListItem) {
  carrinho.push(ListItem)
  console.log(carrinho)
  var list = document.getElementById('carrinho')

  var item = ListItem.cloneNode(true)
  item.removeChild(item.childNodes[3])
  item.removeChild(item.childNodes[2])
  item.removeChild(item.childNodes[1])

  var removeBtn = document.createElement('button')
  removeBtn.innerHTML = 'remover do carrinho'
  removeBtn.addEventListener('click', () => {
    removeCarrinho(item)
  })

  item.appendChild(removeBtn)
  list.appendChild(item)
}

function createGame() {
  var titleInput = document.getElementById('title');
  var yearInput = document.getElementById('year');
  var priceInput = document.getElementById('price')

  var game = {
    title: titleInput.value,
    year: yearInput.value,
    price: priceInput.value
  }

  axios.post('http://localhost:4321/game',game).then(response => {
    if(response.status === 200) {
      window.location.reload()
    }
  }).catch(err => console.log(err))

  console.log(game)
}

function deleteGame(ListItem) {
  var id = ListItem.getAttribute("data-id")
  console.log(id)

  if (confirm("Are you sure you want to delete this game?")) {
    axios.post(`http://localhost:4321/delete-game/${id}`).then(response => {
      window.location.reload()
    }).catch(error => {
      console.log(error)
    })
  } else return
}

function loadForm(ListItem) {
  var id = ListItem.getAttribute("data-id")
  var title = ListItem.getAttribute("data-title")
  var year = ListItem.getAttribute("data-year")
  var price = ListItem.getAttribute("data-price")

  document.getElementById("id").value = id
  document.getElementById("titleEdit").value = title
  document.getElementById("yearEdit").value = year
  document.getElementById("priceEdit").value = price
}

function updateGame() {
  var id = document.getElementById("id").value;
  var titleInput = document.getElementById('titleEdit');
  var yearInput = document.getElementById('yearEdit');
  var priceInput = document.getElementById('priceEdit')

  var game = {
    title: titleInput.value,
    year: yearInput.value,
    price: priceInput.value
  }

  axios.post(`http://localhost:4321/update-game/${id}`, game).then(response => {
    if(response.status === 200) {
      window.location.reload()
    }
  }).catch(err => console.log(err))
}

axios.get("http://localhost:4321/games").then((result) => {
  var games = result.data;
  var list =document.getElementById("games");

  games.forEach((game) => {
    var item = document.createElement("li");

    item.setAttribute("data-id", game.id);
    item.setAttribute("data-title", game.title);
    item.setAttribute("data-year", game.year);
    item.setAttribute("data-price", game.price);

    item.innerHTML = game.title + " - " + game.price + " - " + game.year;

    var deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = "deletar"
    deleteBtn.addEventListener("click", () => {
      deleteGame(item);
    })

    var editBtn = document.createElement("button")
    editBtn.innerHTML = "Editar"
    editBtn.addEventListener("click", () => {
      loadForm(item);
    })

    var carrinhoBtn = document.createElement("button")
    carrinhoBtn.innerHTML = "Add ao carrinho"
    carrinhoBtn.addEventListener("click", () => {
      addCarrinho(item)
    })

    item.appendChild(carrinhoBtn)
    item.appendChild(editBtn);
    item.appendChild(deleteBtn)
    list.appendChild(item);
  })

}).catch((err) => {
  console.log(err);
});