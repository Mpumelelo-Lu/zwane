// Apply Loan page JS
window.showApplyLoan2 = function() {
  if (typeof loadPage === 'function') {
    loadPage('apply-loan-2');
  } else {
    window.location.href = 'apply-loan-2.html';
  }
}

async function loadModule(name) {
  const overlay = document.getElementById("module-container");
  const moduleContent = document.getElementById("module-content");
// load css first for better UX results

const cssPath = `modules-css/${name}.css`;
  if (!document.querySelector(`link[href="${cssPath}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssPath;
    document.head.appendChild(link);
  }
  overlay.classList.remove("hidden");
  moduleContent.innerHTML = "<p>Loading...</p>";//animate later

  try {
    const res = await fetch(`modules/${name}.html`);
    if (!res.ok) throw new Error(`Module ${name} not found`);
    const html = await res.text();
    setTimeout(() => {
      moduleContent.innerHTML = html;
      // If tillslip, bankstatement, or idcard module loaded, bind upload handler
      //
      if (name === 'tillslip') {
        bindTillSlipUpload();
      } else if (name === 'bankstatement') {
        bindBankStatementUpload();
      } else if (name === 'idcard') {
        // Dynamically import the idcard.js module and call bindIdCardUpload
        import('./modules-js/idcard.js').then(mod => {
          if (mod && typeof mod.bindIdCardUpload === 'function') {
            mod.bindIdCardUpload();
          }
        }).catch(err => {
          console.error('Failed to load idcard.js:', err);
        });
      }
// Bind bank statement upload handler after module loads
function bindBankStatementUpload() {
  const form = document.getElementById("bankstatementForm");
  const status = document.getElementById("uploadStatus");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = document.getElementById("bankstatementFile").files[0];
    if (!file) {
      status.textContent = "Please select a file first.";
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    status.textContent = "Uploading... ⏳";
    try {
      const res = await fetch("/api/bankstatement/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        status.innerHTML = `✅ Bank statement uploaded successfully!<br><small>Thank you, your file <b>${data.filename}</b> has been received.</small>`;
      } else {
        status.textContent = `❌ Upload failed: ${data.error}`;
      }
    } catch (err) {
      console.error(err);
      status.textContent = "⚠ Something went wrong during upload.";
    }
  });
}
// Bind till slip upload handler after module loads
function bindTillSlipUpload() {
  const form = document.getElementById("tillslipForm");
  const status = document.getElementById("uploadStatus");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = document.getElementById("tillslipFile").files[0];
    if (!file) {
      status.textContent = "Please select a file first.";
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    status.textContent = "Uploading... ⏳";
    try {
      const res = await fetch("/api/tillslip/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        status.innerHTML = `✅ Till slip uploaded successfully!<br><small>Thank you, your file <b>${data.filename}</b> has been received.</small>`;
      } else {
        status.textContent = `❌ Upload failed: ${data.error}`;
      }
    } catch (err) {
      console.error(err);
      status.textContent = "⚠ Something went wrong during upload.";
    }
  });
}
    }, 300);
  } catch (err) {
    moduleContent.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function closeModule() {
  const overlay = document.getElementById("module-container");
  overlay.classList.add("hidden");
}