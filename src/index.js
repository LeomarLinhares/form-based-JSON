const electron = require('electron');
const path = require('path');
const fs = require('fs');
const dialog = electron.remote.dialog;

var loaded;
var save = document.querySelector('.button');
var file = document.querySelector('#file');

var inpName = document.querySelector('#name');
var inpAge = document.querySelector('#age');
var inpGender = document.querySelectorAll('input[type=radio]:checked')[0];
var inpFileName = document.querySelector('#filename');

file.addEventListener("change", event => {
    var readedFile = event.target.files[0];
    var reader = new FileReader();
    reader.onload = event => {
        // O arquivo de texto será impresso aqui
        loaded = event.target.result;
        console.log(loaded);

        var loaderObj = JSON.parse(loaded);

        inpName.value = loaderObj.name;
        inpAge.value = parseInt(loaderObj.age);

        if (loaderObj.gender === "male") {
            document.querySelector('#male').checked = true;
        } else if (loaderObj.gender === "female") {
            document.querySelector('#female').checked = true;
        } else if (loaderObj.gender === "other") {
            document.querySelector('#other').checked = true;
        }
    };

    reader.readAsText(readedFile);
})

save.addEventListener("click", (event) => {
    var stringfiedJSON = `
    {
        "name": "${inpName.value}",
        "age": "${inpAge.value}",
        "gender": "${inpGender.value}"
    }
    `;

    dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(__dirname, `../savedObjectNotations/${inpFileName.value}.JSON`),
        buttonLabel: 'Save',
        filters: [
            {
                name: 'JSON Files',
                extensions: ['JSON']
            }
        ],
        properties: []
    }).then(file => {
        console.log(file.canceled);
        if (!file.canceled) {
            console.log(file.filePath.toString());

            fs.writeFile(file.filePath.toString(), stringfiedJSON, (err) => {
                if (err) throw err;
                console.log('Saved!');
            })
        }
    }).catch(err => {
        console.log(err)
    })
})