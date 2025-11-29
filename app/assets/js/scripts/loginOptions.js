const loginOptionsCancelContainer = document.getElementById('loginOptionCancelContainer')
const loginOptionMicrosoft = document.getElementById('loginOptionMicrosoft')
const loginOptionMojang = document.getElementById('loginOptionMojang')
const loginOptionsCancelButton = document.getElementById('loginOptionCancelButton')

// NOVO: Adicione a referência para o botão Offline que estará no HTML.
const loginOptionOffline = document.getElementById('loginOptionOffline')

// NOVO: Flag para informar que o modo offline foi escolhido.
let isOfflineMode = false
let loginOptionsCancellable = false

let loginOptionsViewOnLoginSuccess
let loginOptionsViewOnLoginCancel
let loginOptionsViewOnCancel
let loginOptionsViewCancelHandler

function loginOptionsCancelEnabled(val){
    if(val){
        $(loginOptionsCancelContainer).show()
    } else {
        $(loginOptionsCancelContainer).hide()
    }
}

// Modificado: Garante que a flag offline é DESATIVADA para o fluxo Microsoft.
if (loginOptionMicrosoft) {
    loginOptionMicrosoft.onclick = (e) => {
        isOfflineMode = false // Desativa a flag
        switchView(getCurrentView(), VIEWS.waiting, 500, 500, () => {
            ipcRenderer.send(
                MSFT_OPCODE.OPEN_LOGIN,
                loginOptionsViewOnLoginSuccess,
                loginOptionsViewOnLoginCancel
            )
        })
    }
}


// NOVO: Lógica para o botão de Login Offline.
// CORREÇÃO: Verificação adicionada para garantir que o elemento existe antes de anexar o evento.
if (loginOptionOffline) { // <--- ESTA É A CORREÇÃO DE SEGURANÇA.
    loginOptionOffline.onclick = (e) => {
        isOfflineMode = true // ATIVA a flag offline
        switchView(getCurrentView(), VIEWS.login, 500, 500, () => {
            // Redireciona para a tela de login clássica para o jogador inserir o nome.
            loginViewOnSuccess = loginOptionsViewOnLoginSuccess
            loginViewOnCancel = loginOptionsViewOnLoginCancel
            loginCancelEnabled(true)
            
            // OPCIONAL: Esconde o campo de senha, pois não é usado no login offline.
            // Certifique-se de que loginPassword esteja definido neste escopo (geralmente está em login.js ou escopo global).
            if (typeof loginPassword !== 'undefined') {
                loginPassword.value = ''
                if (loginPassword.parentElement) {
                    $(loginPassword.parentElement).hide()
                }
            }
        })
    }
} else {
    // Apenas um log de aviso para o desenvolvedor
    console.warn("Elemento 'loginOptionOffline' não encontrado. Verifique seu HTML.")
}


// Lógica original para o login Mojang (mantida e não modificada)
if (loginOptionMojang) {
    loginOptionMojang.onclick = (e) => {
        isOfflineMode = false // Desativa a flag para o login Mojang (online)
        switchView(getCurrentView(), VIEWS.login, 500, 500, () => {
            loginViewOnSuccess = loginOptionsViewOnLoginSuccess
            loginViewOnCancel = loginOptionsViewOnLoginCancel
            loginCancelEnabled(true)
            // Se for login Mojang, garanta que o campo de senha está visível
            if (typeof loginPassword !== 'undefined' && loginPassword.parentElement) {
                $(loginPassword.parentElement).show()
            }
        })
    }
}


// Modificado: Reseta a flag offline ao cancelar
if (loginOptionsCancelButton) {
    loginOptionsCancelButton.onclick = (e) => {
        isOfflineMode = false // Reseta a flag
        switchView(getCurrentView(), loginOptionsViewOnCancel, 500, 500, () => {
            // Clear login values (Mojang login)
            // No cleanup needed for Microsoft.
            if (typeof loginUsername !== 'undefined') {
                loginUsername.value = ''
            }
            if (typeof loginPassword !== 'undefined') {
                loginPassword.value = ''
                // Se o campo de senha foi escondido para o modo offline, reexibe-o ao voltar
                if (loginPassword.parentElement) {
                    $(loginPassword.parentElement).show()
                }
            }
            if(loginOptionsViewCancelHandler != null){
                loginOptionsViewCancelHandler()
                loginOptionsViewCancelHandler = null
            }
        })
    }
}