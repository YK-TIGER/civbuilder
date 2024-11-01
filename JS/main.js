// types of resources
const resources = {
    aminoAcid: { name: "Amino Acid", count: 0, limit: 100, rate: 0, icon: "Images/aminoacid.png" },
    protein: { name: "Protein", count: 0, limit: 100, rate: 0, icon: "Images/protein.png" },
    rna: { name: "RNA", count: 0, limit: 50, rate: 0, icon: "Images/rna.png" },
    dna: { name: "DNA", count: 0, limit: 25, rate: 0, icon: "Images/dna.png" },
    stone: { name: "Stone", count: 0, limit: 100, rate: 0, icon: "Images/stone.png" },
    iron: { name: "Iron", count: 0, limit: 100, rate: 0, icon: "Images/iron.png" },
};

// types of actions
const actions = [
    { id: "collectAmino", name: "Collect Amino Acid", cost: {}, produces: { aminoAcid: 1 }, unlocked: true },
    { id: "createProtein", name: "Create Protein", cost: { aminoAcid: 3 }, produces: { protein: 1 }, unlocked: true },
    { id: "collectStone", name: "Collect Stone", cost: {}, produces: { stone: 1 }, unlocked: true },
    { id: "collectIron", name: "Collect Iron", cost: {}, produces: { iron: 1 }, unlocked: false },
    { id: "createRNA", name: "Create RNA", cost: { protein: 5 }, produces: { rna: 1 }, unlocked: false },
    { id: "createDNA", name: "Create DNA", cost: { rna: 2 }, produces: { dna: 1 }, unlocked: false },
];

// ages
const ages = ["Prehistoric", "Ancient", "Medieval", "Industrial", "Modern", "Space"];
let currentAge = 1; // 고대 시대에서 시작

// update resources
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

// update buttons
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

function canPerformAction(action) {
    for (const [resource, amount] of Object.entries(action.cost)) {
        if (resources[resource].count < amount) {
            return false;
        }
    }
    return true;
}

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

// check unlocked buttons
function checkUnlocks() {
    if (resources.protein.count >= 10 && !actions.find(a => a.id === "createRNA").unlocked) {
        actions.find(a => a.id === "createRNA").unlocked = true;
        logEvent("Unlocked: Create RNA");
    }
    if (resources.rna.count >= 5 && !actions.find(a => a.id === "createDNA").unlocked) {
        actions.find(a => a.id === "createDNA").unlocked = true;
        logEvent("Unlocked: Create DNA");
    }
    if (resources.dna.count >= 10 && currentAge === 1) {
        currentAge++;
        document.getElementById("age").textContent = ages[currentAge];
        logEvent(`Advanced to ${ages[currentAge]} Age!`);
    }
    if (resources.stone.count >= 10 && !actions.find(a => a.id === "collectIron").unlocked) {
        actions.find(a => a.id === "collectIron").unlocked = true;
        logEvent("Unlocked: Collect Iron");
    }
}

// log writing function
function logEvent(message) {
    const chat = document.getElementById("chat");
    const p = document.createElement("p");
    p.textContent = message;
