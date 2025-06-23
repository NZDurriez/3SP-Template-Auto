document.addEventListener("DOMContentLoaded", () => {
  // Auto-resize textarea
  const interactionsTextArea = document.getElementById("interactions");
  interactionsTextArea.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Load staff list from JSON with proper placeholder options
  fetch("staff.json")
    .then(res => res.json())
    .then(data => {
      const staffSel = document.getElementById("staffMember");
      const roleSel = document.getElementById("staffRole");
      const roles = new Set();

      // Placeholder prompts with disabled and selected attributes
      staffSel.innerHTML = `<option value="" disabled selected>Select staff member</option>`;
      data.forEach(({ name, role }) => {
        staffSel.innerHTML += `<option value="${name}">${name}</option>`;
        roles.add(role);
      });

      roleSel.innerHTML = `<option value="" disabled selected>Select role</option>`;
      roles.forEach(role => {
        roleSel.innerHTML += `<option value="${role}">${role}</option>`;
      });
    })
    .catch(err => {
      console.error("Failed to load staff list:", err);
      document.getElementById("staffMember").innerHTML = `<option>Error loading staff</option>`;
      document.getElementById("staffRole").innerHTML = `<option>Error loading roles</option>`;
    });

  // Generate button click handler
  document.getElementById("generate3SP").addEventListener("click", () => {
    const discordID = document.getElementById("discordID").value.trim();
    const interactions = document.getElementById("interactions").value.trim();
    const staffMember = document.getElementById("staffMember").value;
    const staffRole = document.getElementById("staffRole").value;
    const discordNitro = document.getElementById("discordNitro").value;

    // Example tally counts, replace with your actual counting logic
    const kickCount = 1; 
    const warnCount = 2; 
    const banCount = 0; 

    // Update tally UI
    document.getElementById("kickCount").textContent = kickCount;
    document.getElementById("warnCount").textContent = warnCount;
    document.getElementById("banCount").textContent = banCount;

    // Build the full output text (expand with your real template logic)
    let fullOutputText = "";
    fullOutputText += `Discord ID: ${discordID}\n`;
    fullOutputText += `Staff Member: ${staffMember} (${staffRole})\n`;
    fullOutputText += `Discord Nitro: ${discordNitro === 'yes' ? 'Has Nitro' : 'No Nitro'}\n\n`;
    fullOutputText += `Summary of Staff Interactions:\n${interactions}\n\n`;
    fullOutputText += `Tally:\n - Kicks: ${kickCount}\n - Warns: ${warnCount}\n - Bans: ${banCount}\n\n`;
    fullOutputText += "=== End of Report ===";

    // Show output container and fill output
    const outputPara = document.getElementById("outputFull3SP");
    outputPara.textContent = fullOutputText;

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
