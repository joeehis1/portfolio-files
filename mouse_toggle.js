const toggleBtn = document.querySelector("#nav-btn");
const mainNav = document.querySelector("#main-nav");
const navLinks = mainNav.querySelectorAll(".nav-link");

toggleBtn.addEventListener("click", showMenu);

navLinks.forEach((link) => {
    link.addEventListener("click", hideMenuOnClickNavLink);
});

function showMenu() {
    const menuShown = mainNav.hasAttribute("data-menu-shown");
    if (menuShown) {
        mainNav.removeAttribute("data-menu-shown");
        this.removeAttribute("data-menu-shown");
        this.setAttribute("data-menu-hidden", "");
        return;
    }
    this.removeAttribute("data-menu-hidden");
    mainNav.setAttribute("data-menu-shown", "");
    this.setAttribute("data-menu-shown", "");
    return;
}

function hideMenuOnClickNavLink() {
    const menuShown = mainNav.hasAttribute("data-menu-shown");
    if (menuShown) {
        mainNav.removeAttribute("data-menu-shown");
        toggleBtn.removeAttribute("data-menu-shown");
        mainNav.setAttribute("data-menu-hidden", "");
        toggleBtn.setAttribute("data-menu-hidden", "");
    }
}
