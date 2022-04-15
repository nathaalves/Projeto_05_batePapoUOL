
let userName = ""
let messagesInformation =[]

function enterTheRoom() {
    userName = document.querySelector(".user-name").value
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: userName})
    
    promise.then(function () {
        setInterval(keepConnection, 4000)
        setInterval(requestMessages, 3000)
        document.querySelector(".entry-screen").classList.add("entry-screen-success")
    })
    promise.catch(function (error) {
        const err = error.response.status
        console.log(err)
        if (err === 400) {
            alert("Este nome de usuário já está em uso. Utilize outro nome")
        }
    })
}

function renderMessenges() {
    let messagesArea = document.querySelector(".messsages-area")
    messagesArea.innerHTML = ""
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

        if ((to === userName || to === "Todos" || type === "status")) {
            messagesArea.innerHTML += `
            <div class="message-container message-layout ${type}">
                <span class="time">(${time})</span>
                <span class="from">${from}</span>${textComplet1}
                <span class="to">${to}${textComplet2}</span>
                <span class="text">${text}</span>
            </div>`
        }
    }
}

function requestMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(function (response) {
        messagesInformation = response.data
        renderMessenges()
    })
    promise.catch(function (error) {
    })
}

function keepConnection() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: userName})
    promise.then(function () {
    })
}


