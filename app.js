const util = require('util');
const vm = require('vm');

const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.sendFile( __dirname + "/index.html" );
});

const bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

app.post('/code', function (req, res) {

  console.log(req.body);

  let output = '';

  const consoleCapture = {
    log: (x) => {output = `${output}${x}\n`}
  };

  const sandbox = {
    console: consoleCapture,
    require: require
  };

  try {
    vm.runInNewContext(req.body.code, sandbox, {displayErrors: true, filename: 'thefile.js' });
  } catch (e) {
    console.log("MESSAGE", e.message);
    console.log("STACK", e.stack);
    const stacks = e.stack.split("\n");
    const err = `${stacks[0]}\n${stacks[1]}`;
    output = `${output}${err}\n`
  }
  console.log('output: '+ output);
  res.end(output);
});

