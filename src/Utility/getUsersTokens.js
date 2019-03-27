const tokenOfOwnerByIndex = (web3, ERC721ABI, contractAddress, targetAddress, index) =>
    new Promise(async (resolve, reject) => { 
        if(!web3.utils.isAddress(targetAddress.toLowerCase())) {reject('Invalid Address')};

        var NFTContract = new web3.eth.Contract(ERC721ABI, contractAddress);

        NFTContract.methods.tokenOfOwnerByIndex(targetAddress, index).call()
            .then(result => resolve(result))
            .catch(error => reject(error))
    });

const getUsersTokens = async (web3, ERC721ABI, contractAddress, tokenAmount, account) => {
    return new Promise(function(resolve,reject){
      if (tokenAmount === 0) { resolve([]) }

      var promiseArray = [];
      for (var i = 0; i < tokenAmount; i++) {
        promiseArray.push(tokenOfOwnerByIndex(web3, ERC721ABI, contractAddress, account, i));
      }

      Promise.all(promiseArray)
        .then((idArray) => { resolve(idArray) })
        .catch((error) => { reject(error) })
    })
}

export default getUsersTokens