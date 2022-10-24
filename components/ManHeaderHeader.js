import { Web3 } from "web3"
import { useState, useEffect } from "react"

export default function Header() {
    const [walletAddress, setWalletAddress] = useState("")

    useEffect(() => {
        getCurrentWalletConnected()
        addWalletListener()
    })
    const connectWallet = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                if (account.lengt < 0) {
                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                    setWalletAddress(accounts[0])
                    console.log(accounts[0])
                }

            } catch (e) {
                console.error(e)
            }
        } else {
            console.log("Please install Metamask")
        }
    }

    const addWalletListener = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            window.ethereum.on("accountsChanged", (accounts) => {
                setWalletAddress(accounts[0])
                console.log(accounts[0])
            })
        } else {
            setWalletAddress("")
            console.log("Please install Metamask")
        }
    }

    const getCurrentWalletConnected = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                const accounts = await window.ethereum.request({ method: "eth_accounts" })
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0])
                    console.log(accounts[0])
                } else {
                    console.log("Connect to MetaMask using connect button")
                }
            } catch (e) {
                console.error(e)
            }
        } else {
            console.log("Please install Metamask")
        }
    }
    return (
        <div>
            <button onClick={connectWallet}>
                {walletAddress && walletAddress > 0
                    ? `Connected ${walletAddress.substring(0, 4)}...${walletAddress.substring(38)}`
                    : "Connect wallet"}
            </button>
        </div>
    )
}
