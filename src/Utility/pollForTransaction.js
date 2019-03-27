const pollForTransaction = (web3, hash, delay, callback) => {
    let calledBack = false
    let loopCounter = 0;

    const checkInterval = setInterval(() => {
      web3.eth.getTransaction(hash, function (error, response){
        if (calledBack) return
        if (error) return callback(error)
        if (response.blockNumber === null) {return 'transaction pending'}
        loopCounter += 1;
        if (loopCounter < 5) {return 'web3 sync grace period'}

        let transaction = response;
        clearInterval(checkInterval);
        calledBack = true;
        callback(null, transaction);
      })
    }, delay)
}

export default pollForTransaction