var jsonrpc = require('json-rpc-client');

// create client and connect
var client = new jsonrpc({ port: 1234, host: '127.0.0.1'})
client.connect().then(function()
{
    console.log( "connection established" );
    client.send('GetLine', "something").then(function(reply)
    {
        console.log( "iraj kiran connection established" );
        // print complete reply
        console.log(reply)
    },
    //transport errors
    function(error)
    {
        console.error(error)
    })
},
function(error)
{
    console.error(error)
});
