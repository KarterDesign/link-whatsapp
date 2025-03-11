document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const whatsappForm = document.getElementById('whatsapp-form');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const resultContainer = document.getElementById('result-container');
    const linkPreview = document.getElementById('link-preview');
    const copyLinkBtn = document.getElementById('copy-link');
    const testLinkBtn = document.getElementById('test-link');
    const qrcodeContainer = document.getElementById('qrcode');
    const downloadQrBtn = document.getElementById('download-qr');
    
    // Formatação e validação do número de telefone
    phoneInput.addEventListener('input', function(e) {
        // Remove qualquer caractere que não seja número
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Processamento do formulário
    whatsappForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        let phone = phoneInput.value.trim();
        let message = encodeURIComponent(messageInput.value.trim());
        
        // Validar o número de telefone
        if (phone.length < 10 || phone.length > 11) {
            alert('Por favor, insira um número de telefone válido (DDD + número)');
            return;
        }
        
        // Formatar número de telefone (remover o 9 inicial para números fixos)
        if (phone.length === 10) {
            // Número sem o 9 (telefone fixo)
            phone = '55' + phone;
        } else {
            // Número com o 9 (celular)
            phone = '55' + phone;
        }
        
        // Criar o link do WhatsApp
        let whatsappLink = 'https://wa.me/' + phone;
        
        // Adicionar mensagem ao link, se houver
        if (message) {
            whatsappLink += '?text=' + message;
        }
        
        // Exibir o resultado
        linkPreview.textContent = whatsappLink;
        resultContainer.style.display = 'block';
        
        // Atualizar o botão de teste
        testLinkBtn.href = whatsappLink;
        
        // Gerar QR Code
        generateQRCode(whatsappLink);
        
        // Scroll para o resultado
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Função para gerar QR Code
    function generateQRCode(link) {
        // Limpar QR Code anterior
        qrcodeContainer.innerHTML = '';
        
        // Gerar novo QR Code
        const qrcode = new QRCode(qrcodeContainer, {
            text: link,
            width: 200,
            height: 200,
            colorDark: '#128C7E',  // Cor do WhatsApp
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    // Copiar link para área de transferência
    copyLinkBtn.addEventListener('click', function() {
        const textToCopy = linkPreview.textContent;
        
        // Usar a API de Clipboard moderna
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showToast('Link copiado!');
                })
                .catch(err => {
                    console.error('Erro ao copiar: ', err);
                    fallbackCopyText(textToCopy);
                });
        } else {
            fallbackCopyText(textToCopy);
        }
    });
    
    // Método alternativo para copiar texto
    function fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';  // Fora da tela
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('Link copiado!');
            } else {
                showToast('Falha ao copiar. Por favor, copie manualmente.');
            }
        } catch (err) {
            console.error('Erro ao copiar: ', err);
            showToast('Falha ao copiar. Por favor, copie manualmente.');
        }
        
        document.body.removeChild(textArea);
    }
    
    // Baixar QR Code
    downloadQrBtn.addEventListener('click', function() {
        const qrCodeImg = qrcodeContainer.querySelector('img');
        if (!qrCodeImg) return;
        
        // Criar um link temporário para download
        const downloadLink = document.createElement('a');
        downloadLink.href = qrCodeImg.src;
        downloadLink.download = 'whatsapp-qrcode.png';
        
        // Simular clique para iniciar download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
    
    // Exibir mensagem temporária
    function showToast(message) {
        // Verificar se já existe um toast
        let toast = document.querySelector('.toast-notification');
        
        if (toast) {
            // Atualizar mensagem se já existir
            toast.textContent = message;
            
            // Reset da animação de desaparecimento
            clearTimeout(toast.timeout);
            toast.timeout = setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
        } else {
            // Criar um novo toast
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.textContent = message;
            
            // Estilizar o toast
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.right = '20px';
            toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            toast.style.color = 'white';
            toast.style.padding = '10px 15px';
            toast.style.borderRadius = '4px';
            toast.style.zIndex = '1000';
            
            // Adicionar ao DOM
            document.body.appendChild(toast);
            
            // Definir tempo para remover o toast
            toast.timeout = setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
        }
    }
}); 