// types of resources
const resources = {
    aminoAcid: { name: "Amino Acid", count: 0, limit: 100, rate: 0, icon: "Images/aminoacid.png", description: "Basic building block of proteins." },
    protein: { name: "Protein", count: 0, limit: 100, rate: 0, icon: "Images/protein.png", description: "Essential molecules formed from amino acids." },
    rna: { name: "RNA", count: 0, limit: 50, rate: 0, icon: "Images/rna.png", description: "Carries genetic instructions for protein synthesis." },
    dna: { name: "DNA", count: 0, limit: 25, rate: 0, icon: "Images/dna.png", description: "Genetic blueprint for cellular development." },
};

// types of actions
const actions = [
    { id: "collectAmino", name: "Collect Amino Acid", cost: {}, produces: { aminoAcid: 1 }, unlocked: true, description: "Gather basic amino acids for building proteins." },
    { id: "createProtein", name: "Create Protein", cost: { aminoAcid: 3 }, produces: { protein: 1 }, unlocked: true, description: "Combine amino acids to form proteins." },
    { id: "createRNA", name: "Create RNA", cost: { protein: 5 }, produces: { rna: 1 }, unlocked: false, description: "Synthesize RNA molecules from proteins." },
    { id: "createDNA", name: "Create DNA", cost: { rna: 2 }, produces: { dna: 1 }, unlocked: false, description: "Form DNA from RNA molecules." },
];

// ages
const ages = ["Prehistoric", "Ancient", "Medieval", "Industrial", "Modern", "Space"];
let currentAge = 0;

// Update resources UI
function updateResources() {
    const resourceBar = document.getElementById("resourcebar");
    resourceBar.innerHTML = "";
    for (const [key, resource] of Object.entries(resources)) {
        const div = document.createElement("div");
        div.className = "resource";
        div.innerHTML = `
            <img src="${resource.icon}" alt="${resource.name}">
            <span>${resource.name}: ${resource.count} / ${resource.limit}</span>
        `;
        resourceBar.appendChild(div);
    }
}

// Update buttons UI
function updateButtons() {
    const buttonsDiv = document.getElementById("buttons");
    buttonsDiv.innerHTML = "";
    for (const action of actions) {
        if (action.unlocked) {
            const button = document.createElement("button");
            button.textContent = action.name;
            button.onclick = () => performAction(action);
            button.disabled = !canPerformAction(action);
            buttonsDiv.appendChild(button);
        }
    }
}

// Check if an action can be performed
function canPerformAction(action) {
    for (const [resource, amount] of Object.entries(action.cost)) {
        if (resources[resource].count < amount) {
            return false;
        }
    }
    return true;
}

// Perform an action
function performAction(action) {
    for (const [resource, amount] of Object.entries(action.cost)) {
        resources[resource].count -= amount;
    }
    for (const [resource, amount] of Object.entries(action.produces)) {
        resources[resource].count = Math.min(resources[resource].count + amount, resources[resource].limit);
    }
    checkUnlocks();
    updateUI();
}

// Check for unlocks
function checkUnlocks() {
    if (resources.protein.count >= 10 && !actions.find(a => a.id === "createRNA").unlocked) {
        actions.find(a => a.id === "createRNA").unlocked = true;
        logEvent("Unlocked: Create RNA");
    }
    if (resources.rna.count >= 5 && !actions.find(a => a.id === "createDNA").unlocked) {
        actions.find(a => a.id === "createDNA").unlocked = true;
        logEvent("Unlocked: Create DNA");
    }
    if (resources.dna.count >= 10 && currentAge === 0) {
        currentAge++;
        document.getElementById("age").textContent = ages[currentAge];
        logEvent(`Advanced to ${ages[currentAge]} Age!`);
    }
}

// Log events in chat
function logEvent(message) {
    const chat = document.getElementById("chat");
    const p = document.createElement("p");
    p.textContent = message;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
}

// Toggle Codex visibility
function toggleCodex() {
    const codex = document.getElementById("codex");
    codex.style.display = codex.style.display === "none" ? "block" : "none";
    if (codex.style.display === "block") {
        updateCodex();
    }
}

// Update Codex content
function updateCodex() {
    const codexContent = document.getElementById("codex-content");
    codexContent.innerHTML = ""; // Clear previous content

    for (const resource of Object.values(resources)) {
        const div = document.createElement("div");
        div.className = "codex-item";
        div.innerHTML = `<strong>${resource.name}</strong>: ${resource.description || "Description not available."}`;
        codexContent.appendChild(div);
    }

    for (const action of actions) {
        const div = document.createElement("div");
        div.className = "codex-item";
        div.innerHTML = `<strong>${action.name}</strong>: ${action.description || "Description not available."}`;
        codexContent.appendChild(div);
    }
}

// Update all UI elements
function updateUI()
