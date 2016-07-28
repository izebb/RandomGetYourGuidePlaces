function fetch(options, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", processRequest, false);
    xhr.open(options.method, options.url, true);
    xhr.send();

    function processRequest(e) {
        if (xhr.readyState == 4) {
            var response = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status <= 399) {
                success(response, xhr)
            } else {
                error(response, xhr)
            }
        }
    }
}

module.exports = fetch;
