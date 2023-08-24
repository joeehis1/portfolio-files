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

//Form Data Collection and transfer to backend

const form = document.querySelector("#contact-form");
const submitBtn = form.querySelector("button");
const textArea = form.querySelector("textarea");
const formStatusParaEl = form.querySelector("#sent-status");
formStatusParaEl.textContent = "";

textArea.addEventListener("input", (e) => {
    if (e.target.value.length >= 0) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;

    const formData = Object.fromEntries(new FormData(e.target));
    const { name, email, message } = formData;
    if (!name.trim() || name.length <= 0) {
        formStatusParaEl.textContent = "Please enter your name";
        const nameInput = form.querySelector('input[name="name"]');
        nameInput.focus();
        submitBtn.disabled = false;
        return;
    }
    const emailRegEx = /[\w.]+@\w+\.(com|net|org|ca)/;
    const validEmail = emailRegEx.test(email);
    if (!validEmail) {
        formStatusParaEl.textContent = "Please enter valid email";
        const emailInput = form.querySelector('input[name="email"]');
        emailInput.focus();
        submitBtn.disabled = false;
        return;
    }
    if (message.length <= 0) {
        formStatusParaEl.textContent = "Please write a message";
        const textArea = form.querySelector("textarea");
        textArea.focus();
        submitBtn.disabled = false;
        return;
    }
    submitBtn.textContent = "Sending...";
    try {
        const serverResponse = await sendFormData(formData);
        formStatusParaEl.textContent = serverResponse.message;
        e.target.reset();
        await delay();
        formStatusParaEl.textContent = "";
        submitBtn.textContent = "Submit";
    } catch (error) {
        console.log(error);
    } finally {
        submitBtn.textContent = "Submit";
    }
});

async function delay(ms = 4000) {
    return new Promise((res, rej) => {
        setInterval(res, ms);
    });
}

async function sendFormData(formData) {
    const url = "https://portfolio-server-wutu.onrender.com/";
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });
    if (!response.ok) {
        throw {
            message: "Failed to send message",
            status: response.status,
            statusText: response.statusText,
        };
    }
    const json = await response.json();
    return json;
}
