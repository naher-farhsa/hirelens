 const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    const moonIcon = `<path d="M12 21.9967C6.47715 21.9967 2 17.5196 2 11.9967C2 6.47386 6.47715 1.9967 12 1.9967C17.5228 1.9967 22 6.47386 22 11.9967C22 17.5196 17.5228 21.9967 12 21.9967ZM5.32889 16.422C6.76378 18.5675 9.20868 19.9803 11.9836 19.9803C16.4018 19.9803 19.9836 16.3985 19.9836 11.9803C19.9836 9.2053 18.5707 6.76034 16.4251 5.32547C17.2705 8.35324 16.5025 11.7369 14.1213 14.1181C11.7401 16.4993 8.3566 17.2672 5.32889 16.422Z"></path>`;
    const sunIcon = `<path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"></path>`;

    themeIcon.innerHTML = sunIcon; // default (dark mode active)

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      if (document.body.classList.contains("light-mode")) {
        themeIcon.innerHTML = moonIcon;
        themeToggle.classList.add("light-btn");
        themeToggle.classList.remove("dark-btn");
      } else {
        themeIcon.innerHTML = sunIcon;
        themeToggle.classList.add("dark-btn");
        themeToggle.classList.remove("light-btn");
      }
    });

    // ---Typewriter Effect---
    const typewriterText = document.getElementById("typewriterText");
    const features = [
      "Refine Resumes ",
      "JD Curated Keywords ",
      "Edit it, Save it, Share it",
      "Hassle free Storage "
    ];

    let featureIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
      const currentText = features[featureIndex];
      if (!deleting) {
        typewriterText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentText.length) {
          deleting = true;
          setTimeout(typeEffect, 1200);
          return;
        }
      } else {
        typewriterText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          featureIndex = (featureIndex + 1) % features.length;
        }
      }
      setTimeout(typeEffect, deleting ? 50 : 100);
    }

    typeEffect();

    document.querySelector('.startBtn').addEventListener('click', () => {
  window.location.href = '/register';
});
