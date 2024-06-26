async function generateCode() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let length = 20;
    let groupSize = 5;
    let separator = '-';

    let randomCode = '';

    for (let i = 0; i < length; i++) {
        if (i > 0 && i % groupSize === 0) {
            randomCode += separator;
        }
        let randomIndex = Math.floor(Math.random() * characters.length);
        randomCode += characters.charAt(randomIndex);
    }

    return randomCode;
};

module.exports = generateCode;