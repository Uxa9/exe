let navLinks = Array.from(document.querySelector('.navigation-panel').children);

navLinks.forEach(link => {

    link.onclick = (event) => {
        navLinks.forEach((item) => {
            item.classList.remove("active");
            document.getElementById(item.name).style.display = "none";
        });

        document.getElementById(link.name).style.display = "grid";
        link.classList.add("active");
    }
});

document.getElementById('saveText').onclick = async () => {
    let body = {
        textFields : {
            "phone"           : document.getElementsByName('phone')[0].value,
            "adress"          : document.getElementsByName('adress')[0].value,
            "work-hours-1"    : document.getElementsByName('working-hours-row-first')[0].value,
            "work-hours-2"    : document.getElementsByName('working-hours-row-second')[0].value,
            "insta"           : document.getElementsByName('insta')[0].value,
            "vk "             : document.getElementsByName('vk')[0].value,
            "twitch "         : document.getElementsByName('twitch')[0].value,
            "yt"              : document.getElementsByName('yt')[0].value
        }
    }
    let headers = {};

    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';

    const response = await fetch("/updateText", {
        method  : "POST",
        headers : headers,
        body    : body
    });

    if (response.status == "400") {
        alert("Что-то пошло не так, попробуйте снова");
    } else {
        alert("Текст обновлен!");
    }
}
