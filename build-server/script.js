const { exec } = require("child_process");

async function init() {
    console.log("Executing Script.js");

    const outDirPath = path.join(__dirname, "output");

    const p = exec(`cd ${outDirPath} && npm install  && npm run build`);

    //when the command is running we can see the output in the console
    p.stdout.on("data", (data) => {
        console.log(data.toString());
    });

    p.stdout.on("error", (err) => {
        console.error("Error:", err.toString());
    });

    p.on("close", () => {
        console.log(`Build Complete.`);
    });

}

init();