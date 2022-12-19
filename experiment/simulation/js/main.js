class List {
    constructor() {
        this.numOfCards = 8;
        this.num = [];
    };
};
let list = new List();

let experiments = ['list-practice', 'list-learn', 'dictionary-learn', 'dictionary-practice', 'set-learn', 'set-practice']
let datatypes = ['list', 'dictionary', 'set']
window.onload = () => {
    let curr = localStorage.getItem('currentExperiment')
    if (curr) {
        curr = JSON.parse(curr)
        document.getElementsByClassName('list-learn')[0].style.display = 'none'
        document.getElementsByClassName('list-learn')[1].style.display = 'none'
        // document.getElementsByClassName('list')[0].style.display = 'none'
        let ele = document.getElementsByClassName(`${curr.type}-${curr.mode}`)
        ele[0].style.display = 'flex'
        if (ele.length > 1)
            ele[1].style.display = 'block'
        // document.getElementsByClassName(`${curr.type}`)[0].style.display = 'block'
        document.getElementById("experiment").value = curr.type
        document.getElementById("mode").value = curr.mode
    }
    if (!curr || curr.type == 'list') {
        if (!curr || curr.mode == 'learn')
            addElements()
        else
            randomise()
    }
}

function changeExperiment() {
    let datatype = document.getElementById("experiment").value
    let mode = document.getElementById("mode").value
    localStorage.setItem('currentExperiment', JSON.stringify({ "type": datatype, "mode": mode }));
    experiments.forEach(exp => {
        let element = document.getElementsByClassName(exp)
        console.log(`${datatype}-${mode}`)
        if (exp === `${datatype}-${mode}`) {
            element[0].style.display = 'flex'
            if (element.length > 1)
                element[1].style.display = 'block'
        } else {
            element[0].style.display = 'none'
            if (element.length > 1)
                element[1].style.display = 'none'
        }
    });
    if (datatype == 'list' && mode == 'learn')
        addElements()
}

