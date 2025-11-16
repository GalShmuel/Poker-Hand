const numCards = 5;
const showHandButton = document.getElementById('showHand');
const startGameButton = document.getElementById('startGame');

// Player scores tracker
let playerScores = {};

// Define players with positions (will be set from inputs)
let players = [
    { name: '', position: 'top' },
    { name: '', position: 'bottom' },
    { name: '', position: 'left' },
    { name: '', position: 'right' }
];

// Handle number of players change
function updatePlayerInputs() {
    const numPlayers = parseInt(document.getElementById('numPlayersSelect').value);
    const leftGroup = document.getElementById('playerLeftGroup');
    const rightGroup = document.getElementById('playerRightGroup');
    
    if (numPlayers === 2) {
        leftGroup.style.display = 'none';
        rightGroup.style.display = 'none';
    } else if (numPlayers === 3) {
        leftGroup.style.display = 'flex';
        rightGroup.style.display = 'none';
    } else { // 4 players
        leftGroup.style.display = 'flex';
        rightGroup.style.display = 'flex';
    }
}

// Initialize game
function initializeGame() {
    const numPlayers = parseInt(document.getElementById('numPlayersSelect').value);
    const topInput = document.getElementById('playerTop').value.trim() || 'Player 1';
    const bottomInput = document.getElementById('playerBottom').value.trim() || 'Player 2';
    
    // Build players array based on number of players
    players = [
        { name: topInput, position: 'top' },
        { name: bottomInput, position: 'bottom' }
    ];
    
    if (numPlayers >= 3) {
        const leftInput = document.getElementById('playerLeft').value.trim() || 'Player 3';
        players.push({ name: leftInput, position: 'left' });
    }
    
    if (numPlayers === 4) {
        const rightInput = document.getElementById('playerRight').value.trim() || 'Player 4';
        players.push({ name: rightInput, position: 'right' });
    }
    
    // Initialize scores
    players.forEach(player => {
        if (!playerScores[player.name]) {
            playerScores[player.name] = 0;
        }
    });
    
    // Hide input form, show game elements
    document.getElementById('playerNamesInput').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'block';
    document.getElementById('showHand').style.display = 'block';
    
    // Update scoreboard
    updateScoreboard();
}

function updateScoreboard() {
    const scoreboardContent = document.getElementById('scoreboardContent');
    scoreboardContent.innerHTML = '';
    
    // Sort players by score (descending)
    const sortedPlayers = players.map(player => ({
        name: player.name,
        score: playerScores[player.name] || 0,
        position: player.position
    })).sort((a, b) => b.score - a.score);
    
    sortedPlayers.forEach((player, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        if (index === 0 && player.score > 0) {
            scoreItem.classList.add('leader');
        }
        
        const rank = document.createElement('span');
        rank.className = 'rank';
        rank.textContent = `${index + 1}.`;
        
        const name = document.createElement('span');
        name.className = 'player-name-score';
        name.textContent = player.name;
        
        const score = document.createElement('span');
        score.className = 'wins-count';
        score.textContent = `${player.score} ${player.score === 1 ? 'win' : 'wins'}`;
        
        scoreItem.appendChild(rank);
        scoreItem.appendChild(name);
        scoreItem.appendChild(score);
        scoreboardContent.appendChild(scoreItem);
    });
}

// Update inputs when number of players changes and set initial state
if (document.getElementById('numPlayersSelect')) {
    document.getElementById('numPlayersSelect').addEventListener('change', updatePlayerInputs);
    // Set initial state on page load
    updatePlayerInputs();
}

// Start game button event
startGameButton.addEventListener('click', () => {
    initializeGame();
});

// Allow Enter key to start game
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('playerNamesInput').style.display !== 'none') {
        initializeGame();
    }
});

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

function createCardElement(card, index = 0) {
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
    
    return cardElement;
}

