
const jsConfetti = new JSConfetti()
const payModal = new bootstrap.Modal('#pay');

document.getElementById('pay').addEventListener('hidden.bs.modal', (event) => {
    paymentActive = false;
});

let paymentActive = false;
let paymentRequest;

async function fetchInvoice(amount, comment) {
    const response = await fetch('/invoice', {
        method: 'POST',
        body: JSON.stringify({
            amount: amount,
            comment: comment,
        }),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error(response.error);
    }

    return response.json();
}

async function requestPayment(amount, comment, onSuccess) { 

    if(paymentActive)
        return;

    paymentActive = true;

    document.querySelector('#pay .loading-text').textContent = "Loading payment data...";
    payModal.show();

    const result = await fetchInvoice(amount, comment);

    paymentRequest = result.payment_request;

    document.querySelector('#pay .loading-text').textContent = "Waiting for your payment...";
    document.querySelector('#pay .qr-container').classList.remove('d-none');
    document.querySelector('#pay .qr-link').href = "lightning:" + result.payment_request;
    document.querySelector('#pay .qr').src = result.qrCode;

    if (window.webln) {
        document.querySelector('#pay .webln-button').classList.remove('d-none');
    } 

    startPollingPayment(result.payment_hash, 1000, function () {
        payModal.hide();
        paymentActive = false;

        onSuccess();
    });
}

async function requestPaymentWebLN(amount, comment, onSuccess) { 

    if(paymentActive)
        return;

    paymentActive = true;

    if(window.webln) {

        try {

            document.querySelector('html').classList.add('wait');  
            const result = await fetchInvoice(amount, comment);

            await window.webln.enable();

            const payResponse = await window.webln.sendPayment(result.payment_request);
            const hash = await sha256(payResponse.preimage);

            if (hash === result.payment_hash) {
                if(onSuccess) { 
                    onSuccess();
                }
            } else {
                throw Error("payment_hash did not match.");
            }
        }
        catch (e) {
            throw Error(e);
        }
        finally {
            paymentActive = false;
            document.querySelector('html').classList.remove('wait');
        }

        return;
    } 

    document.querySelector('#pay .loading-text').textContent = "Loading payment data...";
    payModal.show();

    const result = await fetchInvoice(amount, comment);

    paymentRequest = result.payment_request;

    document.querySelector('#pay .loading-text').textContent = "Waiting for your payment...";
    document.querySelector('#pay .qr-container').classList.remove('d-none');
    document.querySelector('#pay .qr-link').href = "lightning:" + result.payment_request;
    document.querySelector('#pay .qr').src = result.qrCode;

    if (window.webln) {
        document.querySelector('#pay .webln-button').classList.remove('d-none');
    } 

    startPollingPayment(result.payment_hash, 1000, function () {
        payModal.hide();
        paymentActive = false;

        onSuccess();
    });
}

async function startWebLNPayment() {
    try {
        await window.webln.enable();
        await window.webln.sendPayment(paymentRequest);
    }
    catch(e) {
        alert("An error happened during the payment.");
    }    
}

async function isPaid(payment_hash) {
    const response = await fetch('/invoice/' + payment_hash);
    const result = await response.json();
    return result.paid;
}

function startPollingPayment(payment_hash, timeout, onSuccess) {
    if(!paymentActive) return;

    setTimeout(async function () {
        const result = await isPaid(payment_hash);

        if (!result) {
            startPollingPayment(payment_hash, timeout, onSuccess);
        } else {
            onSuccess();
        }
    }, timeout);
}

function sha256(hexString) {
    const match = hexString.match(/.{1,2}/g);
    const msgUint8 = new Uint8Array(match.map((byte) => parseInt(byte, 16)));

    return crypto.subtle.digest('SHA-256', msgUint8).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    });
}

function success() {
    jsConfetti.addConfetti({
        emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
    });
}