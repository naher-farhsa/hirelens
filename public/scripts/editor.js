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