function showInstructions() {
    let ele = document.getElementsByClassName("instruction-button")[0]
    ele.classList.toggle("active");
    let content = ele.nextElementSibling;
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

function rebuild() {
    var classesToFill = [...document.getElementsByClassName("cards")]
    classesToFill.forEach(classToFill => {
        var newdiv = document.createElement("div");
        newdiv.outerHTML = "<br><br>"
        for (var i = 0; i < list.numOfCards; i++) {
            var temp = document.createElement("div");
            temp.className = "card";
            temp.innerHTML = list.num[i];
            temp.style.fontStyle = "normal";
            temp.style.color = "white";
            classToFill.appendChild(temp);
        }
        classToFill.appendChild(newdiv)
        list.flag = 0;
    })
}

function addElements() {
    clear()
    list.numOfCards = 8
    for (var i = 0; i < list.numOfCards; i++) {
        if (i != list.numOfCards - 1)
            list.num[i] = i + 1;
        else
            list.num[i] = i + 10;
    }
    do {
        list.num.sort(() => Math.random() - 0.5)
    } while (list.num.every((x, i) => i == 0 || x >= list.num[i - 1]));
    let index = list.num.findIndex((ele) => ele == list.numOfCards + 9)
    list.num[index] = list.num[list.numOfCards - 1];
    list.num[list.numOfCards - 1] = list.numOfCards + 9;
    let code = document.getElementById("input-list")
    code.innerHTML = `list = [${list.num}]\n`;
    rebuild()
};

function clear() {
    const rems = [...document.getElementsByClassName('cards')];
    rems.forEach(rem => {
        while (rem.firstChild) {
            rem.removeChild(rem.lastChild);
        }
    })
};

function randomise() {
    let obs = document.getElementById('list-practice-observation')
    obs.innerHTML = ''
    list.numOfCards = 8
    for (var i = 0; i < list.numOfCards; i++) {
        list.num[i] = Math.floor(Math.random() * 90 + 10);
    }
    rebuild()
};

function reload() {
    location.reload(true);
};

function process(operation) {
    let obs = document.getElementById("list-learn-observation")
    obs.classList.remove('green')
    obs.classList.remove('red')
    clear()
    if (operation == 'pop()') {
        list.numOfCards -= 1;
        list.num.pop();
        obs.innerHTML = 'Removed element at the end of the list'
    } else if (operation == 'remove(8)') {
        let index = list.num.findIndex((a) => a == 8);
        if (index > -1) {
            list.numOfCards -= 1;
            list.num.splice(index, 1)
            obs.innerHTML = 'Removed 8 from the list'
        } else {
            obs.innerHTML = 'The list did not contain 8 to remove'
        }
    } else if (operation == 'append(8)') {
        list.numOfCards += 1;
        list.num[list.numOfCards - 1] = 8;
        obs.innerHTML = 'Added 8 to end of the list'
    } else if (operation == 'reverse()') {
        list.num.reverse()
        obs.innerHTML = 'Reversed the list'
    } else if (operation == 'sort()') {
        list.num.sort();
        obs.innerHTML = 'Sorted the list'
    } else if (operation == 'insert(0,8)') {
        list.numOfCards += 1;
        list.num.splice(0, 0, 8);
        obs.innerHTML = 'Inserted 8 at index 0 in the list'
    }
    rebuild();
}

function submitListLearn() {
    let obs = document.getElementById('list-learn-observation')
    let elements = [...document.getElementsByClassName('blank-list')]
    let blank = false
    elements.forEach(ele => {
        if (ele.innerHTML == "Blank") {
            blank = true
        }
    })
    if (blank) {
        obs.innerHTML = 'Match all blanks with a python operation.'
    } else {
        let sub = document.getElementsByClassName('submit')[0]
        sub.disabled = true
        let time = 1
        process(elements[0].innerHTML)
        if (elements[0].innerHTML !== 'pop()') {
            obs.innerHTML = 'You went wrong in this operation! Reset to try again.'
            obs.classList.add('red')
            return
        }
        let answer = ['append(8)', 'sort()', 'reverse()']
        let interval = setInterval(() => {
            if (time < elements.length) {
                process(elements[time].innerHTML)
                if (elements[time].innerHTML !== answer[time - 1]) {
                    obs.innerHTML = 'You went wrong in this operation! Reset to try again.'
                    obs.classList.add('red')
                    return
                }
                time++
            } else if (time == elements.length) {
                let ans = [8, 7, 6, 5, 4, 3, 2, 1]
                if (ans.join() == list.num.join()) {
                    obs.innerHTML = 'You successfully completed the experiment!'
                    obs.classList.add('green')
                } else {
                    obs.innerHTML = 'The order of operations is incorrect! Please reset and try again'
                    obs.classList.add('red')
                }
                time++
            } else {
                sub.disabled = false
                console.log(sub.disabled)
                clearInterval(interval)
            }
        }, 2500);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {

    function handleDragStart(e) {
        this.style.opacity = '0.4';

        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';

        items.forEach(function (item) {
            item.classList.remove('over');
        });
    }

    function handleDragOver(e) {
        e.preventDefault();
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        e.stopPropagation(); // stops the browser from redirecting.
        if (dragSrcEl !== this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }

        return false;
    }

    let items = document.querySelectorAll('.option');
    items = [...items, ...document.querySelectorAll('.blank')];
    items.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
    });
});

