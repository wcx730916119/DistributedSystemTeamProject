/* exported trace */

// Logging utility function.
function trace(message) {
    let now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ': ', message);
}
