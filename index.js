document.addEventListener("DOMContentLoaded", function () {
    const codeInput = document.getElementById("codeInput");
    const getBigOBtn = document.getElementById("getBigOBtn");
    const resultShow = document.getElementById("resultShow");

    getBigOBtn.addEventListener("click", function () {
        resultShow.innerHTML = ""; // Clear previous results
        
        if (!codeInput.value.trim()) {
            resultShow.textContent = "⚠️ Please enter some code!";
            return;
        }

        const linesOfCode = codeInput.value.split("\n").map(line => line.trim());
        const statements = getLoopAndRecursionStatements(linesOfCode);
        const { timeComplexity, spaceComplexity } = getBigONotation(statements);

        console.log("Time:", timeComplexity, "Space:", spaceComplexity); // Debugging
        resultShow.innerHTML = `<strong>🕒 Time Complexity:</strong> ${timeComplexity} <br><strong>💾 Space Complexity:</strong> ${spaceComplexity}`;
    });
});




    // Extracts for-loops, while-loops, and recursive function statements
    function getLoopAndRecursionStatements(linesOfCode) {
        let statements = [];
        let recursionFunctions = new Set();
        let level = 1;

        linesOfCode.forEach(line => {
            if (line.includes("for") || line.includes("while")) {
                statements.push({ type: "loop", line, level: level++ });
            }
            if (line.includes("function") && line.includes("(")) {
                let functionName = line.match(/function\s+(\w+)\(/);
                if (functionName) recursionFunctions.add(functionName[1]);
            }
            if (Array.from(recursionFunctions).some(fn => line.includes(fn + "("))) {
                statements.push({ type: "recursion", line, level: level++ });
            }
            if (line.includes("}")) level--;
        });

        return statements;
    }

    // Evaluates time and space complexity
    function evaluateStatement(statement) {
        if (statement.type === "loop") {
            return { time: "O(N)", space: "O(1)", level: statement.level }; // Assume linear loop
        } else if (statement.type === "recursion") {
            return evaluateRecursionStatement(statement);
        }
        return { time: "err", space: "err", level: statement.level };
    }

    // Evaluates recursive function complexity (time & space)
    function evaluateRecursionStatement(statement) {
        let line = statement.line;
        let timeComplexity = "err";
        let spaceComplexity = "err";

        if (line.includes("return") && line.includes("(")) {
            let recursiveCalls = (line.match(/\w+\(/g) || []).length;

            if (recursiveCalls === 1) {
                if (line.includes("-1") || line.includes("+1")) {
                    timeComplexity = "O(N)";
                    spaceComplexity = "O(N)"; // Stack grows linearly
                } else if (line.includes("/2") || line.includes("*2")) {
                    timeComplexity = "O(log N)";
                    spaceComplexity = "O(log N)"; // Stack reduces logarithmically
                }
            } else if (recursiveCalls === 2) {
                timeComplexity = "O(2^N)";
                spaceComplexity = "O(2^N)"; // Stack grows exponentially
            } else if (line.includes("!")) {
                timeComplexity = "O(N!)";
                spaceComplexity = "O(N!)";
            }
        }

        return { time: timeComplexity, space: spaceComplexity, level: statement.level };
    }

    // Determines the overall Big-O complexity from loops and recursion
    function getBigONotation(statements) {
        let timeResults = [];
        let spaceResults = [];

        statements.forEach(statement => {
            let { time, space, level } = evaluateStatement(statement);
            timeResults.push({ complexity: time, level });
            spaceResults.push({ complexity: space, level });
        });

        return {
            timeComplexity: aggregateComplexity(timeResults),
            spaceComplexity: aggregateComplexity(spaceResults),
        };
    }

    // Aggregates complexity results into a final Big-O notation
    function aggregateComplexity(results) {
        let bigOString = "";
        results.forEach(({ complexity }) => {
            if (complexity !== "err") {
                bigOString += complexity.replace("O(", "").replace(")", "") + " ";
            }
        });

        return `O(${bigOString.trim()})`;
    }

    // Button click event to analyze complexity
    getBigOBtn.addEventListener("click", function () {
        if (!codeInput.value.trim()) {
            resultShow.textContent = "Please enter some code!";
            return;
        }

        const linesOfCode = codeInput.value.split("\n").map(line => line.trim());
        const statements = getLoopAndRecursionStatements(linesOfCode);
        const { timeComplexity, spaceComplexity } = getBigONotation(statements);
            console.log(timeComplexity, spaceComplexity);
        resultShow.innerHTML = `<strong>Time Complexity:</strong> ${timeComplexity}
        <br>
       <strong>Space Complexity:</strong> ${spaceComplexity}`;
    });

