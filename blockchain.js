let loadingCount = 0;
const chain = [];

function Block(index, data, previousHash) {
    if(typeof index !== "number" || isNaN(index)) {
        throw "index는 정수만 입력받을 수 있습니다";
    }
    if(typeof data !== "string") {
        throw "data는 문자열만 입력받을 수 있습니다"
    }
    if(typeof previousHash != "string") {
        throw "previousHash는 해싱값만 입력받을 수 있습니다"
    }
    this.index = index;
    this.data = data;
    this.previousHash = previousHash;
    this.timestamp = (new Date().getTime() / 1000);
    this.hash = CryptoJS.SHA256(this.index + this.data + this.previousHash + this.timestamp).toString();
}

function addBlock(data) {
    const size = chain.length-1;
    const lastBlock = chain[size];
    chain.push(new Block(size+1, data, lastBlock !== undefined ? lastBlock.hash : ""));
}

function initBlock() {
    for (let i = 0; i < 20; i++) {
        addBlock("Test/" + i);
    }
}

function refreshDom(template, section) {
    for (;loadingCount<chain.length;loadingCount++) {
        const block = chain[loadingCount];
        const frame = document.importNode(template.content, true).querySelector(".block");
        for (let i = 0; i < frame.children.length; i++) {
            const child = frame.children[i];
            if (child.classList.contains('block-index')) {
                child.textContent = "번호 : " + block.index;
            }
            if (child.classList.contains('block-data')) {
                child.textContent = "값 : " + block.data;
            }
            if (child.classList.contains('block-hash')) {
                child.textContent = "해시값 : " + block.hash;
            }
            if (child.classList.contains('block-previous-block')) {
                child.textContent = "이전블록 해시값 : " + block.previousHash;
            }
        }
        section.append(frame);
    }
}

(() =>{
    const template = document.querySelector("#template");
    const section = document.querySelector("#section");
    const createButton = document.querySelector("#blockchain-button");
    const text = document.querySelector("#blockchain-data");

    let closeUpElement;

    initBlock();
    refreshDom(template, section);

    section.addEventListener("mouseover", (event) => {
        const target = event.target;
        if (closeUpElement) {
            closeUpElement.classList.remove("closeup");
        }
        if (target.nodeType !== 1 || target.nodeName !== "LABEL") return;
        if (target.classList.contains("block-closeup")) {
            const parent = target.parentElement;
            parent.classList.add("closeup");
            closeUpElement = parent;
        }
    });
    createButton.addEventListener("click", () => {
        addBlock(text.value);
        text.value = "";
        refreshDom(template, section);
    });
})();