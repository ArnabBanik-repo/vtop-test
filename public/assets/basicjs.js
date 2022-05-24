window.onload = () => {
  let i = 0;
  const hide = document.getElementById("show");
  hide.addEventListener("click", () => {
    const pass = document.getElementById("pass");
    i++;
    if (i % 2 != 0) {
      hide.classList.remove("bi-eye-slash");
      hide.classList.add("bi-eye");
      pass.type = "text";
    } else {
      hide.classList.add("bi-eye-slash");
      hide.classList.remove("bi-eye");
      pass.type = "password";
    }
    console.log(i);
  });
};
