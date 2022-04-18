let userName = ""
let messageInformations = []
let participantsList = []
let selectedContact = "Todos"
let visibilit = "message"

function enterTheChat() {

    userName = document.querySelector(".user-name").value
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: userName})

    loadingPage(200)

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
            loadingPage(err)
        }
    })
}

function loadingPage(err) {

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
        messageInformations = response.data
        console.log( messageInformations)
        renderMessenges()
        closeEntryScreen()
    })
}

function renderMessenges() {

    let messagesArea = document.querySelector(".messsages-area")
    messagesArea.innerHTML = ""

    for (let i = 0; i < messageInformations.length; i++) {

        let textComplet1 = " para"
        let textComplet2 = ":"
        let time = messageInformations[i].time
        let from = messageInformations[i].from
        let to = messageInformations[i].to
        let text = messageInformations[i].text
        let type = messageInformations[i].type

        if (type === "status") {
            to = ""
            textComplet1 = ""
            textComplet2 = ""
        }

        function messagesICanSee() {
            return from === userName || to === userName || to === "Todos" || type === "status"
        }

        if (messagesICanSee()) {

            messagesArea.innerHTML += `
            <div class="message-container ${type}">
                <span class="time">(${time})</span>
                <span class="from">${from}</span>${textComplet1}
                <span class="to">${to}${textComplet2}</span>
                <span class="text">${text}</span>
            </div>`
        }

        function scrollToLastMessage() {
            const allMessages = document.querySelectorAll(".message-container")
            const lastMessage = allMessages[allMessages.length-1]
            lastMessage.scrollIntoView(false)
        }
        scrollToLastMessage()
    }
}

function sendMessage() {

    const text = document.querySelector(".text-box")

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", {
        from: userName,
        to: selectedContact,
        text: text.value,
        type: visibilit
    })

    text.value = ""

    promise.then(function () {
        renderMessenges()
    })
    
    promise.catch(function (){
        window.location.reload()
    })
}

function requestParticipantsList() {

    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")

    promise.then(function (response){
        participantsList = response.data
        renderParticipants()
        selectSendToAllContacts()
    })
}

function renderParticipants() {

    const participantListArea = document.querySelector(".contacts-list")
    participantListArea.innerHTML = `
    <div onclick="contactSelection(this)">
        <ion-icon name="people"></ion-icon>
        <span>Todos</span>
        <ion-icon class="selected" name="checkmark-outline"></ion-icon>
    </div>`

    for (let i = 0; i < participantsList.length; i++){

        let participant = participantsList[i].name
        let addClass = ""
        
        if (participant === selectedContact) {
            addClass = "active"
        }

        if (participant !== userName) {
            participantListArea.innerHTML += `
            <div onclick="contactSelection(this)">
                <ion-icon name="person-circle"></ion-icon>
                <span>${participant}</span>
                <ion-icon class="selected ${addClass}" name="checkmark-outline"></ion-icon>
            </div>`
        }
    }
}

function showSideMenu() {
    document.querySelector(".side-menu-container").classList.toggle("show-side-menu")
}

function selectSendToAllContacts() {

    const selected = document.querySelector(".contacts-list .active")

    if (selected === null) {
        const sendToAll = document.querySelector(".contacts-list .selected")
        sendToAll.classList.add("active")
        selectedContact = "Todos"
        document.querySelector(".selected-contact").innerHTML = "Todos"
    }
}

function contactSelection(selected) {

    const unselect = document.querySelector(".contacts-list .active")
    unselect.classList.remove("active")
    
    selected.querySelector(".selected").classList.add("active")
    selectedContact = selected.querySelector("span").innerHTML

    document.querySelector(".selected-contact").innerHTML = selectedContact
}

function visibilitSelection(selected) {

    document.querySelector(".visibilit .active").classList.remove("active")

    selected.querySelector(".selected").classList.add("active")
    visibilit = selected.querySelector("span").innerHTML

    document.querySelector(".visibilit").innerHTML = visibilit

    if (visibilit === "Público") {
        visibilit = "message"
    } else {
        visibilit = "private_message"
    }
}

function sendWithEnter() {

    const userNameInputBox = document.querySelector(".user-name")
    const BtnEnter = document.querySelector(".button-entry-screen")

    userNameInputBox.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            BtnEnter.click()
        }
    })

    const textInputBox = document.querySelector(".text-box")
    const btnSendMessage = document.querySelector(".send-button")

    textInputBox.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            btnSendMessage.click()
        }
    })
}
sendWithEnter()