//  ---Light/Dark theme toggle---
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const sunLine = `<path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"></path>`;
const sunFill = `<path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"></path>`;

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    themeIcon.innerHTML = sunLine; // Light mode → outline sun
  } else {
    themeIcon.innerHTML = sunFill; // Dark mode → filled sun
  }
});

// --- Resume Editor ---
let nutrientInstance = null;
document
  .getElementById("resume-upload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      if (nutrientInstance) {
        NutrientViewer.unload(nutrientInstance);
      }
      NutrientViewer.load({
        container: "#viewer",
        document: e.target.result,
      })
        .then((instance) => {
          nutrientInstance = instance;
          console.log("Nutrient loaded", instance);
        })
        .catch((error) => {
          console.error(error.message);
        });
    };
    reader.readAsArrayBuffer(file);
  });

// --- Save Resume ---
document
  .getElementById("save-resume")
  .addEventListener("click", async function () {
    if (!nutrientInstance) {
      alert("No document loaded.");
      return;
    }
    try {
      // Export the current PDF as an ArrayBuffer
      const buffer = await nutrientInstance.exportPDF();
      const blob = new Blob([buffer], { type: "application/pdf" });
      const formData = new FormData();
      formData.append("resume", blob, "resume.pdf");
      console.log("FormData prepared:", formData);

      const response = await fetch("/api/resume/save", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save resume.");
      }
      alert("Resume saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving resume: " + err.message);
    }
  });

//--- View Resume ---
function viewResumes() {
  window.location.href = "/resumes";
}
// --- JD Keyword  ---
document
  .getElementById("jdForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const jobDescription = document
      .getElementById("jobDescription")
      .value.trim();
    if (!jobDescription) {
      alert("Please enter a job description.");
      return;
    }

    try {
      const response = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      const container = document.getElementById("keywordsContainer");
      container.innerHTML = "<h3>Suggested Keywords</h3>";

      Object.keys(data.suggestedKeywords)
        .map((k) => k.trim()) // ✅ remove extra spaces/newlines
        .filter((k) => k.length > 0) // ✅ skip empty values
        .forEach((keyword) => {
          const capsule = document.createElement("span");
          capsule.className = "keyword-pill";
          capsule.textContent = keyword;
          container.appendChild(capsule);
        });
    } catch (err) {
      console.error("❌ Error submitting JD:", err.message);
      alert("Error: " + err.message);
    }
  });
