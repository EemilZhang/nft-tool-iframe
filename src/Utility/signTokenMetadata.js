const signTokenMetadata = async (web3, account, metadata) => {
    return new Promise((resolve, reject) => {
        web3.eth.personal.sign(metadata, account, null)
            .then((signature) => (resolve(signature)))
            .catch((error) => (reject(error)))
    })
}

export default signTokenMetadata