import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        console.log(window);
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      else if (window.web3) {
        console.log(window);
        const web3 = window.web3;
        resolve(web3);
      }
      else {
        console.log(window);
        reject("No web3")
      }
    });
  });

export default getWeb3;