let videoButton = document.getElementById('videoButton');
let videoInput  = document.getElementById('videoInput');

videoButton.onclick = () => {
    videoInput.click();
}

videoInput.onchange = (event) => {
    let file = videoInput.files[0];

    let url = "/uploadVideo";
    let formData = new FormData();
    formData.append('video', file);
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then((res) => {
        if (res.status == 200) {
            alert("Видео загружено");
        } else {
            alert(res.message);
        }
    })
    .catch(() => { alert("Что-то пошло не так, попробуйте снова") });
}
