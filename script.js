document.addEventListener("DOMContentLoaded", () => {
  // Auto-resize textarea
  const interactionsTextArea = document.getElementById("interactions");
  interactionsTextArea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Tooltip element
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  document.body.appendChild(tooltip);

  // Utility functions
  function splitByWords(text, maxLen = 1999) {
    const tokens = text.match(/\S+\s*/g) || [];
    const parts = [];
    let current = "";
    for (const token of tokens) {
      if (current.length + token.length > maxLen) {
        parts.push(current);
        current = token;
      } else {
        current += token;
      }
    }
    if (current) parts.push(current);
    return parts;
  }

  function groupInfractions(text) {
    const lines = text.split("\n"), blocks = [], cur = [];
    const isStart = l => /^(warn(?:ed)?|kick(?:ed)?|ban(?:ned)?)/i.test(l.trim());
    for (let l of lines) {
      if (isStart(l) && cur.length) {
        blocks.push(cur.join("\n"));
        cur.length = 0;
      }
      cur.push(l);
    }
    if (cur.length) blocks.push(cur.join("\n"));
    return blocks;
  }

  // Load staff.json and populate dropdowns
  let staffData = [];

  fetch("staff.json")
    .then(res => res.json())
    .then(data => {
      staffData = data;

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

      // Auto-select role on staff change
      staffSel.addEventListener("change", () => {
        const selected = staffSel.value;
        const match = staffData.find(s => s.name === selected);
        roleSel.value = match ? match.role : "";
      });
    })
    .catch(err => {
      console.error("Failed to load staff list:", err);
      document.getElementById("staffMember").innerHTML = `<option>Error loading staff</option>`;
      document.getElementById("staffRole").innerHTML = `<option>Error loading roles</option>`;
    });

  // Generate 3SP output
  document.getElementById("generate3SP").addEventListener("click", () => {
    const isNitro = document.getElementById("discordNitro").value === "yes";
    const rawID = document.getElementById("discordID").value.replace(/\D/g, "") || "Nil";
    const mention = rawID !== "Nil" ? `<@${rawID}>` : "Nil";
    const interactions = document.getElementById("interactions").value || "Nil";
    const staffMember = document.getElementById("staffMember").value || "Nil";
    const staffRole = document.getElementById("staffRole").value || "Nil";

    const countBoxEl = document.getElementById("boxCount");
    countBoxEl.textContent = "";
    countBoxEl.style.display = "none";

    const blocks = groupInfractions(interactions).filter(b => !/revoked by/i.test(b));
    let warn = 0, kick = 0, ban = 0;
    blocks.forEach(b => {
      const a = b.split("\n")[0].trim();
      if (/warn/i.test(a)) warn++;
      if (/kick/i.test(a)) kick++;
      if (/ban/i.test(a)) ban++;
    });

    const transformed = blocks.map(b => {
      const L = b.split("\n").map(x => x.trim()).filter(x => x);
      if (L.length >= 3) return L[0] + "\n" + L[2];
      if (L.length === 2) return L[0] + "\n" + L[1];
      return L[0] || "";
    }).join("\n\n");

    let processed = transformed
      .replace(/(warn(?:ed)?|kick(?:ed)?|ban(?:ned)?)(?=\d)/gi, "$1 ")
      .replace(/(warn(?:ed)?|kick(?:ed)?|ban(?:ned)?)(\s+by\s+\S+)/gi, "$1");

    const cleaned = processed.split("\n").map(x => x.trim()).join("\n");

    const fullOutput = `Hello ${mention}, 

The Beehive Staff have noticed that you have been involved in multiple negative interactions (Warns/Kicks/Bans) on the server. It is apparent that there is a consistent breach of our server rules and guidelines, which raises concerns about the frequency of our interactions with you. 

Below is a summary of your prior staff interactions:
\`\`\`
${cleaned}
\`\`\`

Due to these interactions, the Beehive Staff Team now require an immediate adjustment in your roleplay approach. Strict compliance with our server rules and guidelines is imperative. 

Given the frequency of these interactions, the staff team has unanimously decided to implement a Three Strike Policy (3SP) effective immediately. Any staff interaction that violates the server rules/guidelines will be considered a "strike," and any staff member is authorized to issue one. The consequences for strikes become progressively more severe, as outlined below:

**Three Strike Policy:**
- Strike 1: 1 Day Ban | Subject to longer ban 
- Strike 2: 3 Day Ban | Subject to longer ban 
- Strike 3: Permanent Ban

In the event that you receive a third strike resulting in a Permanent Ban, you will have the opportunity to appeal this on our website. Ban appeals are reviewed at the end of each month during the staff's available time, and immediate unbanning is not guaranteed.

**Working towards Coming Off 3SP:**
We believe in second chances and positive change within our community. You can work towards coming off 3SP and returning to normal stature within the community by demonstrating consistent good behaviour and adherence to our server rules and guidelines. Engage in positive roleplay, respect fellow players and staff members, and actively contribute to a welcoming and enjoyable gaming environment.

The Beehive Staff Team conduct monthly reviews of members who are on 3SP, assessing their conduct for that month. This review process aims to evaluate your progress and, when appropriate, grant your return to regular status within the community. Your continued good behavior and adherence to server rules will be taken into consideration during these reviews. 

**Please take note of the following:**  
- Surveillance methods are in place even when no staff members are online to monitor player activities.  
- The timeframe for being on 3SP is not predetermined; however, demonstrating good behavior and engaging in positive roleplay may lead to its removal sooner.  
- Community Rule 11 always applies.  

If you have any questions or comments, feel free to share them below. Otherwise, please react to this message with a ✅, and we will close the ticket.

Kind Regards,  
${staffMember},  
${staffRole}`;

    const fullBox = document.getElementById("fullOutputContainer");
    const wrapper = document.getElementById("shortOutputsContainer");
    wrapper.innerHTML = "";

    function attachTooltip(el) {
      el.addEventListener("mouseenter", () => {
        tooltip.textContent = "Click to Copy";
        tooltip.style.display = "block";
      });
      el.addEventListener("mousemove", e => {
        tooltip.style.left = e.pageX + 10 + "px";
        tooltip.style.top = e.pageY + 10 + "px";
      });
      el.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });
    }

    if (isNitro) {
      fullBox.style.display = "block";
      fullBox.textContent = "";
      const outputEl = document.createElement("p");
      outputEl.id = "outputFull3SP";
      outputEl.className = "output";
      outputEl.textContent = fullOutput;
      fullBox.appendChild(outputEl);
      attachTooltip(fullBox);
      fullBox.addEventListener("click", () => {
        navigator.clipboard.writeText(fullOutput);
        if (!fullBox.querySelector(".copy-stamp")) {
          const stampImg = new Image();
          stampImg.src = "copied-stamp.png";
          stampImg.className = "copy-stamp";
          fullBox.appendChild(stampImg);
        }
      });
    } else {
      fullBox.style.display = "none";
      const boxes = splitByWords(fullOutput, 1999);
      countBoxEl.textContent = `Parts to copy: ${boxes.length}`;
      countBoxEl.style.display = "block";

      boxes.forEach((b, i) => {
        const box = document.createElement("div");
        box.className = "output-box";

        const label = document.createElement("div");
        label.className = "part-number";
        label.textContent = `${i + 1}`;
        box.appendChild(label);

        const el = document.createElement("p");
        el.id = `part${i + 1}`;
        el.className = "output";
        el.textContent = b;
        box.appendChild(el);

        attachTooltip(box);
        box.addEventListener("click", () => {
          navigator.clipboard.writeText(el.textContent);
          if (!box.querySelector(".copy-stamp")) {
            const stampImg = new Image();
            stampImg.src = "copied-stamp.png";
            stampImg.className = "copy-stamp";
            box.appendChild(stampImg);
          }
        });

        wrapper.appendChild(box);
      });
    }

    document.getElementById("warnCount").innerText = warn;
    document.getElementById("kickCount").innerText = kick;
    document.getElementById("banCount").innerText = ban;
  });
});
