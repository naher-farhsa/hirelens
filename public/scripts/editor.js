//  ---Light/Dark theme toggle---
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const moonIcon = `<path d="M12 21.9967C6.47715 21.9967 2 17.5196 2 11.9967C2 6.47386 6.47715 1.9967 12 1.9967C17.5228 1.9967 22 6.47386 22 11.9967C22 17.5196 17.5228 21.9967 12 21.9967ZM5.32889 16.422C6.76378 18.5675 9.20868 19.9803 11.9836 19.9803C16.4018 19.9803 19.9836 16.3985 19.9836 11.9803C19.9836 9.2053 18.5707 6.76034 16.4251 5.32547C17.2705 8.35324 16.5025 11.7369 14.1213 14.1181C11.7401 16.4993 8.3566 17.2672 5.32889 16.422Z"></path>`; // 🌙
const sunIcon = `<path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"></path>`; // ☀️

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    // Light mode → show moon icon (to switch back)
    themeIcon.innerHTML = moonIcon;
    themeToggle.classList.add("light-btn");
    themeToggle.classList.remove("dark-btn");
  } else {
    // Dark mode → show sun icon (to switch to light)
    themeIcon.innerHTML = sunIcon;
    themeToggle.classList.add("dark-btn");
    themeToggle.classList.remove("light-btn");
  }
});

// ---Logout---
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST", // or GET depending on your backend
      credentials: "include", // ⬅ ensures cookies are sent
    });

    if (response.ok) {
      window.location.href = "/"; // redirect to homepage after logout
    } else {
      console.error("Logout failed:", await response.text());
    }
  } catch (error) {
    console.error("Error during logout:", error);
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
