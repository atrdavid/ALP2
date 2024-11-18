document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");
    const content = document.getElementById("content");
    const footerContainer = document.querySelector("footer");

    // Load default home page
    loadPage("home", true);

    // Load footer dynamically
    loadFooter();

    // Event listeners for navigation links
    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const page = event.target.getAttribute("data-page");
            loadPage(page);
        });
    });

    // Function to dynamically load pages
    async function loadPage(page, isDefault = false) {
        try {
            if (page === "home" && isDefault) {
                return; // Keep the default content for home
            }

            const response = await fetch(`${page}.html`);
            if (!response.ok) throw new Error("Page not found");
            const html = await response.text();
            content.innerHTML = html;

            // Load the form dynamically if it's the contact page
            if (page === "contact") {
                loadForm();
            }
        } catch (error) {
            content.innerHTML = `
                <h1>Error</h1>
                <p>Sorry, the page could not be loaded.</p>
                <p>${error.message}</p>
            `;
            console.error("Error loading page:", error);
        }
    }

    // Function to dynamically load the footer
    async function loadFooter() {
        try {
            const response = await fetch("Components/footer.html");
            if (!response.ok) throw new Error("Footer file not found");
            const footerHTML = await response.text();
            footerContainer.innerHTML = footerHTML;
        } catch (error) {
            console.error("Error loading footer:", error);
        }
    }

    // Function to dynamically load the form
    async function loadForm() {
        const formContainer = document.getElementById("contact-form-container");
        if (!formContainer) return;

        try {
            const response = await fetch("Components/form.html");
            if (!response.ok) throw new Error("Form file not found");
            const formHTML = await response.text();
            formContainer.innerHTML = formHTML;
        } catch (error) {
            formContainer.innerHTML = `<p>Error loading form: ${error.message}</p>`;
        }
    }

    // Function to load the contact page when "Request a Quote" is clicked
    window.loadContactPage = () => {
        loadPage("contact");
    };

    // Global form submission handling
    document.addEventListener("submit", async (event) => {
        event.preventDefault();

        const form = event.target;
        if (form.id === "contact-form") {
            const formData = new FormData(form);

            try {
                console.log("Form Data:", Object.fromEntries(formData.entries()));
                alert("Thank you! Your message has been submitted.");
                form.reset();
            } catch (error) {
                alert("There was an error submitting your message. Please try again later.");
            }
        }
    });
});
