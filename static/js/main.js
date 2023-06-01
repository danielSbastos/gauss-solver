  const rowsSelect = document.getElementById("rows");
  const colsSelect = document.getElementById("cols");
  const table = document.getElementById("my-table");
  const resultsContainer = document.getElementById("results-container");
  const solveButton = document.getElementById("solve-btn");
  const stepsList = document.getElementById("steps-list");

  solveButton.addEventListener("click", solveMatrix);

  function solveMatrix() {
    stepsList.innerHTML = ""
    // Check that all inputs are filled
    const inputElements = Array.from(table.getElementsByTagName("input"));
    for (let i = 0; i < inputElements.length; i++) {
      if (!inputElements[i].value) {
        alert("Please fill in all input fields");
        return;
      }
    }
    const resultElements = Array.from(resultsContainer.getElementsByTagName("input"));
    for (let i = 0; i < resultElements.length; i++) {
      if (!resultElements[i].value) {
        alert("Please fill in all result fields");
        return;
      }
    }

    // Get the matrix values from the input elements
    const matrix = [];
    for (let i = 0; i < table.getElementsByTagName("mtr").length; i++) {
      const row = table.getElementsByTagName("mtr")[i];
      matrix.push([]);
      for (let j = 0; j < row.getElementsByTagName("mtd").length; j++) {
        const cell = row.getElementsByTagName("mtd")[j];
        const input = cell.getElementsByTagName("input")[0];
        matrix[i][j] = parseFloat(input.value);
      }
    }

    // Get the result values from the result elements
    const results = [];
    for (let i = 0; i < resultElements.length; i++) {
      results.push(parseFloat(resultElements[i].value));
    }

    // Add zero rows or columns as necessary to make matrix square
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    if (numRows < numCols) {
      for (let i = numRows; i < numCols; i++) {
        matrix.push(new Array(numCols).fill(0));
      }
    } else if (numCols < numRows) {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = numCols; j < numRows; j++) {
          matrix[i][j] = 0;
        }
      }
    }

    fetch("http://127.0.0.1:5000?" + new URLSearchParams({
        x: matrix.join("|"),
        y: results,
    }),
      { mode: 'cors' }
    )
      .then((response) => response.json())
      .then((json) => {
        document.getElementById("result").innerText = json['data']
      });
  }
  
  colsSelect.addEventListener("change", updateTable);

  function updateTable() {
    // Get the new row and column count
    const newRow = parseInt(rowsSelect.value);
    const newCol = parseInt(colsSelect.value);
    // Get the existing input elements in the results container
    const existingInputElements = resultsContainer.getElementsByTagName("input");
    
    // Add or remove rows as necessary
    while (table.getElementsByTagName("mtr").length < newRow) {
      const newRowElement = document.createElement("mtr");
      for (let i = 0; i < newCol; i++) {
        const newCellElement = document.createElement("mtd");
        const newInputElement = document.createElement("input");
        newInputElement.type = "number";
        newInputElement.classList.add("form-control");
        newCellElement.appendChild(newInputElement);
        newRowElement.appendChild(newCellElement);
      }
      table.appendChild(newRowElement);
      
      const newResultInputElement = document.createElement("input");
      newResultInputElement.type = "number";
      newResultInputElement.classList.add("form-control");
      resultsContainer.appendChild(newResultInputElement);
    }
    while (table.getElementsByTagName("mtr").length > newRow) {
      table.removeChild(table.lastChild);
      
      resultsContainer.removeChild(resultsContainer.lastChild);
    }

    for (let i = 0; i < table.getElementsByTagName("mtr").length; i++) {
      const row = table.getElementsByTagName("mtr")[i];
      while (row.getElementsByTagName("mtd").length < newCol) {
        const newCellElement = document.createElement("mtd");
        const newInputElement = document.createElement("input");
        newInputElement.type = "number";
        newInputElement.classList.add("form-control");
        newCellElement.appendChild(newInputElement);
        row.appendChild(newCellElement);
      }
      while (row.getElementsByTagName("mtd").length > newCol) {
        row.removeChild(row.lastChild);
      }
    }
    
    while (existingInputElements.length < newRow) {
      const newResultInputElement = document.createElement("input");
      newResultInputElement.type = "number";
      newResultInputElement.classList.add("form-control");
      resultsContainer.appendChild(newResultInputElement);
    }
    while (existingInputElements.length > newRow) {
      resultsContainer.removeChild(resultsContainer.lastChild);
    }
  }

  // Listen for changes in the input elements
  table.addEventListener("input", handleInput);

  function handleInput(event) {
    const inputElement = event.target;
    const row = inputElement.closest("mtr");
    const col = inputElement.closest("mtd");
    const rowIndex = Array.from(table.getElementsByTagName("mtr")).indexOf(row);
    const colIndex = Array.from(row.getElementsByTagName("mtd")).indexOf(col);
  }
