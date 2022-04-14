
let userName = ""
let messagesInformation =[]

function enterTheRoom() {
    userName = document.querySelector(".user-name").value
    const conection = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: userName})
    
    conection.then(function () {
        setInterval(keepConnection, 4000)
        requestMessages()
        document.querySelector(".entry-screen").classList.add("entry-screen-success")
    })
    
}

function renderMessenges() {
    let messagesArea = document.querySelector(".messsages-area")
    for (let i = 0; i < messagesInformation.length; i++) {

        let textComplet1 = " para"
        let textComplet2 = ":"
        let time = messagesInformation[i].time
        let from = messagesInformation[i].from
        let to = messagesInformation[i].to
        let text = messagesInformation[i].text
        let type = messagesInformation[i].type

        if (type === "status") {
            to = ""
            textComplet1 = ""
            textComplet2 = ""
        }

        messagesArea.innerHTML += `
            <div class="message-container messages ${type}">
                <span class="time">(${time})</span>
                <span class="from">${from}</span>${textComplet1}
                <span class="to">${to}${textComplet2}</span>
                <span class="text">${text}</span>
            </div>`
    }
}

function requestMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    console.log(promise)
    promise.then(function (response) {
        console.log("ok")
        messagesInformation = response.data
        renderMessenges()
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