function submitListPractice() {
    let val = document.getElementsByClassName("list-practice-command")[0].value
    let obs = document.getElementById('list-practice-observation')
    document.getElementsByClassName("list-practice-command")[0].value = ''
    val = val.split('.')
    let error = (msg = 'Enter a valid python function from the list of supported functions') => {
        obs.classList.add('red')
        obs.innerHTML = msg
    }
    let message = (msg) => {
        obs.classList.remove('red')
        obs.innerHTML = msg
    }
    let checkNumber = (num) => {
        if (!parseInt(num) && num != '0') {
            error('Enter a number')
            rebuild()
            return
        }
    }
    if (val[0] !== 'list') {
        error()
        return;
    }
    val = val[1]
    let args = /\(([^)]+)\)/.exec(val)
    if (args) {
        args = args[1]
        args = args.split(',')
    }
    let func = /([^)]+)\(/.exec(val)
    if (!func) {
        error()
        return
    }
    func = func[1]
    clear()
    switch (func) {
        case 'append':
            if (!args || args.length != 1)
                error()
            else {
                if (list.numOfCards < 12) {
                    checkNumber(args[0])
                    list.numOfCards += 1;
                    list.num.push(parseInt(args[0]))
                    message(`You added ${args[0]} to the list`)
                } else
                    error('You have exceeded maximum number of elements in the list')
            }
            break;
        case 'pop':
            if (args)
                error()
            else {
                if (list.numOfCards > 0) {
                    list.numOfCards -= 1
                    list.num.pop()
                    message(`You removed the last element from the list`)
                } else
                    error('The list is empty')
            }
            break;
        case 'sort':
            if (args)
                error()
            else {
                list.num.sort((a, b) => a - b)
                message("You sorted the list")
            }
            break;
        case 'reverse':
            if (args)
                error()
            else {
                list.num.reverse()
                message("You reversed the list")
            }
            break;
        case 'clear':
            if (args)
                error()
            else {
                list.numOfCards = 0;
                list.num.reduce((x) => false)
                message("You cleared the list")
            }
            break
        case 'count':
            if (!args || args.length != 1)
                error()
            else {
                checkNumber(args[0])
                let find = parseInt(args[0]), count = 0
                list.num.forEach(x => { if (x == find) count++ })
                message(`The count of ${find} is ${count}`)
            }
            break
        case 'remove':
            if (!args || args.length != 1)
                error()
            else {
                checkNumber(args[0])
                if (list.numOfCards > 0) {
                    let rem = parseInt(args[0])
                    let index = list.num.findIndex((a) => a == rem);
                    if (index > -1) {
                        list.numOfCards -= 1;
                        list.num.splice(index, 1)
                        obs.innerHTML = `Removed ${rem} from the list`
                    } else {
                        obs.innerHTML = `The list did not contain ${rem} to remove`
                    }
                } else
                    error('The list is empty')
            }
            break;
        case 'insert':
            if (!args || args.length != 2)
                error()
            else {
                checkNumber(args[0])
                checkNumber(args[1])
                if (list.numOfCards < 12) {
                    list.numOfCards += 1;
                    list.num.splice(parseInt(args[0]), 0, parseInt(args[1]))
                    message(`You added ${args[1]} at index ${args[0]} in the list`)
                } else
                    error('You have exceeded maximum number of elements in the list')
            }
            break;
        default:
            error()
            break;
    }
    rebuild()
}

function enterTextField(event) {
    if (event.key == 'Enter') {
        event.preventDefault();
        document.getElementById('list-practice-submit').click();
    }
}
/* Touch API for mobile phones
// Get the container element where the drag and drop interface will be displayed
const container = document.getElementById("drag-and-drop-container");

// Get the tiles and blank spaces elements
const tiles = container.querySelectorAll(".tile");
const blanks = container.querySelectorAll(".blank");

// Keep track of the currently dragged tile
let currentTile = null;

// Handle the touchstart event on the tiles
tiles.addEventListener("touchstart", (event) => {
  // Get the element that was touched
  const touchedElement = event.target;
  // Check if the touched element is a tile
  if (tiles.contains(touchedElement)) {
    // Set the currently dragged tile to the touched element
    currentTile = touchedElement;
    // Add the "dragging" class to the tile to apply a visual effect
    currentTile.classList.add("dragging");
  }
});

// Handle the touchmove event on the container
container.addEventListener("touchmove", (event) => {
  // Check if there is a current tile being dragged
  if (currentTile) {
    // Update the position of the tile based on the touch event coordinates
    currentTile.style.left = event.touches[0].clientX + "px";
    currentTile.style.top = event.touches[0].clientY + "px";
  }
});

// Handle the touchend event on the container
container.addEventListener("touchend", (event) => {
  // Check if there is a current tile being dragged
  if (currentTile) {
    // Remove the "dragging" class from the tile to remove the visual effect
    currentTile.classList.remove("dragging");

    // Check if the tile is dropped on a blank space
    for (const blank of blanks) {
      if (blank.contains(currentTile)) {
        // If so, place the tile in the blank space
        blank.appendChild(currentTile);
        break;
      }
    }
    // Set the current tile to null
    currentTile = null;
  }
});
*/