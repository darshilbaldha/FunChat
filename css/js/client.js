const socket = io();

const form=document.getElementById('send-continer')
const messageInput=document.getElementById('messageinp');
const messageContainer=document.querySelector(".send");
var audio = new Audio('unitone.mp3');

function scrollToBottom() {
    var container = document.getElementById('scrollContainer');
    container.scrollTop = container.scrollHeight;
}


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const data = new FormData(e.target);
    const message = data.get("messageinp");
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})

const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    if(position=='left'){
        audio.play();
    }
    messageContainer.append(messageElement);
    scrollToBottom();
}

do{
    name1 = prompt('Please enter your name: ')
} while(!name1)

socket.emit('new-user-joined', name1);

socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'left');
})

socket.on('receive', data=>{
    append(`${data.name} : ${data.message}`, 'left');
})


socket.on('left', name1=>{
    append(`${name1} : leave the chat`, 'left');
})