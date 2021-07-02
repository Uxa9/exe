let authForm = document.getElementById('authForm');

authForm.onsubmit = async (event) => {
    event.preventDefault();

    let body = {
        login : document.getElementById('login').value,
        password : document.getElementById('password').value
    }
    let headers = {};

    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';

    const response = await fetch("/login", {
        method  : "POST",
        headers : headers,
        body    : body
    });

    if (response.status == "400") {
        const data = await response.json();
        let popUp = document.getElementById('popUp');
        popUp.classList.add('active');
        popUp.children[0].innerText = data.message;

        setTimeout("popUp.classList.remove('active')", 3000);

    } else {
        document.getElementById('authForm').submit();
    }
}
