const chat = async (chatBox, socket) => {
  const swal = await Swal.fire({
    title: 'Identifícate',
    input: 'text',
    text: 'Ingresa el usuario para identificarte',
    inputValidator: value => {
      return !value && 'Necesitas ingresar tu nickname';
    },
    allowOutsideClick: false,
  });

  const user = swal.value;
  socket.emit('auth', user);
  socket.on('messageLogs', data => {
    const log = document.getElementById('messagelogs');
    let messagesInFrontend = '';
    data.forEach(obj => {
      const messageClass = obj.user.username === user ? 'own-message' : 'other-message';
      messagesInFrontend += `<p class="${messageClass}"><strong>${obj.user.username}</strong> dice: ${obj.message}</p>`;
    });

    log.innerHTML = messagesInFrontend;
  });

  socket.on('newUser', data => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: `${data} se acaba de conectar`,
    });
  });

  const sendMessage = () => {
    const message = chatBox.value;
    if (message.trim().length > 0) {
      socket.emit('message', { user, message });
      chatBox.value = '';
    }
  };

  chatBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
      sendMessage();
    }
  });

  const sendButton = document.getElementById('sendButton');
  sendButton.addEventListener('click', sendMessage);
};

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const chatBox = document.getElementById('chatBox');
  chat(chatBox, socket);
});
