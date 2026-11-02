
// 1. Memory array with 16 values
let memory = [
    10, 20, 5, 30,
    40, 50, 3, 60,
    70, 80, 90, 2,
    100, 110, 120, 130
];

// 2. Register values
let registers = {
    AX: 25,
    BX: 40,
    CX: 15,
    DX: 60
};

// 3. Selected mode
let selectedMode = "immediate";

// 4. Display memory table
function displayMemory() {

    const table = document.getElementById("memoryTable");

    table.innerHTML = "";

    for (let i = 0; i < memory.length; i++) {

        table.innerHTML += `
            <div class="memory-cell" id="cell-${i}">
                <strong>Address: ${i}</strong>
                <br>
                Value: ${memory[i]}
            </div>
        `;
    }
}

// 5. Select addressing mode
function selectMode(mode) {

    selectedMode = mode;

    const buttons = document.querySelectorAll(".buttons button");

    buttons.forEach(function(button) {

        button.classList.remove("active");

        if (button.dataset.mode === mode) {
            button.classList.add("active");
        }

    });

    // Clear old highlights and messages
    document.querySelectorAll(".memory-cell").forEach(function(cell) {
        cell.classList.remove("highlight");
    });

    document.getElementById("result").textContent =
        mode.toUpperCase() + " addressing selected.";

    document.getElementById("steps").textContent =
        "Enter a value and click Find Operand.";
}

// 6. Highlight memory cell
function highlightCell(address) {

    const cell = document.getElementById("cell-" + address);

    if (cell) {
        cell.classList.add("highlight");
    }
}

// 7. Find operand
function findOperand() {

    // Clear old highlights
    document.querySelectorAll(".memory-cell").forEach(function(cell) {
        cell.classList.remove("highlight");
    });

    const input = document.getElementById("operandInput").value.trim();
    const result = document.getElementById("result");
    const steps = document.getElementById("steps");

    if (input === "") {
        result.textContent = "Please enter a value first.";
        steps.textContent = "";
        return;
    }

    let operand;

    // IMMEDIATE ADDRESSING
    if (selectedMode === "immediate") {

        const number = Number(input);

        if (!Number.isFinite(number)) {
            result.textContent = "Please enter a valid number.";
            steps.textContent = "";
            return;
        }

        operand = number;

        steps.innerHTML = `
            <p>Step 1: Immediate Addressing selected.</p>
            <p>Step 2: The entered value is the operand itself.</p>
            <p>Step 3: Operand = ${operand}</p>
            <p>No memory cell is accessed.</p>
        `;
    }

    // DIRECT ADDRESSING
    else if (selectedMode === "direct") {

        const address = Number(input);

        if (!Number.isInteger(address) || address < 0 || address >= 16) {
            result.textContent = "Enter a valid address from 0 to 15.";
            steps.textContent = "";
            return;
        }

        operand = memory[address];

        highlightCell(address);

        steps.innerHTML = `
            <p>Step 1: Direct Addressing selected.</p>
            <p>Step 2: Entered address = ${address}</p>
            <p>Step 3: Memory[${address}] = ${operand}</p>
            <p>Step 4: Operand = ${operand}</p>
        `;
    }

    // INDIRECT ADDRESSING
    else if (selectedMode === "indirect") {

        const address = Number(input);

        if (!Number.isInteger(address) || address < 0 || address >= 16) {
            result.textContent = "Enter a valid address from 0 to 15.";
            steps.textContent = "";
            return;
        }

        const secondAddress = memory[address];

        if (!Number.isInteger(secondAddress) ||
            secondAddress < 0 || secondAddress >= 16) {

            result.textContent =
                "The value at this address is not a valid memory address.";

            steps.textContent = "";
            return;
        }

        operand = memory[secondAddress];

        highlightCell(address);
        highlightCell(secondAddress);

        steps.innerHTML = `
            <p>Step 1: Indirect Addressing selected.</p>
            <p>Step 2: First address = ${address}</p>
            <p>Step 3: Memory[${address}] = ${secondAddress}</p>
            <p>Step 4: Memory[${secondAddress}] = ${operand}</p>
            <p>Step 5: Operand = ${operand}</p>
        `;
    }

    // REGISTER ADDRESSING
    else if (selectedMode === "register") {

        const registerName = input.toUpperCase();

        if (registers[registerName] === undefined) {
            result.textContent = "Enter AX, BX, CX or DX.";
            steps.textContent = "";
            return;
        }

        operand = registers[registerName];

        steps.innerHTML = `
            <p>Step 1: Register Addressing selected.</p>
            <p>Step 2: Selected register = ${registerName}</p>
            <p>Step 3: Register value = ${operand}</p>
            <p>Step 4: Operand = ${operand}</p>
            <p>No memory cell is accessed.</p>
        `;
    }

    result.textContent = "Final Operand: " + operand;
}

// 8. Connect all four mode buttons
document.querySelectorAll(".buttons button").forEach(function(button) {

    button.addEventListener("click", function() {
        selectMode(button.dataset.mode);
    });

});

// 9. Connect Find Operand button
document.getElementById("findButton").addEventListener("click", findOperand);

// 10. Display memory when page opens
displayMemory();

// 11. Set Immediate as the default mode
selectMode("immediate");
