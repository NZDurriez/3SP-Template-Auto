
document.addEventListener("DOMContentLoaded", () => {
  // Auto-resize textarea
  const interactionsTextArea = document.getElementById("interactions");
  interactionsTextArea.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Load staff list from JSON
  fetch("staff.json")
    .then(res => res.json())
    .then(data => {
      const staffSel = document.getElementById("staffMember");
      const roleSel = document.getElementById("staffRole");
      const roles = new Set();

      staffSel.innerHTML = `<option value=""></option>`;
      data.forEach(({ name, role }) => {
        staffSel.innerHTML += `<option value="${name}">${name}</option>`;
        roles.add(role);
      });

      roleSel.innerHTML = `<option value=""></option>`;
      roles.forEach(role => {
        roleSel.innerHTML += `<option value="${role}">${role}</option>`;
      });
    })
    .catch(err => {
      console.error("Failed to load staff list:", err);
      document.getElementById("staffMember").innerHTML = `<option>Error loading staff</option>`;
      document.getElementById("staffRole").innerHTML = `<option>Error loading roles</option>`;
    });
});
