import Phaser from "phaser";
import card from "./assets/cardBack_green5.png";
import cursor from "./assets/cursorGauntlet_grey.png";
import left from "./assets/arrowSilver_left.png";
import right from "./assets/arrowSilver_right.png";
import buy from "./assets/buy.png";
import swal from 'sweetalert';

// import font from "./assets/sheet.png";
// import fontXML from "./assets/sheet.xml";

const suits = [
	'Spades',
	'Hearts',
	'Clubs',
	'Diamonds'
]

const values = [
	'2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
]

const getCardName = (suit, value) => {
	setPoints(suit, value);
	return `card${suit}${value}`
}

let suitIndex = 0;
let valueIndex = -1;
let cards = [];
let ScorePoints = [];

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  },scale: {
	// Fit to window
	mode: Phaser.Scale.FIT,
	// Center vertically and horizontally
	autoCenter: Phaser.Scale.CENTER_BOTH,
    }
};

// sizes of game
const width = 800;
const height = 600;
const x = width * 0.5;
const y = height * 0.5;
let cardName = '';
let points;
let tips;

let coin;
let insertedCoins;
let buyButton;

const game = new Phaser.Game(config);

function currentSuit()
{
	//fiz para estar random entre as figuras das cartas
	var randomNumber = Math.floor(Math.random()*suits.length);

	return suits[randomNumber]
}

function currentValue()
{
	//fiz o random para estar random os numeros das cartas
	var randomNumber = Math.floor(Math.random()*values.length);
	
	if (randomNumber < 0)
	{
		return values[0]
	}

	return values[randomNumber]
}

function currentCardName()
{
	return getCardName(currentSuit(), currentValue())
}

function preload() { 
  this.load.image("card-back", card);
  this.load.image("cursor", cursor);
  this.load.image("left", left);
  this.load.image("right", right);
  this.load.image("buy", buy);
//   this.load.bitmapFont('sheet',font,fontXML);
//   this.load.bitmapFont('sheet','src/assets/sheet.png','src/assets/sheet.xml');
  
   points = this.add.text(x - 80,y - 150, "BlackJack Points: 0");
   tips = this.add.text(x - 300 ,y - 220, "");
   coin = this.add.text(x - 300 ,y - 220, "0");
   coin.setDepth(5); 
   coin.setStyle({
	font: 'bold 30px Arial',
	fill: 'black'
	});
	
	insertedCoins = 0;
}

function updateCoins(coins) {
	insertedCoins = coins + 10;
	coin.setText(insertedCoins);
    console.log(insertedCoins);
}

function lostCoins(coins){
	insertedCoins = coins - 10;
	coin.setText(insertedCoins);
    console.log(insertedCoins);
}

function insertCoins(){
	swal({
		title: "Oh no!",
		text: "You need 10 coins to continue!",
		icon: "warning",
		button: "Ok!",
		}).then((value)=>{
		game.scene.resume("default");
		});
}

function create()
{	console.log("create");
// this.add.bitmapText(0, 0, 'sheet', 'Hello World');
	buyButton = this.add.image(x - 300, y - 200, 'buy');
	buyButton.setScale(0.2);
	buyButton.setInteractive() 
	.on('pointerdown', () => updateCoins(insertedCoins));
	


	if (this.textures.exists(cardName))
{
	// texture already exists so just create a card and return it
	return this.add.image(x, y, cardName)
}

let cardback = this.add.image(x, y, 'card-back');


//arrows exemple
let left = this.add.image(x + 140, y + 150, 'left');
this.add.text(x + 160,y + 140, "Key Left: Next Card");
let right = this.add.image(x + 140, y + 200, 'right');
this.add.text(x + 160,y + 190, "Key Right: Remove Card");


	const leftArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
	leftArrow.on('up', () => {
		
		if(insertedCoins <= 0){
			insertCoins();
			return;
		}else if(insertedCoins < 10){
			insertCoins();
			return;
		}
		console.log("left");

		
		cards.forEach(card => {
			card.x -= 20
		})


		cardName = currentCardName();
		
		// carreganto texturas
		let card = this.add.image(x, y, 'card-back')

		// load no plugin phaser para carregar minhas cartas
		this.load.image(cardName, `src/assets/${cardName}.png`);
		this.load.once(Phaser.Loader.Events.COMPLETE, () => {
			// texture loaded so use instead of the placeholder
			card.setTexture(cardName)
		})
		this.load.start()
	

		cards.push(card)
		console.log(cards);
		
	})

	

	const rightArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
	rightArrow.on('up', () => {
		console.log("right");
		if (cards.length <= 0)
		{
			return
		}

		const card = cards.pop();
		if(card === null){
			console.log('can not be null');
		}
		card.destroy();
		
		cards.forEach(card => {
			card.x += 20
		})
	})

	// const topArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP) 
	// topArrow.on('up', () => {
	// 	console.log("top arrow");
	// 	this.scene.restart(game);
	// })
}


function setPoints(suit, value){
	console.log(suit);
	console.log(value);

	let point;
	switch (value) {
		case 'A':
			point = 11;
			break;
		case 'J':
		case 'Q':
		case 'K':
			point = 10;
			// expected output: "Mangoes and papayas are $2.79 a pound."
			break;
		default:
			point = value;
}

	ScorePoints.push(point.toString());



	const reducer = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);
	const myTotal = ScorePoints.reduce(reducer);
	
	points.setText("Points: "+ myTotal);

	gameStatus(myTotal);
}

function gameStatus(myTotal){

	if(myTotal == 20 || myTotal == 19){
		game.scene.pause("default");

		points.setText("Points: "+ myTotal);
		tips.setText("Are you sure?");

		swal({
			title: "WAIT!",
			text: "It's really close to 21! take a deep breath and go!",
			icon: "warning",
			button: "GO!",
		    }).then((value)=>{
			game.scene.resume("default");
		    });
		
	}

	if(myTotal > 21){
		game.scene.pause("default");

		points.setText("Points: "+ myTotal);
		tips.setText("GAME OVER");
		swal({
			title: "GAME OVER",
			text: "Try again because for now, I'ts really GAME OVER",
			icon: "error",
			button: "Reload",
		    }).then((value)=>{
			
			if(value == true){
				location.reload();
			}
		    });

			lostCoins(insertedCoins);
		
	}

	if(myTotal == 21){
		game.scene.pause("default");

		points.setText("Points: "+ myTotal);
		tips.setText("WIN!!!! CONGRATS!");
		swal({
			title: "YOU WIN!",
			text: "BLACKJACK!!!",
			icon: "success",
			button: "GO!",
		    }).then((value)=>{
			    if(value != true){
				location.reload();
			    }else{
				location.reload();
			    }
			
		    });

			updateCoins(insertedCoins);
		// game.scene.pause("default");
	}
	
}