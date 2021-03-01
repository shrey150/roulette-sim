const npl = require("nodeplotlib");
const fib = require("fibonacci");

// "FIB" or "ALEX"
const METHOD = "FIB";

const P_WIN = 12/38;
const P_LOSE = 26/38;

const MIN_BET = 0.1;
const MAX_BET = 1000;

const BASE_BET = 0.1;
const MULTIPLIER = 2;
const CASH_OUT = 0;
const BASE_AMT = 1000;

let bet = METHOD === "ALEX" ? 0.1 : 1;
let amt = 1000;
let cash = -BASE_AMT;

const x = [];

const bet_y = [];
const roll_y = [];
const cash_y = [];

let fibIndex = 1;

for (let i = 0; i < 10000; i++) {

    amt -= bet;

    const roll = Math.random();

    // win
    if (roll <= P_WIN) {
        amt += bet * 3;
    } 

    const outcome = roll <= P_WIN ? "W" : "L";
    console.log(`#${i+1} (${outcome}) | BET: ${bet} | AMT: ${amt}`);
    
    x.push(i+1);
    roll_y.push(amt);
    bet_y.push(bet);

    // if win, reset to base amount
    if (roll <= P_WIN) {

        if (METHOD === "ALEX") {
            bet = BASE_BET;
        }
        else if (METHOD === "FIB") {
            // if you're on the 2nd number, just go back to the 1st
            fibIndex = fibIndex >= 3 ? fibIndex-2 : 1;
            bet = parseInt(fib.iterate(fibIndex).number);
        }
        
    }
    // if you lost
    else {

        if (METHOD === "ALEX") {

            // double the bet
            bet *= MULTIPLIER;
            
            // if bet is going from 0.4 -> 0.8, go to 1 instead
            bet = bet == 0.8 ? 1 : bet;

        }
        else if (METHOD === "FIB") {
            fibIndex++;
            bet = parseInt(fib.iterate(fibIndex).number);
        }

        // can't bet more than max amount
        bet = bet >= MAX_BET ? MAX_BET : bet;

        // can't bet more than you have
        bet = bet > amt ? amt : bet;
    }

    // if you go broke
    if (amt <= 0) {
        console.log("GAME OVER");
        break;
    }

    // cash out ONLY if CASH_OUT > 0
    if (CASH_OUT !== 0 && amt >= BASE_AMT + CASH_OUT) {
        cash += amt - BASE_AMT;
        amt = BASE_AMT;
        console.log("CASH OUT");
    }

    cash_y.push(cash);

}

const roll_data = [{x: x, y: roll_y, type: "line"}];
const bet_data = [{x: x, y: bet_y, type: "line"}];
const cash_data = [{x: x, y: cash_y, type: "line"}];

npl.stack(roll_data);
npl.stack(bet_data);
npl.stack(cash_data);
npl.plot();