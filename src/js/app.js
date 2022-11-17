"use strict";
const tellsyouornot = percent(10, 16, 27);
const plansornot = percent(2, 59, 65);
const bethereornot = percent(2, 79, 81);
console.log("lucasstory" + tellsyouornot);
console.log("plans" + plansornot);
console.log("bethereornot" + bethereornot);
const lie1 = percent(3, true, false);
const lie2 = percent(10, true, false);
let text;
let relation;
let myInterval;
let audioT;
//funktion för att kunna ge slumpmässighet till spelet
//man sätter in percenten man vill ha i första parametern,
//det kommer att slumpa ett tal mellan 0 och den parametern,
//om det blir 0 så väljs andra parametern som nästa node
//om det blir något annat så väljs den tredje parametern
function percent(int, option1, option2) {
    let ran = Math.floor(Math.random() * int);
    let r;
    if (ran == 0) {
        r = option1;
    }
    else {
        r = option2;
    }
    return r;
}
// deklarerar variabler med HTMLelementen med id: text/option-buttons
const textStory = document.getElementById("text");
const responseButtonElement = document.getElementById("option-buttons");
const wText = document.getElementById("wText");
const storyContainer = document.getElementById("textContainer");
//declarerar text variablen
//lägger till funktionallitet på close knappen på chat fönstret in-game
const restart = document.getElementById("close");
restart.addEventListener("click", () => resetGame());
//resetar text variablen
//visar textnode 1
// clear localstorage
function resetGame() {
    text = "";
    wText.innerText = "";
    relation = 50;
    showTextNode(1);
    localStorage.clear();
    localStorage.setItem("relation", relation.toString());
    clearInterval(myInterval);
    audioT.pause();
}
let i = 0;
function writeText(str, num) {
    restart.disabled = true;
    audioT = new Audio("../sounds/keypress.mp3");
    let audioE = new Audio("../sounds/Enter.mp3");
    wText.innerHTML = "";
    i = 0;
    while (responseButtonElement.firstChild) {
        responseButtonElement.removeChild(responseButtonElement.firstChild);
    }
    audioT.play();
    if (str.length > 15) {
        myInterval = setInterval(() => {
            wText.innerHTML += str[i];
            i++;
            if (i == str.length) {
                audioT.pause();
                clearInterval(myInterval);
                setTimeout(() => {
                    audioE.play();
                    textStory.innerHTML = localStorage.getItem("story");
                    setTimeout(() => {
                        showTextNode(num);
                        storyContainer.scrollTop = 999999999999;
                        restart.disabled = false;
                    }, 1000);
                    storyContainer.scrollTop = 999999999999;
                    wText.innerHTML = "";
                }, 400);
            }
        }, 35);
    }
    else {
        myInterval = setInterval(() => {
            wText.innerHTML += str[i];
            i++;
            if (i == str.length) {
                audioT.pause();
                clearInterval(myInterval);
                setTimeout(() => {
                    audioE.play();
                    textStory.innerHTML = localStorage.getItem("story");
                    setTimeout(() => {
                        showTextNode(num);
                        storyContainer.scrollTop = 999999999999;
                        restart.disabled = false;
                    }, 1000);
                    storyContainer.scrollTop = 999999999999;
                    wText.innerHTML = "";
                }, 400);
            }
        }, 100);
    }
}
//Gör en variabel med informationen av objectet med ID man vill visa.
//Lägger till texten i textnoden som visas
//lägger till texten i localstorage "story"
//sätter texten på skärmen genom att ta informationen från local storage "story"
//tar bort tidigare svarsalternativ (knapparna)
//för varje knapp som finns i den textnoden så skapas det knappar beroende på antal options
//sepciellt lägger till en EventListener som kör selectOption functionen på knappen man klickat på
function showTextNode(textNodeIndex) {
    const textNode = textNodes.find((textNode) => textNode.id === textNodeIndex);
    text += textNode?.text + " <hr> ";
    localStorage.setItem("story", text);
    textStory.innerHTML = localStorage.getItem("story");
    while (responseButtonElement.firstChild) {
        responseButtonElement.removeChild(responseButtonElement.firstChild);
    }
    textNode?.options.forEach((option) => {
        const button = document.createElement("button");
        const buttonStyle = "btn text-left border-l-[0.3vh] border-t-[0.3vh] border-b-[0.3vh] border-b-gray-900 border-r-[0.3vh] border-r-gray-900 bg-gray-400 hover:bg-gray-300 my-[1%] py-2 px-4 w-fit h-[7vh] text-[2.2vh] text-gray-800 font-bold overflow-y-auto";
        button.innerHTML = option.text;
        button.classList.add(...buttonStyle.split(" "));
        button.addEventListener("click", () => selectOption(option));
        responseButtonElement.appendChild(button);
    });
    storyContainer.scrollTop = 999999999999;
}
//om man klickar på en knapp
//skapar en variabel som tar in "nextText id" som bestämmer vilken textnod som ska visas efter knapptrycket
//lägger till texten på knappen till text variablen som sedan visas på skärmen
//sparar nästa id i localstorage för så att man kan hamna på samma plats om man refreshar sidan
//om texten är "Restart." så kör den resetGame functionen
async function selectOption(option) {
    // const nextTextNodeId = option.nextText;
    const incRelation = option.relationInc;
    if (option.text == "continue") {
        text += "";
        showTextNode(option.nextText);
    }
    else {
        if (option.nextText == null) {
            text += option.text + " <hr> ";
            localStorage.setItem("story", text);
            if (relation >= option.relation.meter) {
                writeText(option.text, option.relation.nextText1);
                localStorage.setItem("id", convertIdToString(option.relation.nextText1));
            }
            else {
                writeText(option.text, option.relation.nextText2);
                localStorage.setItem("id", convertIdToString(option.relation.nextText2));
            }
        }
        else {
            text += option.text + " <hr> ";
            localStorage.setItem("story", text);
            writeText(option.text, option.nextText);
            localStorage.setItem("id", convertIdToString(option.nextText));
        }
    }
    if (option.text == "Restart.") {
        resetGame();
    }
    if (option.nextText == 19) {
        localStorage.setItem("EE", "777");
    }
    if (option.incRelation == true) {
        relation += 10;
        localStorage.setItem("relation", relation.toString());
        console.log("increased relation");
    }
    else if (option.incRelation == false) {
        relation -= 10;
        localStorage.setItem("relation", relation.toString());
        console.log("decreased relation");
    }
    console.log(incRelation);
}
//funktion för att konvertera ett ID till en string så att det går att spara i localStorage.
function convertIdToString(number) {
    let id = number.toString();
    return id;
}
const textNodes = [
    {
        // Day 1
        id: 666,
        text: "you failed... restart and try again.",
        options: [
            {
                text: "Restart.",
                nextText: 1,
            },
        ],
    },
    {
        // Day 1
        id: 1,
        text: "",
        options: [
            {
                text: "You: Hi",
                nextText: 2,
            },
            {
                text: "You: Hello!",
                nextText: 2,
            },
            {
                text: "You: Sup!",
                nextText: 2,
            },
        ],
    },
    // 1/1
    {
        id: 2,
        text: "Lucas: Afternoon",
        options: [
            {
                text: "You: How are you? it's been a long time since a saw you.",
                nextText: 4,
            },
            {
                text: "You: Wanna meet?",
                nextText: 3,
            },
        ],
    },
    // 1/1/2
    {
        id: 3,
        text: "Lucas: Not right now",
        options: [
            {
                text: "You: Alright I understand",
                nextText: 666,
            },
        ],
    },
    // 1/1/1
    {
        id: 4,
        text: "Lucas: I'm alright. Yes, it sure has been a long time since we last met, what are you doing nowadays?",
        options: [
            {
                text: "You: (Lie) I went to college and got my degree",
                incRelation: lie1,
                nextText: 5,
            },
            {
                text: "You: (Tell the truth) I dropped out of college",
                incRelation: true,
                nextText: 6,
            },
            {
                text: "You: (Talk about something else) Are you free this week?",
                nextText: 10,
                incRelation: true,
            },
        ],
    },
    // 1/1/1/1
    {
        id: 5,
        text: "Lucas: How nice",
        options: [
            {
                text: "continue",
                nextText: 13,
            },
        ],
    },
    // 1/1/1/2
    {
        id: 6,
        text: "Lucas: Oh really, what happened?",
        options: [
            {
                text: "You: It was too much work",
                nextText: 7,
            },
            {
                text: "You: I found something else",
                nextText: 8,
            },
        ],
    },
    // 1/1/1/2/1
    {
        id: 7,
        text: "Lucas: Been there, felt that.",
        options: [
            {
                text: "continue",
                nextText: 13,
            },
        ],
    },
    // 1/1/1/2/2
    {
        id: 8,
        text: "Lucas: Oh what are you doing?",
        options: [
            {
                text: "You: (Lie) I started my own software company",
                incRelation: lie2,
                nextText: 9,
            },
            {
                text: "You: I'm working at KFC",
                incRelation: true,
                nextText: 9,
            },
        ],
    },
    // 1/1/1/2/1-2
    {
        id: 9,
        text: "Lucas: How fun",
        options: [
            {
                text: "continue",
                nextText: 13,
            },
        ],
    },
    // 1/1/1/3
    {
        id: 10,
        text: "Lucas: I'm going to meet my cousin and his friend today, otherwise I might be free, depends if something comes up.",
        options: [
            {
                text: "You: How fun, tell Niclas i said hi!",
                incRelation: true,
                nextText: 11,
            },
            {
                text: "You: Do you think I can come along?",
                incRelation: false,
                nextText: 12,
            },
        ],
    },
    // 1/1/1/3/1
    {
        id: 11,
        text: "Lucas: haha, maybe",
        options: [
            {
                text: "continue",
                nextText: 13,
            },
        ],
    },
    // 1/1/1/3/2
    {
        id: 12,
        text: "Lucas: no",
        options: [
            {
                text: "You: alright :c",
                nextText: 666,
            },
        ],
    },
    // End message of day 1
    {
        id: 13,
        text: "Lucas: I have to go, nice talking to you :)",
        options: [
            {
                text: "Start Day 2",
                nextText: 14,
            },
        ],
    },
    // day 2
    // 2
    {
        id: 14,
        text: "",
        options: [
            {
                text: "You: Hello, how are you doing??",
                incRelation: true,
                nextText: 15,
            },
        ],
    },
    // 2/1
    {
        id: 15,
        text: "Lucas: Not that well :(",
        options: [
            {
                text: "You: Wanna talk about it?",
                incRelation: true,
                nextText: tellsyouornot,
            },
            {
                text: "You: Thats sad",
                nextText: 27,
            },
        ],
    },
    // 2/1/1 hidden Lucas secret
    {
        id: 16,
        text: "Lucas: My cousin's best friend died",
        options: [
            {
                text: "continue",
                nextText: 18,
            },
        ],
    },
    // 2/1/1/1/1
    {
        id: 18,
        text: "Lucas: He was in a bicycle accident",
        options: [
            {
                text: "continue",
                incRelation: true,
                nextText: 19,
            },
        ],
    },
    // 2/1/1/1/1/1
    {
        id: 19,
        text: "Lucas: I always hate... liked Niclas, he was such a good friend",
        options: [
            {
                text: "continue",
                nextText: 21,
            },
        ],
    },
    // 2/1/1/1/1/1/1/1
    {
        id: 21,
        text: "Lucas: ...",
        options: [
            {
                text: "continue",
                nextText: 22,
            },
        ],
    },
    // 2/1/1/1/1/1/1/1/1
    {
        id: 22,
        text: "Lucas: So anyway, are you coming to the party on friday?",
        options: [
            {
                text: "You: Yeah I'm for sure gonna be there, what about you?",
                incRelation: true,
                nextText: 23
            },
            {
                text: "You: I don't think so, what about you?",
                incRelation: false,
                nextText: 25
            },
        ],
    },
    // 2/1/1/1/1/1/1/1/1/1
    {
        id: 23,
        text: "Lucas: I don't think so, something came up",
        options: [
            {
                text: "continue",
                nextText: 24,
            },
        ],
    },
    // 2/1/1/1/1/1/1/1/1/1/1
    {
        id: 24,
        text: "Lucas: I hope you have fun at the party",
        options: [
            {
                text: "continue",
                nextText: 34
            }
        ],
    },
    // 2/1/1/1/1/1/1/1/1/2
    {
        id: 25,
        text: "Lucas: I don't think so, got plans",
        options: [
            {
                text: "continue",
                nextText: 26,
            },
        ],
    },
    // 2/1/1/1/1/1/1/1/1/2/1
    {
        id: 26,
        text: "Lucas: I hope you have fun at the party if you change your mind",
        options: [
            {
                text: "continue",
                nextText: 34
            }
        ],
    },
    // 2/1/2
    {
        id: 27,
        text: "Lucas: nvm it's nothing",
        options: [
            {
                text: "continue",
                nextText: 28,
            },
        ],
    },
    // 2/1/2/1
    {
        id: 28,
        text: "Lucas: You coming to the party on Friday?",
        options: [
            {
                text: "You: Yeah I'm gonna be there",
                incRelation: true,
                nextText: 36,
            },
            {
                text: "You: I don't think so",
                incRelation: false,
                nextText: 29,
            },
        ],
    },
    // 2/1/2/1/1
    {
        id: 29,
        text: "",
        options: [
            {
                text: "You: Are you coming?",
                incRelation: true,
                nextText: 30,
            },
        ],
    },
    // 2/1/2/1/1/1
    {
        id: 30,
        text: "Lucas: I don't think so, got plans",
        options: [
            {
                text: "continue",
                nextText: 31,
            },
        ],
    },
    // 2/1/2/1/1/2
    {
        id: 31,
        text: "Lucas: Besides I don't think it gonna be that fun anyways",
        options: [
            {
                text: "You: I think you should go to the party",
                incRelation: false,
                nextText: 32,
            },
            {
                text: "You: Have fun with your plans",
                incRelation: true,
                nextText: 35,
            },
        ],
    },
    {
        id: 32,
        text: "Lucas: I'll think about it",
        options: [
            {
                text: "continue",
                nextText: 33,
            },
        ],
    },
    {
        id: 33,
        text: "Lucas: I hope you have fun at the party if you change your mind",
        options: [
            {
                text: "continue",
                nextText: 34,
            },
        ],
    },
    {
        id: 34,
        text: "Lucas: I have to go, see ya later!",
        options: [
            {
                text: "Start Day 3",
                nextText: 42,
            },
        ],
    },
    {
        id: 35,
        text: "Lucas: I will",
        options: [
            {
                text: "continue",
                nextText: 33,
            },
        ],
    },
    {
        id: 36,
        text: "",
        options: [
            {
                text: "You: Are you coming?",
                nextText: 37,
            },
        ],
    },
    {
        id: 37,
        text: "Lucas: I don't think so, got plans",
        options: [
            {
                text: "continue",
                nextText: 38,
            },
        ],
    },
    {
        id: 38,
        text: "Lucas: Besides I don't think it gonna be that fun anyways",
        options: [
            {
                text: "You: I think you should go to the party",
                incRelation: false,
                nextText: 39,
            },
            {
                text: "You: Have fun with your plans",
                incRelation: true,
                nextText: 41,
            },
        ],
    },
    {
        id: 39,
        text: "Lucas: I'll think about it",
        options: [
            {
                text: "continue",
                incRelation: true,
                nextText: 40,
            },
        ],
    },
    {
        id: 40,
        text: "Lucas: I hope you have fun at the party atleast",
        options: [
            {
                text: "continue",
                incRelation: true,
                nextText: 34,
            },
        ],
    },
    {
        id: 41,
        text: "Lucas: I will",
        options: [
            {
                text: "continue",
                nextText: 39,
            },
        ],
    },
    // day 3
    {
        id: 42,
        text: "",
        options: [
            {
                text: "You: Good morning",
                nextText: 43,
            },
        ],
    },
    {
        id: 43,
        text: "Lucas: Afternoon",
        options: [
            {
                text: "You: how are things?",
                incRelation: true,
                nextText: 44,
            },
        ],
    },
    {
        id: 44,
        text: "Lucas: Okay could be better",
        options: [
            {
                text: "You: What could be better?",
                incRelation: true,
                nextText: 45,
            },
            {
                text: "You: (change topic) Just got a new car, it has like 150 horsepowers",
                incRelation: false,
                nextText: 70
            },
        ],
    },
    {
        id: 45,
        text: "Lucas :Me and my friends had something planned for the weekend but they said I was annoying and that they didnt want me there, now I have nothing to do anymore",
        options: [
            {
                text: "You: they didn't deserve you anyway",
                incRelation: true,
                nextText: 46,
            },
            {
                text: "You: They were too good for you anyways",
                incRelation: false,
                nextText: 55
            },
        ],
    },
    {
        id: 46,
        text: "...",
        options: [
            {
                text: "You: Besides I think you will be more happy without them",
                incRelation: true,
                nextText: 47,
            },
        ],
    },
    {
        id: 47,
        text: "Lucas: Thanks, I suppose I will",
        options: [
            {
                text: "You: I don't think I would ever do that to you",
                incRelation: true,
                nextText: 48
            },
            {
                text: "You: You should come to the party instead, it will get your mind of of them",
                nextText: 52
            },
        ],
    },
    {
        id: 48,
        text: "...",
        options: [
            {
                text: "You: How would you like to go out with me instead?",
                nextText: 49
            },
        ],
    },
    {
        id: 49,
        text: "Lucas: I don't think I'm ready for another relationship right now",
        options: [
            {
                text: "You: I understand",
                nextText: 50
            },
            {
                text: "You: I think you're making a mistake",
                incRelation: false,
                nextText: 51
            },
        ],
    },
    {
        id: 50,
        text: "Lucas: Well thanks for being so understanding, I have to go",
        options: [
            {
                text: "Start Day 4",
                incRelation: true,
                nextText: 75
            }
        ],
    },
    {
        id: 51,
        text: "...",
        options: [
            {
                text: "You: I'm a niceguy",
                incRelation: false,
                nextText: 666
            },
        ],
    },
    {
        id: 52,
        text: "Lucas: Can you stop trying to force me to come to the party?!?!?",
        options: [
            {
                text: "You: I'm sorry",
                nextText: 666
            },
        ],
    },
    {
        id: 53,
        text: "Lucas: Nah something happened last minute and had to cancel",
        options: [
            {
                text: "You: In that case, you should come to the party",
                incRelation: true,
                nextText: 54
            },
        ],
    },
    {
        id: 54,
        text: "Lucas: I will. Thanks, I have to go",
        options: [
            {
                text: "Start Day 4",
                nextText: 75
            },
        ],
    },
    {
        id: 55,
        text: "Lucas: Thanks for that...",
        options: [
            {
                text: "You: I didn't mean it like that",
                incRelation: true,
                nextText: 56
            },
            {
                text: "You: I'm just saying the truth",
                incRelation: false,
                nextText: 58
            },
        ],
    },
    {
        id: 56,
        text: "...",
        options: [
            {
                text: "You: You were too good for him*",
                incRelation: true,
                nextText: 57
            },
        ],
    },
    {
        id: 57,
        text: "Lucas: Well thanks, I have to go",
        options: [
            {
                text: "Play Day 4",
                nextText: 11
            },
        ],
    },
    {
        id: 58,
        text: "...",
        options: [
            {
                text: "You: Do you still have plans?",
                relation: {
                    meter: 60,
                    nextText1: 59,
                    nextText2: 65
                }
            },
        ],
    },
    {
        id: 59,
        text: "Lucas: Nah something happened last minute and had to cancel ",
        options: [
            {
                text: "You: In that case, you should come to the party",
                nextText: 60
            },
        ],
    },
    {
        id: 60,
        text: "Lucas: I think I will",
        options: [
            {
                text: "You: That's great",
                nextText: 61
            },
            {
                text: "You: Want to meet up later tomorrow?",
                relation: {
                    meter: 80,
                    nextText1: 62,
                    nextText2: 63
                }
            },
        ],
    },
    {
        id: 61,
        text: "Lucas: See you later I have to go",
        options: [
            {
                text: "Play Day 4",
                nextText: 59
            },
        ],
    },
    {
        id: 62,
        text: "Lucas: Yeah, sure!",
        options: [
            {
                text: "You: Then its a date!",
                incRelation: true,
                nextText: 64
            },
        ],
    },
    {
        id: 63,
        text: "Lucas: haha funny, but no thanks",
        options: [
            {
                text: "continue",
                incRelation: false,
                nextText: 64
            },
        ],
    },
    {
        id: 64,
        text: "Lucas: haha! See you later, funny guy",
        options: [
            {
                text: "Start day 4",
                nextText: 75
            },
        ],
    },
    {
        id: 65,
        text: "Lucas: They are the same so far",
        options: [
            {
                text: "You: Okay I hope you have fun",
                nextText: 66
            },
            {
                text: "You: I think you should rethink your plans and come to the party",
                nextText: 68
            },
        ],
    },
    {
        id: 66,
        text: "Lucas: I will",
        options: [
            {
                text: "continue",
                nextText: 67
            },
        ],
    },
    {
        id: 67,
        text: "Lucas: I will",
        options: [
            {
                text: "Start Day 4",
                nextText: 75
            },
        ],
    },
    {
        id: 68,
        text: "Lucas: I might idk yet",
        options: [
            {
                text: "You: I would like to have you there",
                incRelation: true,
                nextText: 69
            },
            {
                text: "You: It will be fun",
                nextText: 69
            },
        ],
    },
    {
        id: 69,
        text: "Lucas: I'll think about it",
        options: [
            {
                text: "Start Day 4",
                nextText: 75
            },
        ],
    },
    {
        id: 70,
        text: "Lucas: That's awsome",
        options: [
            {
                text: "You: I know right, if you go out with me on Friday I'll let you drive it",
                incRelation: false,
                nextText: 71
            },
            {
                text: "You: Indeed it is",
                nextText: 72
            },
        ],
    },
    {
        id: 71,
        text: "Lucas: I can't be bought like that",
        options: [
            {
                text: "You: Cmon, its brand new!",
                nextText: 666
            },
        ],
    },
    {
        id: 72,
        text: "...",
        options: [
            {
                text: "You: I'm thinking about getting an even newer one for Christmas",
                incRelation: false,
                nextText: 73
            },
        ],
    },
    {
        id: 73,
        text: "Lucas: I wish I had that kinda money ",
        options: [
            {
                text: "continue",
                nextText: 74
            },
        ],
    },
    {
        id: 74,
        text: "Lucas: Anyways I have to go see ya later",
        options: [
            {
                text: "Start day 4",
                nextText: 75
            },
        ],
    },
    {
        id: 75,
        text: "",
        options: [
            {
                text: "You: Hello! Have you heard about this new bar?",
                nextText: 76
            },
        ],
    },
    {
        id: 76,
        text: "",
        options: [
            {
                text: "You: I heard it pretty awesome",
                nextText: 77
            },
        ],
    },
    {
        id: 77,
        text: "Lucas: Oh really? what's it called",
        options: [
            {
                text: "You: Botan bar",
                nextText: 78
            },
        ],
    },
    {
        id: 78,
        text: "Lucas: Cool",
        options: [
            {
                text: "You: We should go there later today, I heard they have a pretty decent menu",
                nextText: bethereornot
            },
            {
                text: "You: Planning on going there later this evening ",
                nextText: 83
            },
        ],
    },
    {
        id: 79,
        text: "Lucas: I'll be there",
        options: [
            {
                text: "You: Great can't wait",
                nextText: 80
            },
        ],
    },
    {
        id: 80,
        text: "Lucas: Have to go, see you later today",
        options: [
            {
                text: "Go to the party",
                nextText: 80
            },
        ],
    },
    {
        id: 81,
        text: "Lucas: I'm sorry I something really important came up.",
        options: [
            {
                text: "continue",
                nextText: 82
            },
        ],
    },
    {
        id: 82,
        text: "Lucas: we can go on a date someother time see you some other time",
        options: [
            {
                text: "Go to the party",
                nextText: 420
            },
        ],
    },
    {
        id: 83,
        text: "Lucas: Really. Are you going there with someone?",
        options: [
            {
                text: "You: I was hoping you would come",
                nextText: 84
            },
            {
                text: "You: Yeah me and Niclas are gonna be there ",
                nextText: 82
            },
        ],
    },
    {
        id: 84,
        text: "Lucas: idk, I don't have any money",
        options: [
            {
                text: "You: I'll pay for the first drink if you come ;)",
                nextText: 85
            },
            {
                text: "You: That's fine you can repay me by coming to the party tomorrow ",
                nextText: 87
            },
        ],
    },
    {
        id: 85,
        text: "Lucas: In that case I'll be there",
        options: [
            {
                text: "continue",
                nextText: 86
            },
        ],
    },
    {
        id: 86,
        text: "Lucas: See you later :)",
        options: [
            {
                text: "continue",
                relation: {
                    meter: 100,
                    nextText1: 6969,
                    nextText2: 420
                }
            },
        ],
    },
    {
        id: 420,
        text: "You went to the party and everything went...",
        options: [
            {
                text: "continue",
                relation: {
                    meter: 80,
                    nextText1: 421,
                    nextText2: 423
                }
            },
        ],
    },
    {
        id: 421,
        text: "Good!",
        options: [
            {
                text: "continue",
                nextText: (localStorage.getItem("EE") == "777") ? 777 : 422
            },
        ],
    },
    {
        id: 422,
        text: "Lucas confessed his love for you and asked you out on a date while drunk.",
        options: [
            {
                text: "Complete Story",
                nextText: 999
            },
        ],
    },
    {
        id: 423,
        text: "You asked Lucas on a date and he confessed his love for his other friend.",
        options: [
            {
                text: "Go home sad",
                nextText: 666
            },
        ],
    },
    {
        id: 777,
        text: "You were walking home, and you saw bright blue lights",
        options: [
            {
                text: "continue",
                nextText: 778
            },
        ],
    },
    {
        id: 778,
        text: "It was the police, they ran and arrested Lucas before you could react!",
        options: [
            {
                text: "Next day",
                nextText: 779
            },
        ],
    },
    {
        id: 779,
        text: "You couldn't believe your eyes, what you saw on the TV was Lucas pleading guilty to killing his cousins best friend",
        options: [
            {
                text: "Next day",
                nextText: 780
            },
        ],
    },
    {
        id: 780,
        text: "You read in the paper that Lucas killed his cousins best friend because he was furious after he dumped Lucas",
        options: [
            {
                text: "Complete story",
                nextText: 999
            },
        ],
    },
    {
        id: 999,
        text: "<br> Thank you for playing our game 'Better Call Lucas' we hope you enjoyed it!, there are multiple endings so you can always go back and try for another one!",
        options: [
            {
                text: "Restart.",
                nextText: 1
            },
        ],
    },
    {
        id: 6969,
        text: "You and Lucas went out on a date and ended up in a relationship!",
        options: [
            {
                text: "Complete story",
                nextText: 999
            },
        ],
    },
];
//om det inte finns något id sparat i local storage så startar spelet och visar textnod 1
//om det redan finns ett id i localstorage så går den till det IDt istället.
if (localStorage.getItem("id") === null) {
    text = "";
    showTextNode(1);
    relation = 50;
}
else {
    text = "";
    showTextNode(parseInt(localStorage.getItem("id")));
    relation = parseInt(localStorage.getItem("relation"));
}
