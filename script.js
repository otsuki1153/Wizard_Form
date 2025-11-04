let progress = document.querySelector(".progress");
let actualPage = parseInt(localStorage.getItem("actualPage")) || 1;


function updateProgress() {
  const percent = (actualPage - 1) * 25;
  progress.style.width = percent + "%";
}


function changePageUP() {
  actualPage++;
  localStorage.setItem("actualPage", actualPage);
}

function changePageDOWN() {
  actualPage--;
  localStorage.setItem("actualPage", actualPage);
}

function resetPage() {
  actualPage = 1;
  localStorage.setItem("actualPage", actualPage);
}


document.addEventListener("DOMContentLoaded", () => {
  const nextBtn = document.querySelector(".btn:not(.prev)");
  const inputs = document.querySelectorAll("select, textarea");

  if (nextBtn && inputs.length > 0) {
    nextBtn.style.opacity = "0.4";
    nextBtn.style.pointerEvents = "none"; 

    const checkFilled = () => {
      let allFilled = true;
      inputs.forEach(input => {
        if (input.tagName === "SELECT" && input.value === "") allFilled = false;
        if (input.tagName === "TEXTAREA" && input.value.trim() === "") allFilled = false;
      });

      if (allFilled) {
        nextBtn.style.opacity = "1";
        nextBtn.style.pointerEvents = "auto";
      } else {
        nextBtn.style.opacity = "0.4";
        nextBtn.style.pointerEvents = "none";
      }
    };

    inputs.forEach(input => {
      input.addEventListener("change", checkFilled);
      input.addEventListener("input", checkFilled);
    });
  }
});

updateProgress();
