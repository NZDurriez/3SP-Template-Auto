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

  // Example: add generate button event to show output and copied stamp
  document.getElementById("generate3SP").addEventListener("click", () => {
    // Just an example output fill (replace with your real logic)
    const outputPara = document.getElementById("outputFull3SP");
    outputPara.textContent = `Discord ID: ${document.getElementById("discordID").value}\nSummary:\n${document.getElementById("interactions").value}`;

    // Show output container
    const outputContainer = document.getElementById("fullOutputContainer");
    outputContainer.style.display = "block";

    // Show copied stamp
    showCopiedStamp();
  });
});

// Function to show the copied stamp briefly
function showCopiedStamp() {
  const stamp = document.getElementById('copiedStamp');
  if (!stamp) return;
  
  stamp.style.display = 'block';
  stamp.style.opacity = '1';

  // Fade out after 1.5 seconds
  setTimeout(() => {
    stamp.style.opacity = '0';
  }, 1500);

  // Hide completely after fade out transition
  setTimeout(() => {
    stamp.style.display = 'none';
  }, 1800);
}
