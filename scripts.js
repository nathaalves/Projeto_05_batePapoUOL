
let userName = ""

function enterTheRoom() {
    userName = document.querySelector(".user-name").value
    const conection = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: userName})
    
    conection.then(function () {
        setInterval(keepConnection, 4000)
        requestMessages()
    })
    
}

function renderMessenges() {

}

function requestMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    console.log(promise)
    promise.then(function (response) {
        console.log(response.data)
    })
    promise.catch(function (error) {
        console.log(error.response.status)
        console.log(error.response.data)
    })
}

function keepConnection() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: userName})
    promise.then(function () {
        console.log("conectado")
    })
}


