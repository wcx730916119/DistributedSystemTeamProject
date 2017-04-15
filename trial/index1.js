var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:42586");

client.on("error", function(error) {
    console.error("RPC client error:", error);
});

client.invoke("GetLine", "rajkiran holy", function(error, res, more) {
    if(error) {
        console.error(error);
    } else {
        console.log("UPDATE:", res);
    }

    if(!more) {
        console.log("Done.");
    }
});

