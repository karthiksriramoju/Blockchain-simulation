const crypto = require('crypto');

// Block Class
class Block {
    constructor(index, previousHash, transactions) {
        this.index = index;
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        const data = `${this.index}${this.timestamp}${JSON.stringify(this.transactions)}${this.previousHash}`;
        return crypto.createHash('sha256').update(data).digest('hex');
    }
}

// Blockchain Class
class Blockchain {
    constructor() {
        this.chain = [];
        this.createGenesisBlock();2
    }

    createGenesisBlock() {
        const genesisBlock = new Block(0, '0', ['Genesis Block']);
        this.chain.push(genesisBlock);
    }

    addBlock(transactions) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = new Block(lastBlock.index + 1, lastBlock.hash, transactions);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    printChain() {
        this.chain.forEach(block => {
            console.log(`Block #${block.index}`);
            console.log(`Timestamp: ${block.timestamp}`);
            console.log(`Transactions: ${block.transactions}`);
            console.log(`Previous Hash: ${block.previousHash}`);
            console.log(`Current Hash: ${block.hash}`);
            console.log('-'.repeat(50));
        });
    }
}

// Testing the Blockchain
const blockchain = new Blockchain();
blockchain.addBlock(['Alice sends 5 BTC to Bob']);
blockchain.addBlock(['Bob sends 2 BTC to Charlie']);
blockchain.addBlock(['Charlie sends 1 BTC to Alice']);

console.log('Is blockchain valid?', blockchain.isChainValid());

blockchain.printChain();

// Tampering Example
blockchain.chain[1].transactions = ['Alice sends 100 BTC to Eve'];  // Tampering the second block
console.log('Is blockchain valid after tampering?', blockchain.isChainValid());

