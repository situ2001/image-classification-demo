import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import * as model from '@tensorflow-models/mobilenet';

const modelLoaded = model.load({version:2, alpha:1});

window.loadFile = function (event) {
  var img = document.getElementById('img');
  img.src = URL.createObjectURL(event.target.files[0]);
  img.onload = function () {
    URL.revokeObjectURL(img.src);
    predict(img);
  }
}

const predict = function (img) {
  modelLoaded.then(model => {
    model.classify(img, 5).then(predictions => {
      if (document.getElementById('table')) { document.getElementById('table').remove() }
      generateTable(predictions);
    })
  });
};

const generateTable = function (predictions) {
  const body = document.getElementById('result');
  
  const table = document.createElement('table');
  const tableBody = document.createElement('tbody');
  table.id = 'table';

  // add the first row
  const row = document.createElement('tr');
  // add titles
  const col1 = document.createElement('td');
  col1.appendChild(document.createTextNode('Class name'));
  row.appendChild(col1);
  const col2 = document.createElement('td');
  col2.appendChild(document.createTextNode('Probability'));
  row.appendChild(col2);
  // add to tableBody
  tableBody.appendChild(row);

  for (let i = 0; i < predictions.length; i++) {
    const row = document.createElement('tr');

    for (const property in predictions[i]) {
      const cell = document.createElement('td');
      let value = predictions[i][property];
      if (typeof value === 'number') { value = (value*100).toFixed(2) + '%' }
      const cellText = document.createTextNode(value);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  }

  table.appendChild(tableBody);
  body.appendChild(table);
  table.setAttribute('border', '1');
}