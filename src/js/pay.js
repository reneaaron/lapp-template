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

async function pay(amount) {

    const payModal = new bootstrap.Modal('#pay');
    payModal.show();

    document.querySelector('#pay .loading-text').textContent = "Loading payment data...";

    const result = await fetchInvoice(amount);

    document.querySelector('#pay .loading-text').textContent = "Waiting for your payment...";

    if (window.webln) {
        document.querySelector('#pay .webln-button').classList.remove('d-none');
    } else {

    }

    document.querySelector('#pay .qr-container').classList.remove('d-none');
    document.querySelector('#pay .qr-link').href = "lightning:" + result.payment_request;
    document.querySelector('#pay .qr').src = result.qrCode;

    startPollingPayment(result.payment_hash, 1000, function () {
        window.location.reload();
    });
}

function startQr() {
    document.getElementById('#pay .qr-container').classList.remove('d-none');
}

async function startWebLN(payment_request) {
    try {
        await window.webln.enable();
        await window.webln.sendPayment(payment_request);
    }
    catch(e) {
        alert("An error happened during the payment");
    }    
}

async function isPaid(payment_hash) {
    const response = await fetch('/invoice/' + payment_hash);
    const result = await response.json();
    return result.paid;
}

function startPollingPayment(payment_hash, timeout, onSuccess) {
    setTimeout(async function () {
        const result = await isPaid(payment_hash);

        if (!result) {
            startPollingPayment(payment_hash, timeout, onSuccess);
        } else {
            onSuccess();
        }
    }, timeout);
}