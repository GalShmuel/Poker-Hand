const numCards = 5;
const showHandButton = document.getElementById('showHand');

function createRandomCard(){
    const valueNumber = Math.floor(Math.random()*13+1)
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const valueColor = (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
    return { valueNumber, valueColor, suit }
}

function createHand(){
    const hand = []
    for (let i =0; i < numCards; i++) {
        hand.push(createRandomCard())
    }
    return hand;
}


function getSuitSymbol(suit) {
    const symbols = {
        'hearts': '♥',
        'diamonds': '♦',
        'clubs': '♣',
        'spades': '♠'
    };
    return symbols[suit];
}

function displayHand(hand){
    const container = document.getElementById('cardContainer');
    container.innerHTML = ''; 
    hand.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.valueColor}`;
        cardElement.setAttribute('data-suit', card.suit);
        
        let displayValue;
        switch(card.valueNumber) {
            case 1: 
                displayValue = 'A'; 
                break;
            case 11: 
                displayValue = 'J';
                break;
            case 12:
                displayValue = 'Q';
                break;
            case 13:
                displayValue = 'K';
                break;
            default: 
                displayValue = card.valueNumber;
        }
        
        const suitSymbol = getSuitSymbol(card.suit);
        
        // Create card structure with corners and center
        cardElement.innerHTML = `
            <div class="card-corner top-left">
                <div class="card-value">${displayValue}</div>
                <div class="card-suit-small">${suitSymbol}</div>
            </div>
            <div class="card-center">
                <div class="card-suit-large">${suitSymbol}</div>
            </div>
            <div class="card-corner bottom-right">
                <div class="card-value">${displayValue}</div>
                <div class="card-suit-small">${suitSymbol}</div>
            </div>
        `;
        
        container.appendChild(cardElement);
    });
}


showHandButton.addEventListener('click', () => {
    const hand = createHand();
    displayHand(hand);
    const result = PokerHand(hand);
    document.getElementById('handResult').textContent = result;
    document.getElementById('handResult').style.display = 'block';

});


function PokerHand(hand){
    const counterNumbers = {};

    hand.forEach(card => {
        const key = `${card.valueNumber}-${card.suit}`;
        counterNumbers[key] = (counterNumbers[key]||0 ) +1;
    });
    const counts = Object.values(counterNumbers);

    if(counts.includes(4)) 
        return 'Four of a Kind';
    else if (counts.includes(3) && counts.includes(2))
        return 'Full House';
    else if (counts.includes(3))
        return 'Three of a Kind';
    else if (counts.filter(count => count === 2).length === 2)
        return 'Two Pair';
    else if (counts.includes(2))
        return 'Pair';
    else
        return 'No Hand!';
}