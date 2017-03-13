export function initiateDefaults() {

    var url = document.location.href;
    if (url.indexOf("basket") == -1) {
        var items = [];
        sessionStorage.setItem("basketCount", "0");
        sessionStorage.setItem("basketItems", JSON.stringify(items));
    }
}