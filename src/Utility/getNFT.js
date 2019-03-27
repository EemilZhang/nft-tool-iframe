import ERC721ABI from './ERC721ABI';

const balanceOf = (web3, contractAddress, targetAddress) =>
    new Promise(async (resolve, reject) => { 
        if(!web3.utils.isAddress(targetAddress.toLowerCase())) {reject('Invalid Address')};
        var NFTContract = new web3.eth.Contract(ERC721ABI, contractAddress);
        NFTContract.methods.balanceOf(targetAddress).call()
            .then(result => resolve(result))
            .catch(error => reject(error))
    });

const ownerOf = (web3, contractAddress, tokenId) =>
    new Promise(async (resolve, reject) => { 

        var NFTContract = new web3.eth.Contract(ERC721ABI, contractAddress);

        NFTContract.methods.ownerOf(tokenId).call()
            .then(result => resolve(result))
            .catch(error => reject(error))
    });

const tokenOfOwnerByIndex = (web3, contractAddress, targetAddress, index) =>
    new Promise(async (resolve, reject) => { 
        if(!web3.utils.isAddress(targetAddress.toLowerCase())) {reject('Invalid Address')};

        var NFTContract = new web3.eth.Contract(ERC721ABI, contractAddress);

        NFTContract.methods.tokenOfOwnerByIndex(targetAddress, index).call()
            .then(result => resolve(result))
            .catch(error => reject(error))
    });

const tokenByIndex = (web3, contractAddress, tokenId) =>
    new Promise(async (resolve, reject) => { 
        
        var NFTContract = new web3.eth.Contract(ERC721ABI, contractAddress);

        NFTContract.methods.tokenByIndex(tokenId).call()
            .then(result => resolve(result))
            .catch(error => reject(error))
    });


const tokenURI = (web3, contractAddress, tokenId) =>
    new Promise(async (resolve, reject) => { 
        
        var NFTContract = new web3.eth.Contract(ERC721ABI, contractAddress);

        NFTContract.methods.tokenURI(tokenId).call()
            .then(result => resolve(result))
            .catch(error => reject(error))
    });

const tokenMinter = (web3, contractAddress, tokenId) => 
    new Promise(async (resolve, reject) => {

        var NFTContract = new web3.eth.Contract(ERC721ABI, contractAddress);

        NFTContract.getPastEvents('Transfer', {
            filter: {from: '0x0000000000000000000000000000000000000000', tokenId: tokenId},
            fromBlock: 0,
            toBlock: 'latest'
        })
            .then(events => resolve(events))
            .catch(error => reject(error))
    })

const getNFT = {
    balanceOf: balanceOf,
    ownerOf: ownerOf,
    tokenOfOwnerByIndex: tokenOfOwnerByIndex,
    tokenByIndex: tokenByIndex,
    tokenURI: tokenURI,
    tokenMinter: tokenMinter
};

export default getNFT