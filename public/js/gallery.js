let dropArea      = document.getElementById('dropArea');
let formButton    = document.getElementById('fileElem');
let deleteButtons = Array.from(document.querySelectorAll('.cross'));

updateArray();

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults (event) {
    event.preventDefault();
    event.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
})
;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
})
function highlight(event) {
    dropArea.classList.add('highlight');
}
function unhighlight(event) {
    dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);
formButton.addEventListener('change', buttonChange, false);

function handleDrop(event) {
    let dt = event.dataTransfer;
    let files = dt.files;
    handleFiles(files);
}

function buttonChange(event) {
    let files = formButton.files;
    handleFiles(files);
}

function previewFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        let imgBlock = document.getElementById('imageBlockTemplate')
                       .content.cloneNode(true);
        imgBlock.querySelector("img").src = reader.result;
        imgBlock.querySelector("span").innerText = "/img/gallery/" + file.name;
        deleteButtons.unshift(imgBlock.querySelector(".cross"));
        updateArray();
        let gallery = document.getElementById('gallery');
        gallery.insertBefore(imgBlock, gallery.children[1]);
    }
}

function handleFiles(files) {
    files = [...files];
    initializeProgress(files.length);
    files.forEach(uploadFile);
    files.forEach(previewFile);
}

function uploadFile(img) {
    let url = "/uploadImages";
    let formData = new FormData();
    formData.append('image', img);
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then((res) => {
        progressDone();
        if (res.status == 200) {

        } else {
            alert(res.message);
        }
    })
    .catch(() => { alert("Что-то пошло не так, попробуйте снова") });
}

let filesDone = 0;
let filesToDo = 0;
let progressBar = document.getElementById('progress-bar');

function initializeProgress(numfiles) {
    progressBar.value = 0;
    filesDone = 0;
    filesToDo = numfiles;
}
function progressDone() {
    filesDone++;
    progressBar.value = filesDone / filesToDo * 100;
}

function updateArray() {
    deleteButtons.forEach(button => {
        button.onclick = (event) => {
            button.parentNode.parentNode.style.display = "none";
            let link = button.parentNode.querySelector("span").innerText;
            let url = "/deleteImage";
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'link' : link })
            })
            .then((res) => {
                if (res.status == 200) {

                } else {
                    alert(res.message);
                }
            })
            .catch((err) => {console.log(err); alert("Что-то пошло не так, попробуйте снова") });
        }
    });
}
