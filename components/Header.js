const { Web3 } = require("web3")

export default function Header() {
    const connectWallet = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                console.log(accounts[0])
            } catch (e) {
                console.error(e)
            }
        } else {
            console.log("Please install Metamask")
        }
    }
    return (
        <div>
            <button className="bg-blue-600 rounded-md" onClick={connectWallet}>
                Connect
            </button>
        </div>
    )
}
