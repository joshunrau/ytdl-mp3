const fs = require('fs');
const main = require('./main');

const videoURL = "https://www.youtube.com/watch?v=X5OdGEqYkOc";

jest.setTimeout(30000);

test("main", async () => {
    let filePath = await main(videoURL);
    expect(fs.existsSync(filePath)).toBe(true);
    fs.rmSync(filePath);
});