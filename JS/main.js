// 자원 정의
const resources = {
    aminoAcid: { name: "Amino Acid", count: 0, limit: 100, rate: 0, icon: "Images/aminoacid.png", description: "생명체의 기본 구성 요소입니다." },
    protein: { name: "Protein", count: 0, limit: 100, rate: 0, icon: "Images/protein.png", description: "아미노산으로부터 만들어지는 중요한 구조 단백질입니다." },
    rna: { name: "RNA", count: 0, limit: 50, rate: 0, icon: "Images/rna.png", description: "단백질 합성 및 유전 정보 전달에 중요한 역할을 합니다." },
    dna: { name: "DNA", count: 0, limit: 25, rate: 0, icon: "Images/dna.png", description: "유전 정보를 저장하고 전달하는 분자입니다." },
    stone: { name: "Stone", count: 0, limit: 100, rate: 0, icon: "Images/stone.png", description: "건축 및 도구 제작에 사용되는 기본 자원입니다." },
    iron: { name: "Iron", count: 0, limit: 50, rate: 0, icon: "Images/iron.png", description: "더 강한 도구와 무기를 제작하는 데 사용됩니다." },
};

// 시대 정의
const ages = ["Prehistoric", "Ancient", "Medieval", "Industrial", "Modern", "Space"];
let currentAge = 1; // 고대 시대에서 시작하도록 초기값 변경

// 각 시대에 따라 사용할 수 있는 자원 정의
const ageResources = {
    Prehistoric: { aminoAcid: true, protein: false, rna: false, dna: false, stone: false, iron: false },
    Ancient: { aminoAcid: true, protein: true, rna: false, dna: false, stone: true, iron: true },
    Medieval: { aminoAcid: true, protein: true, rna: true, dna: false, stone: true, iron: true },
    Industrial: { aminoAcid: true, protein: true, rna: true, dna: true, stone: true, iron: true },
    Modern: { aminoAcid: true, protein: true, rna: true, dna: true, stone: true, iron: true },
    Space: { aminoAcid: true, protein: true, rna: true, dna: true, stone: true, iron: true },
};

// 자원 업데이트 함수
function updateResources() {
    const resourceBar = document.getElementById("resourcebar");
    resourceBar.innerHTML = ""; // 이전 내용을 지우고 새로고침
    const currentResources = ageResources[ages[currentAge]]; // 현재 시대의 자원 정의

    for (const [key, resource] of Object.entries(resources)) {
        if (currentResources[key]) { // 현재 시대에 사용할 수 있는 자원인지 확인
            const div = document.createElement("div");
            div.className = "resource";
            div.innerHTML = `
                <img src="${resource.icon}" alt="${resource.name}">
                <span>${resource.name}: ${resource.count} / ${resource.limit}</span> <!-- 자원 수치 표시 -->
            `;
            resourceBar.appendChild(div); // 자원 바에 자원 추가
        }
    }
}

// 행동에 따라 자원 및 시대 발전 조건 체크
function checkUnlocks() {
    // Prehistoric에서 Ancient으로 발전
    if (resources.protein.count >= 10 && currentAge === 0) {
        currentAge++;
        document.getElementById("age").textContent = ages[currentAge];
        logEvent(`Advanced to ${ages[currentAge]} Age!`);
    }
    // Ancient에서 Medieval로 발전
    if (resources.rna.count >= 5 && currentAge === 1) {
        currentAge++;
        document.getElementById("age").textContent = ages[currentAge];
        logEvent(`Advanced to ${ages[currentAge]} Age!`);
    }
    // Medieval에서 Industrial로 발전
    if (resources.dna.count >= 10 && currentAge === 2) {
        currentAge++;
        document.getElementById("age").textContent = ages[currentAge];
        logEvent(`Advanced to ${ages[currentAge]} Age!`);
    }
    // Industrial에서 Modern으로 발전
    if (resources.dna.count >= 15 && currentAge === 3) {
        currentAge++;
        document.getElementById("age").textContent = ages[currentAge];
        logEvent(`Advanced to ${ages[currentAge]} Age!`);
    }
    // Modern에서 Space로 발전
    if (resources.dna.count >= 20 && currentAge === 4) {
        currentAge++;
        document.getElementById("age").textContent = ages[currentAge];
        logEvent(`Advanced to ${ages[currentAge]} Age!`);
    }
}

// 로그 작성 함수
function logEvent(message) {
    const chat = document.getElementById("chat");
    const p = document.createElement("p");
    p.textContent = message;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
}

// UI 업데이트 함수
function updateUI() {
    updateResources();
    updateButtons();
}

// 버튼 업데이트 함수
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

// 행동 수행 함수
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

// 행동 수행 가능 여부 체크
function canPerformAction(action) {
    for (const [resource, amount] of Object.entries(action.cost)) {
        if (resources[resource].count < amount) {
            return false;
        }
    }
    return true;
}

// 게임 루프
function gameLoop() {
    for (const resource of Object.values(resources)) {
        resource.count = Math.min(resource.count + resource.rate, resource.limit);
    }
    updateUI();
}

// 게임 루프 시작
setInterval(gameLoop, 1000);
updateUI();
logEvent("Welcome to CivBuilder! Start by collecting Amino Acids.");
