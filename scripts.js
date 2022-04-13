function enterTheRoom() {
    const userName = document.querySelector(".user-name").value
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: userName})
    promise.then(successConection)
}

function renderMessenges() {

}

function successConection() {
    alert("Conectado")
}