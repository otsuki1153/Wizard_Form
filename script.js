let progress = document.querySelector(".progress").style.width = "0%";
let actualPage

if(actualPage == 1){
    progress.style.width = "0%"
} else if(actualPage == 2){
    progress.style.width = "20%"
} else if(actualPage == 3){
    progress.style.width = "40%"
} else if(actualPage == 4){
    progress.style.width = "60%"
}else if(actualPage == 5){
    progress.style.width = "100%"
}
