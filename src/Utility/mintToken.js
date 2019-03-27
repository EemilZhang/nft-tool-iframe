const mintToken = (web3, ERC721ABI, contractAddress, targetAddress) => {
    return new Promise((resolve,reject) => {
        var NFTContract = new web3.eth.Contract(ERC721ABI, contractAddress);
        NFTContract.methods.mintTo(targetAddress).send({from: targetAddress})
            .on('transactionHash', (hash) => {
                resolve(hash);
            })
            .catch((error) => {
                reject(error);
            })
    })
}


export default mintToken