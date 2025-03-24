google.charts.load("current", { packages: ["gantt"] });

const predefinedTasks = [
    { name: "Project topic deciding", duration: 7 },
    { name: "Collecting data", duration: 8 },
    { name: "Problem Definition", duration: 3 },
    { name: "System design", duration: 16 },
    { name: "Problem evaluation", duration: 7 },
    { name: "Define function and behaviour", duration: 15 },
    { name: "Requirement analysis", duration: 43 },
    { name: "Implementation and coding", duration: 54 },
    { name: "Unit testing", duration: 24 },
    { name: "Integration and Validation", duration: 38 },
    { name: "System testing", duration: 11 }
];

function generateTasks() {
    let startMonth = document.getElementById("startMonth").value;
    let endMonth = document.getElementById("endMonth").value;

    if (!startMonth || !endMonth) {
        alert("Please select both start and end months!");
        return;
    }

    let startDate = new Date(startMonth + "-01");
    let endDate = new Date(endMonth + "-01");
    if (endDate < startDate) {
        alert("End date must be after start date!");
        return;
    }

    let tasks = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < predefinedTasks.length; i++) {
        let task = predefinedTasks[i];
        let start = new Date(currentDate);
        let finish = new Date(start);
        finish.setDate(start.getDate() + task.duration);

        tasks.push({
            id: i + 1,
            name: task.name,
            duration: task.duration,
            start: start.toISOString().split("T")[0],
            finish: finish.toISOString().split("T")[0]
        });

        currentDate = new Date(finish);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    tasks.reverse(); // Show in descending order
    updateTable(tasks);
    drawGanttChart(tasks);
}

function updateTable(tasks) {
    let table = document.getElementById("taskTable");
    table.innerHTML = "";
    tasks.forEach((task) => {
        let row = `<tr>
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.duration}</td>
            <td>${task.start}</td>
            <td>${task.finish}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

function drawGanttChart(tasks) {
    google.charts.setOnLoadCallback(() => {
        let data = new google.visualization.DataTable();
        data.addColumn("string", "Task ID");
        data.addColumn("string", "Task Name");
        data.addColumn("string", "Resource");
        data.addColumn("date", "Start Date");
        data.addColumn("date", "End Date");
        data.addColumn("number", "Duration");
        data.addColumn("number", "Percent Complete");
        data.addColumn("string", "Dependencies");

        tasks.forEach((task) => {
            data.addRow([
                `Task${task.id}`,
                task.name,
                null,
                new Date(task.start),
                new Date(task.finish),
                null,
                100,
                null
            ]);
        });

        let options = {
            height: 500,
            gantt: {
                trackHeight: 30
            }
        };

        let chart = new google.visualization.Gantt(document.getElementById("ganttChart"));
        chart.draw(data, options);
    });
}