function displayHand(hand, container, delayOffset = 0) {
    container.innerHTML = '';
    
    // Create all cards and add them to container immediately at final positions
    const cardElements = hand.map((card, index) => {
        const cardElement = createCardElement(card, index);
        cardElement.style.opacity = '0';
        cardElement.style.visibility = 'hidden';
        container.appendChild(cardElement);
        return cardElement;
    });
    
    // Force browser to calculate positions before making cards visible
    container.offsetHeight; // Trigger reflow
    
    // Trigger flip animation for each card with staggered delay
    cardElements.forEach((cardElement, index) => {
        setTimeout(() => {
            cardElement.style.visibility = 'visible';
            cardElement.style.opacity = '1';
            cardElement.classList.add('flipping');
            
            // Remove flip class after animation completes
            setTimeout(() => {
                cardElement.classList.remove('flipping');
            }, 600);
        }, delayOffset + (index * 100));
    });
}

function getHandResultClass(handType) {
    const lowerType = handType.toLowerCase();
    if (lowerType.includes('flush') && !lowerType.includes('straight')) {
        return 'flush';
    } else if (lowerType.includes('straight') && !lowerType.includes('flush')) {
        return 'straight';
    }
    return '';
}

function displayAllPlayers() {
    // Disable button at start of round
    showHandButton.disabled = true;
    showHandButton.classList.add('disabled');
    
    const playersContainer = document.getElementById('playersContainer');
    const cardsOnTable = document.getElementById('cardsOnTable');
    const tableFelt = document.querySelector('.table-felt');
    
    playersContainer.innerHTML = '';
    cardsOnTable.innerHTML = '';
    
    // Remove existing winner announcement
    const existingWinner = document.getElementById('winnerAnnouncement');
    if (existingWinner) {
        existingWinner.remove();
    }
    
    // Create hands for all players
    const playerHands = players.map(player => ({
        ...player,
        hand: createHand()
    }));
    
    // Calculate results for all players
    playerHands.forEach(playerData => {
        playerData.result = PokerHand(playerData.hand);
    });
    
    // Find winners
    const winners = findWinners(playerHands);
    const winnerNames = winners.map(w => w.name);
    
    // Note: Scores will be updated after winner announcement
    
    // Store player elements for later winner highlighting
    const playerElements = [];
    
    // Display each player
    playerHands.forEach((playerData, playerIndex) => {
        const isWinner = winnerNames.includes(playerData.name);
        
        // Create player info section (name and result) outside table
        const playerSection = document.createElement('div');
        playerSection.className = `player-section position-${playerData.position}`;
        
        const playerName = document.createElement('div');
        playerName.className = 'player-name';
        playerName.textContent = playerData.name;
        
        const playerResult = document.createElement('div');
        playerResult.className = `player-result hand-result ${getHandResultClass(playerData.result)}`;
        playerResult.textContent = playerData.result;
        playerResult.style.opacity = '0';
        playerResult.style.visibility = 'hidden';
        
        playerSection.appendChild(playerName);
        playerSection.appendChild(playerResult);
        playersContainer.appendChild(playerSection);
        
        // Create cards container on the table
        const playerCardsContainer = document.createElement('div');
        playerCardsContainer.className = `player-cards-container position-${playerData.position}`;
        cardsOnTable.appendChild(playerCardsContainer);
        
        // Store elements for winner highlighting later
        playerElements.push({
            isWinner: isWinner,
            playerSection: playerSection,
            playerName: playerName,
            playerCardsContainer: playerCardsContainer,
            playerIndex: playerIndex
        });
        
        // Display cards with flip animation and staggered delays per player
        displayHand(playerData.hand, playerCardsContainer, playerIndex * 300);
        
        // Show result after all cards for this player finish flipping
        // Delay = player delay + (numCards * card delay) + flip animation time
        const resultDelay = playerIndex * 300 + (numCards * 100) + 600;
        setTimeout(() => {
            playerResult.style.visibility = 'visible';
            playerResult.style.opacity = '1';
            playerResult.style.transition = 'opacity 0.5s ease-in';
        }, resultDelay);
    });
    
    // Apply winner styling after all cards are revealed (after all results are shown)
    const lastPlayerDelay = (playerHands.length - 1) * 300 + (numCards * 100) + 600;
    const winnerHighlightDelay = lastPlayerDelay + 500; // Wait a bit after last result appears
    setTimeout(() => {
        playerElements.forEach(({ isWinner, playerSection, playerName, playerCardsContainer }) => {
            if (isWinner) {
                playerSection.classList.add('winner');
                playerName.classList.add('winner-name');
                playerCardsContainer.classList.add('winner-cards');
            }
        });
    }, winnerHighlightDelay);
    
    // Display winner announcement after all cards are dealt
    const totalDelay = playerHands.length * 300 + (numCards * 100) + 600;
    setTimeout(() => {
        const winnerAnnouncement = document.createElement('div');
        winnerAnnouncement.id = 'winnerAnnouncement';
        winnerAnnouncement.className = 'winner-announcement';
        
        let winnerText;
        if (winners.length === 1) {
            winnerText = `🏆 ${winners[0].name} Wins! 🏆`;
        } else {
            winnerText = `🏆 Tie! ${winners.map(w => w.name).join(' & ')} Win! 🏆`;
        }
        
        winnerAnnouncement.textContent = winnerText;
        tableFelt.appendChild(winnerAnnouncement);
        
        // Animate in
        setTimeout(() => {
            winnerAnnouncement.classList.add('show');
            
            // Update scores and scoreboard after winner announcement appears
            setTimeout(() => {
                // Update scores
                winners.forEach(winner => {
                    playerScores[winner.name] = (playerScores[winner.name] || 0) + 1;
                });
                
                // Update scoreboard
                updateScoreboard();
            }, 300); // Wait a bit after announcement appears
            
            // Re-enable button after winner announcement animation completes
            setTimeout(() => {
                showHandButton.disabled = false;
                showHandButton.classList.remove('disabled');
            }, 700); // Wait for bounce animation to complete
        }, 50);
    }, totalDelay);
}


