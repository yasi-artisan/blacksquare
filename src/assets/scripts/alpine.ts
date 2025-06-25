import Alpine from "alpinejs";

document.addEventListener("alpine:init", () => {
    Alpine.store("darkMode", {
        value: document.documentElement.classList.contains("dark"),

        toggle() {
            this.value = !this.value;
            document.documentElement.classList.toggle("dark", this.value);
            localStorage.setItem("darkMode", this.value.toString());
        },
    });
});
