var SIZE = 4; // Размер доски
var pairNumber = Math.pow(SIZE,2)/2; // Сколько пар цветов 
var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var time = 0;
var minutes = 0;
var seconds = 0;
var timerText = '00 : 00 : 00';
var isGameStarted = false;
var timerId;
var solved = []; // Массив решенных клеток
var key1 = ''; // Ключ(id) первой выбранной клетки
var key2 = ''; // Ключ(id) второй выбранной клетки

var timerDiv = document.createElement('div'); //новый div для таймера
timerDiv.className = 'timer';
timerDiv.innerHTML = timerText;
document.getElementById('timer-container').appendChild(timerDiv)



// Создаем массив случайных цветов
var colors = [];
var timesUsed = []; // Вспомогательный массив
for (var i = 0; i < pairNumber; i++ ) {
    colors[i] = getRandomColor(); 
    timesUsed[i] = 0;
}
colors_temp = colors; // Временные переменные
timesUsed_temp = timesUsed;


/* Создаем игровой словарь, содержащий id как ключ и цвет как значение
   Пример: 
   gameDict = {...
               'C3':'background: #FFF',
               'C4':'background: #F0A'
                                    ...}
*/
var gameDict = {};
var randomIndex; 
for (var i = 0; i < SIZE; i++ ) {
    for (var j = 0; j < SIZE; j++ ) {
        randomIndex = Math.floor(Math.random() * colors_temp.length); // Случайный индекс
        gameDict[alphabet[i] + (1+j)] = colors_temp[randomIndex]; // Пишем словарь ключ:цвет
        timesUsed_temp[randomIndex] += 1; // Увеличиваем количество использований цвета

        // Если использовали цвет два раза - удаляем его из массива
        if (timesUsed_temp[randomIndex] == 2) { 
            colors_temp.splice(randomIndex,1);
            timesUsed_temp.splice(randomIndex,1);
        }

    } 
}

// Создание визуала игровой доски - таблица
var gameTable = document.createElement('table');
gameTable.className = 'game_table';


for (var i = 0; i < SIZE; i++) {
    var tr = document.createElement('tr'); // Создаем элемент строки
    for (var j = 0; j < SIZE; j++) {
        var td = document.createElement('td'); // Создаем элемент столбца
        td.className = 'white';
        td.id = alphabet[j] + (i+1); // Присваиваем каждому элементу таблицы id (напр. id = 'A2')
        td.onclick = function() { clicked( this.id ) } // Добавляем реакцию на клик с передачей своего id
        tr.appendChild(td); // Подключаем столбец к строке
    }
    gameTable.appendChild(tr); // Подключаем строку к таблице
}
document.body.appendChild(gameTable) // Подключаем таблицу к body


// Начало игры, запуск таймера
function startGame(){
    isGameStarted = true;
    timerId = setInterval(updTimer,10); // обновлять таймер каждые 10ms
}

function endGame(){
    alert('Done! Your time is: ' + timerText)
}

// Функция для обновления таймера.
function updTimer(){
    timerText = '';
    time += 1/100; // время
    minutes = Math.floor(time/60); // минуты
    seconds = Math.floor(time) - minutes*60 // секунды
    if (minutes < 10) {
        timerText +='0' + minutes.toString(10) + ' : ';
    } else {
        timerText += minutes.toString(10) + ' : ';
    }
    if (seconds < 10) {
        timerText +='0' + seconds.toString(10) + ' : ';
    } else {
        timerText += seconds.toString(10) + ' : ';
    }
    if ( (100*(time-Math.floor(time))).toFixed(0) < 10 ){
        timerText += '0' + (100*(time-seconds)).toFixed(0);
    } else {
        if ( (100*(time-Math.floor(time))).toFixed(0) < 99.9 ){
            timerText += (100*(time-Math.floor(time))).toFixed(0);
        }
    }
    timerDiv.innerHTML = timerText; // Вывод времени
}

// Функция рандомного цвета, возвращает '#hex'
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return  color;
}

// Очистка клеток по ключам(id)
function clearTable(key1,key2) {
    document.getElementById(key1).style = '';
    document.getElementById(key2).style = '';
}


// Функция для запускающаяся при нажатии
// Принимает key - id элемента в виде, например 'B3'
function clicked(key){

    // Вспомогательная функция для solved.some()
    function isSolved(some_key){
        return key == some_key; 
    }

    if ( ! solved.some(isSolved) && isGameStarted ) { // Если клетки не относятся к решенным и игра началась
        if (key1 == '') { // Если первый ключ пустой, то пишем в него, меняем цвет
            key1 = key;
            document.getElementById(key1).style = 'background: ' + gameDict[key1];
        } else { // Если первый ключ не пустой - записываем key в key2 и проверяем на совпадение цветов
            key2 = key;
            document.getElementById(key2).style = 'background: ' + gameDict[key2];
            if ( gameDict[key1] == gameDict[key2] ) { 
                solved.push(key1,key2) // Если цвета совпадают, добавить к массиву решенных id клеток
                key1 = '';
                key2 = '';
                // Если размер массива решенных совпадает с количеством клеток - закончить игру
                if (solved.length == Math.pow(SIZE,2)) {
                    isGameStarted = false;
                    clearInterval(timerId);
                    setTimeout(endGame,100);
                }
            } else { // Если цвета не совпали, подождать и стереть
                setTimeout(clearTable,500,key1,key2);
                key1 = '';
                key2 = '';
            }
        }
    }
}
