function fetch(options, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", processRequest, false);
    xhr.open(options.method, options.url, true);
    xhr.send();

    function processRequest(e) {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status <= 399) {
                var response = JSON.parse(xhr.responseText);
                success(response, xhr)
            } else {
                console.log(xhr.responseText)
                error(xhr.responseText, xhr)
            }
        }
    }
}

module.exports = fetch;
