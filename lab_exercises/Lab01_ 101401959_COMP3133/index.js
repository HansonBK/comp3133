const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const inputFile = path.join(__dirname, "input_countries.csv");
const canadaFile = path.join(__dirname, "canada.txt");
const usaFile = path.join(__dirname, "usa.txt");


if (fs.existsSync(canadaFile)) fs.unlinkSync(canadaFile);
if (fs.existsSync(usaFile)) fs.unlinkSync(usaFile);


const canadaStream = fs.createWriteStream(canadaFile, { flags: "a" });
const usaStream = fs.createWriteStream(usaFile, { flags: "a" });

const header = "country,year,population\n";
canadaStream.write(header);
usaStream.write(header);

fs.createReadStream(inputFile)
  .pipe(csv())
  .on("data", (row) => {
    
    const country = (row.country || "").trim().toLowerCase();

    if (country === "canada") {
      canadaStream.write(`${row.country},${row.year},${row.population}\n`);
    }

    
    if (country === "united states" || country === "united states of america") {
      usaStream.write(`${row.country},${row.year},${row.population}\n`);
    }
  })
  .on("end", () => {
    canadaStream.end();
    usaStream.end();
    console.log("✅ Done! Created canada.txt and usa.txt");
  })
  .on("error", (err) => {
    console.error("❌ Error reading CSV:", err.message);
  });
