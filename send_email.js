//Form Data Collection and transfer to backend

class EmailError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}

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

function checkFormData(formData) {
    const { name, email, message } = formData;

    const nameError = !name.trim() || name.length <= 6;
    const emailError = !/^[\w.]+@\w+\.(com|net|org|ca)$/g.test(email);

    const messageError = message.length <= 12;

    const nameErrorMessage = nameError ? "Please enter your name" : null;
    const emailErrorMessage = emailError ? "Please enter valid email" : null;
    const bodyErrorMessage = messageError
        ? "Please write a message longer than 12 characters"
        : null;

    return { nameErrorMessage, emailErrorMessage, bodyErrorMessage };
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formMessageEl = document.querySelector(".sent-status");
    const nameInput = form.querySelector(`input[name="name"]`);
    const textArea = form.querySelector(`textarea[name="message"]`);
    const emailInput = form.querySelector(`input[name="email"]`);
    const formData = Object.fromEntries(new FormData(e.target));

    const { nameErrorMessage, emailErrorMessage, bodyErrorMessage, noErrors } =
        checkFormData(formData);

    if (nameErrorMessage) {
        formMessageEl.textContent = nameErrorMessage;
        nameInput.focus();
        return;
    }
    if (emailErrorMessage) {
        formMessageEl.textContent = emailErrorMessage;
        emailInput.focus();
        return;
    }

    if (bodyErrorMessage) {
        formMessageEl.textContent = bodyErrorMessage;
        textArea.focus();
        return;
    }
    // submit(formData);
    try {
        submitBtn.disabled = true;
        const response = await sendMail(formData);
        console.log(response);
        formMessageEl.textContent = response;
        resetInputs(nameInput, textArea, emailInput);
    } catch (error) {
        console.log(error);
        submitBtn.disabled = false;
        formMessageEl.textContent = error.message;
    } finally {
        await delay();
        formMessageEl.textContent = "";
        e.target.reset();
        submitBtn.disabled = true;
    }
});

const delay = () => new Promise((res, rej) => setTimeout(res, 2500));

function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = "";
    });
}

async function sendMail({ name, email, message }) {
    const sendData = {
        service_id: "service_97mm31i",
        template_id: "template_kzdeeud",
        user_id: "7izBT5ThHEQ51APbI",
        template_params: {
            from_name: name,
            user_email: email,
            message,
            to_name: "Joseph",
        },
    };

    try {
        const response = await fetch(
            "https://api.emailjs.com/api/v1.0/email/send",
            {
                method: "POST",
                body: JSON.stringify(sendData),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.ok) {
            return "Message Sent";
        }
        throw new Error("Message could not be sent. Try again");
    } catch (error) {
        return Promise.reject(error.message);
    }
}
