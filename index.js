import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import * as model from '@tensorflow-models/mobilenet';

window.loadFile = function (event) {
  var img = document.getElementById('img');
  img.src = URL.createObjectURL(event.target.files[0]);
  img.onload = function () {
    URL.revokeObjectURL(img.src);
    predict(img);
  }
}

let predict = function (img) {
  model.load({version: 2, alpha: 1}).then(model => {
    model.classify(img, 5).then(predictions => {
      if (document.getElementById('table')) { document.getElementById('table').remove() }
      generateTable(predictions);
    })
  });
};

let generateTable = function (predictions) {
  let body = document.getElementById('result');
  
  let table = document.createElement('table');
  let tableBody = document.createElement('tbody');
  table.id = 'table';

  // add the first row
  let row = document.createElement('tr');
  // add titles
  let col1 = document.createElement('td');
  col1.appendChild(document.createTextNode('Class name'));
  row.appendChild(col1);
  let col2 = document.createElement('td');
  col2.appendChild(document.createTextNode('Probability'));
  row.appendChild(col2);
  // add to tableBody
  tableBody.appendChild(row);

  for (let i = 0; i < predictions.length; i++) {
    let row = document.createElement('tr');

    for (const property in predictions[i]) {
      let cell = document.createElement('td');
      let value = predictions[i][property];
      if (typeof value === 'number') { value = (value*100).toFixed(2) + '%' }
      let cellText = document.createTextNode(value);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  }

  table.appendChild(tableBody);
  body.appendChild(table);
  table.setAttribute('border', '1');
}