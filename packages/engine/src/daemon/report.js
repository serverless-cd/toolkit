const { Report } = require('./libs');

(async () => {
  try {
    console.log('********Starting report in daemon********');

    // Exit process when offline
    setTimeout(process.exit, 1000 * 30);
    const data = JSON.parse(process.argv[2]);
    console.log(`data=${JSON.stringify(data)}`);
    await new Report(data).start();

    console.log('********report successfully in daemon********');
    // Call process exit explicitly to terminate the child process,
    // otherwise the child process will run forever, according to the Node.js docs
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
