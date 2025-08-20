function startScan() {
  const email = document.getElementById("email").value;
  if (!email) return alert("Lütfen geçerli bir e-posta girin.");
  document.getElementById("result").classList.remove("hidden");
}

function copyText() {
  const textArea = document.getElementById("deleteTemplate");
  textArea.select();
  document.execCommand("copy");
  alert("Silme talebi kopyalandı!");
}

function downloadPDF() {
  const content = document.getElementById("result").innerText;
  const blob = new Blob([content], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ghostify_raporu.pdf";
  link.click();
}