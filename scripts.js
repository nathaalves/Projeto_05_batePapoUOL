let userName = ""
let messagesInformation = []
let participantsList = []

function enterTheRoom() {
    userName = document.querySelector(".user-name").value
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: userName})
    
    promise.then(function () {
        setInterval(keepConnection, 4000)
        requestMessages()
        setInterval(requestMessages, 3000)
        requestParticipantsList()
        setInterval(requestParticipantsList, 10000)
        document.querySelector(".entry-screen").classList.add("entry-screen-success")
    })
    promise.catch(function (error) {
        const err = error.response.status
        if (err === 400) {
            alert("Este nome de usuário já está em uso. Utilize outro nome")
        }
    })
}

function keepConnection() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: userName})
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

        function visibleMessages() {
            return from === userName || to === userName || to === "Todos" || type === "status"
        }

        if (visibleMessages()) {
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

function sendMessage() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", {
        from: userName,
        to: "Todos",
        text: document.querySelector(".text-box").innerText,
        type: "message"
    })
    promise.then(function () {
        renderMessenges()
    })
    promise.catch(function (){
        window.location.reload()
    })
}

function showSideMenu() {
    document.querySelector(".side-menu-container").classList.toggle("show-side-menu")
}

function requestParticipantsList() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promise.then(function (response){
        participantsList = response.data
        renderParticipants()
    })
}

function renderParticipants() {
    const participantListArea = document.querySelector(".participants-list")
    participantListArea.innerHTML = ""

    for (let i = 0; i < participantsList.length; i++){
        let participant = participantsList[i].name

        if (participant !== userName) {
            participantListArea.innerHTML += `<div><ion-icon name="person-circle"></ion-icon><span>${participant}</span></div>`
        }
    }
}




