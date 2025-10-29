function submitCode() {
  const code = document.getElementById("inviteCode").value;
  if (code && code.length >= 4) {
    const encrypted = encrypt(code);
    localStorage.setItem("inviteCode", encrypted);
    window.location.href = "login.html";
  } else {
    alert("Geçerli bir kod girin!");
  }
}