const cards = ["🍎", "🍌", "🍎", "🍇", "🍌", "🍇", "♥️", "⭐", "♥️", "⭐"].map((value) => ({
  value,
  isFlipped: false,
  isMatched: false,
}))

let openCards = []
let lockBoard = false

const cardGrid = document.querySelector(".card-grid")

/* ---------- SHUFFLE ---------- */
function shuffle(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
}

/* ---------- RENDER ---------- */
function render() {
  cardGrid.innerHTML = ""

  cards.forEach((card, index) => {
    const div = document.createElement("div")
    div.className = "card"
    div.id = index
    div.dataset.matched = card.isMatched
    div.innerText = card.isFlipped || card.isMatched ? card.value : "🃏"
    cardGrid.appendChild(div)
  })
}

/* ---------- CLICK HANDLER ---------- */
cardGrid.addEventListener("click", (e) => {
  const index = e.target.id
  if (lockBoard || index === undefined) return

  const card = cards[index]
  if (card.isFlipped || card.isMatched) return

  card.isFlipped = true
  openCards.push(index)
  render()

  if (openCards.length === 2) {
    checkMatch()
  }
})

/* ---------- MATCH LOGIC ---------- */
function checkMatch() {
  lockBoard = true
  const [i1, i2] = openCards

  if (cards[i1].value === cards[i2].value) {
    cards[i1].isMatched = cards[i2].isMatched = true
    resetTurn()
    checkGameOver()
  } else {
    setTimeout(() => {
      cards[i1].isFlipped = cards[i2].isFlipped = false
      resetTurn()
      render()
    }, 800)
  }
}

function resetTurn() {
  openCards = []
  lockBoard = false
}

/* ---------- GAME OVER ---------- */
function checkGameOver() {
  if (cards.every((card) => card.isMatched)) {
    setTimeout(() => {
      alert("🎉 You Win!")
      cards.forEach((card) => {
        card.isFlipped = false
        card.isMatched = false
      })
      shuffle(cards)
      render()
    }, 500)
  }
}

/* ---------- INIT ---------- */
shuffle(cards)
render()
