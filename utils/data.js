const names = [
    'Winslow',
    'Marcus',
    'Raydon',
    'Randell',
    'Peter',
    'Parker',
    'Bruce',
    'Wayne',
    'Jake',
    'Amy',
    'Terry',
    'Rose',
    'Gina',
    'Holt',
   'Chubbs',
    'Hitchcock',
    'Scully',
    'Michael',
    'Janet',
    'Jason',
    'Chidi',
    'Eleanor',
    'Tahani',
    'Shawn',
    'Derek'
]

const getRandomName = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomName = () =>
    `${getRandomName(names)}`

module.exports = { randomName }