showHandButton.addEventListener('click', () => {
    // Prevent action if button is disabled
    if (showHandButton.disabled) {
        return;
    }
    displayAllPlayers();
});


function PokerHand(hand) {
    const values = hand.map(c => c.valueNumber).sort((a,b) => a-b);
    const suits = hand.map(c => c.suit);

    // Count card values
    const valueCounts = {};
    values.forEach(v => valueCounts[v] = (valueCounts[v]||0)+1);

    const counts = Object.values(valueCounts);

    const isFlush = suits.every(s => s === suits[0]);
    
    // Check straight including A-2-3-4-5 and 10-J-Q-K-A
    const isStraight = (() => {
        const sorted = [...new Set(values)].sort((a,b)=>a-b);
        if(sorted.length !== 5) return false;
        // Standard straight
        if(sorted[4] - sorted[0] === 4) return true;
        // A-2-3-4-5
        if(JSON.stringify(sorted) === JSON.stringify([1,2,3,4,5])) return true;
        // 10-J-Q-K-A
        if(JSON.stringify(sorted) === JSON.stringify([1,10,11,12,13])) return true;
        return false;
    })();

    if(isFlush && isStraight && values.includes(13)) return 'Royal Flush';
    if(isFlush && isStraight) return 'Straight Flush';
    if(counts.includes(4)) return 'Four of a Kind';
    if(counts.includes(3) && counts.includes(2)) return 'Full House';
    if(isFlush) return 'Flush';
    if(isStraight) return 'Straight';
    if(counts.includes(3)) return 'Three of a Kind';
    if(counts.filter(c => c === 2).length === 2) return 'Two Pair';
    if(counts.includes(2)) return 'Pair';
    return 'High Card';
}

function getHandRank(handType) {
    const rankings = {
        'Royal Flush': 10,
        'Straight Flush': 9,
        'Four of a Kind': 8,
        'Full House': 7,
        'Flush': 6,
        'Straight': 5,
        'Three of a Kind': 4,
        'Two Pair': 3,
        'Pair': 2,
        'High Card': 1
    };
    return rankings[handType] || 0;
}

function findWinners(playerHands) {
    // Calculate hand rank for each player
    const playersWithRanks = playerHands.map(player => ({
        ...player,
        rank: getHandRank(player.result)
    }));
    
    // Find highest rank
    const highestRank = Math.max(...playersWithRanks.map(p => p.rank));
    
    // Find all players with the highest rank (winners)
    const winners = playersWithRanks.filter(p => p.rank === highestRank);
    
    return winners;
}
