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
