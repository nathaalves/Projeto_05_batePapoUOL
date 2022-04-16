let userName = ""
let messagesInformation = []
let participantsList = []
let selectedContact = "Todos"
let visibilit = "message"

function enterTheRoom() {
    userName = document.querySelector(".user-name").value
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: userName})
    loadingMessages(200)
    promise.then(function () {
        setInterval(keepConnection, 4000)
        requestMessages()
        setInterval(requestMessages, 3000)
        requestParticipantsList()
        setInterval(requestParticipantsList, 10000)
    })
    promise.catch(function (error) {
        const err = error.response.status
        if (err === 400) {
            loadingMessages(err)
        }
    })
}

function loadingMessages(err) {
    if (err === 200) {
        document.querySelector(".entry-information").style.display = "none"
        document.querySelector(".loading-page").style.display = "flex"
    }
    if (err === 400) {
        document.querySelector(".entry-information").style.display = "flex"
        document.querySelector(".loading-page").style.display = "none"
        document.querySelector(".err-user-name").style.display = "flex"
    }
}

function closeEntryScreen() {
    document.querySelector(".entry-screen").classList.add("entry-screen-success")
}

function keepConnection() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: userName})
}

function requestMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(function (response) {
        messagesInformation = response.data
        renderMessenges()
        closeEntryScreen()
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
        to: selectedContact,
        text: document.querySelector(".text-box").innerText,
        type: visibilit
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
        selectContact()
    })
}

function selectContact() {
    const selected = document.querySelector(".contacts-list .active")
    if (selected === null) {
        const sendToAll = document.querySelector(".contacts-list .selected")
        sendToAll.classList.add("active")
        selectedContact = "Todos"
    }
}

function contactSelection(selected) {

    const teste = document.querySelector(".contacts-list .active")
    teste.classList.remove("active")
    
    selected.querySelector(".selected").classList.add("active")
    selectedContact = selected.querySelector("span").innerHTML
}

function renderParticipants() {
    const participantListArea = document.querySelector(".contacts-list")
    participantListArea.innerHTML = `<div onclick="contactSelection(this)"><ion-icon name="people"></ion-icon><span>Todos</span><ion-icon class="selected" name="checkmark-outline"></ion-icon></div>`

    for (let i = 0; i < participantsList.length; i++){
        let participant = participantsList[i].name

        let addClass = ""
        if (participant === selectedContact) {
            addClass = "active"
        }

        if (participant !== userName) {
            participantListArea.innerHTML += `<div onclick="contactSelection(this)"><ion-icon name="person-circle"></ion-icon><span>${participant}</span><ion-icon class="selected ${addClass}" name="checkmark-outline"></ion-icon></div>`
        }
    }
}

function messageVisibilit(selected) {
    document.querySelector(".visibilit .active").classList.remove("active")
    selected.querySelector(".selected").classList.add("active")
    visibilit = selected.querySelector("span").innerHTML
    if (visibilit === "Público") {
        visibilit = "message"
    } else {
        visibilit = "private_message"
    }
}