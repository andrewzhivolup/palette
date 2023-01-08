const cols = document.querySelectorAll('.col')

/**
* Обработчик события нажатия клавиши на клавиатуре.
* При нажатии клавиши пробела вызывает функцию установки случайных цветов.
* @param {KeyboardEvent} event - объект события нажатия клавиши.
*/
document.addEventListener('keydown', (event) => {
    event.preventDefault()
    if (event.code.toLowerCase() === 'space') {
        setRandomColors()
    }
})

/**
* Обработчик события клика мышью.
* В зависимости от типа данных целевого элемента, вызывает соответствующие функции:
* * переключение состояния блокировки цвета
* * копирование цвета в буфер обмена
@param {MouseEvent} event - объект события клика мышью.
*/
document.addEventListener('click', (event) => {
    const type = event.target.dataset.type
    if (type === 'lock') {
        const node =
            event.target.tagName.toLowerCase() === 'i'
                ? event.target
                : event.target.children[0]

        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
    } else if (type === 'copy') {
        copyToClickboard(event.target.textContent)
    }
})

/**
* Копирует указанный текст в буфер обмена.
* @param {string} text - Текст, который нужно скопировать в буфер обмена.
*/
function copyToClickboard(text) {
    return navigator.clipboard.writeText(text)
}

/**
* Устанавливает случайные цвета для элементов списка.
* @param {boolean} isInitial - флаг, указывающий на то, что цвета устанавливаются впервые.
*/
function setRandomColors(isInitial) {
    const colors = isInitial ? getColorsFromHash() : []

    cols.forEach((col, index) => {
        const isLocked = col.querySelector('i').classList.contains('fa-lock')
        const text = col.querySelector('h2')
        const button = col.querySelector('button')

        if (isLocked) {
            colors.push(text.textContent)
            return
        }

        const color = isInitial
            ? colors[index]
                ? colors[index]
                : chroma.random()
            : chroma.random()

        if (!isInitial) {
            colors.push(color)
        }

        text.textContent = color
        col.style.background = color

        setTextColor(text, color)
        setTextColor(button, color)
    })

    updateColorsHash(colors)
}

/**
* Устанавливает цвет текста элемента в зависимости от освещенности указанного цвета.
* @param {HTMLElement} text - Элемент, у которого нужно изменить цвет текста.
* @param {string} color - Цвет, освещенность которого нужно учитывать при выборе цвета текста.
*/
function setTextColor(text, color) {
    const luminance = chroma(color).luminance()
    text.style.color = luminance > 0.5 ? 'black' : 'white'
}

/**
* Обновляет хэш URL указанными цветами.
* @param {string[]} [colors=[]] - Массив шестнадцатеричных кодов цветов для обновления хэша URL.
*/
function updateColorsHash(colors = []) {
    document.location.hash = colors
        .map((col) => {
            return col.toString().substring(1)
        })
        .join('-')
}

/**
* Извлекает цвета из текущего URL хэша и возвращает их в виде массива строк.
* @returns {string[]} Массив строк с шестнадцатеричными кодами цветов.
*/
function getColorsFromHash() {
    if (document.location.hash.length > 1) {
        return document.location.hash
            .substring(1)
            .split('-')
            .map((color) => '#' + color)
    }
    return []
}

setRandomColors(true)
