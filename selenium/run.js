const {Builder, logging, By} = require('selenium-webdriver');
const server = require('./webserver');
const util = require('util');

const loggingPreferences = new logging.Preferences();
loggingPreferences.setLevel(logging.Type.BROWSER, logging.Level.ALL);

if (process.argv.length < 3) {
    console.log('Please specify local IP');
    return;
}

const ip = process.argv[2];

server.listen(6969);

(async () => {
    let driver = await new Builder()
        .usingServer('http://localhost:4444/wd/hub')
        .forBrowser('chrome')
        .setLoggingPrefs(loggingPreferences)
        .build();
    try {
        await driver.get('http://' + ip + ':6969');
        await driver.findElement(By.id('culprit')).click();

        const logs = await driver.manage().logs().get(logging.Type.BROWSER);

        let errorReport = logs[0].message;
        errorReport = errorReport.substr(logs[0].message.indexOf('"'));
        errorReport = JSON.parse(JSON.parse(errorReport));

        console.log(util.inspect(errorReport, false, null, true));
    } catch (e) {
        console.error(e);
    } finally {
        await driver.quit();
        await server.close();
    }
})();
