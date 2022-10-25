import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { useState } from "react"
import Web3 from "web3"
import rewardTokenAbi from "../constants/rewardTokenAbi.json"
import stakingAbi from "../constants/stakinAbi.json"
import { rewardTokenAddress, stakingAddress } from "../constants/constantHelper"

export default function Home() {
    const [amount, setAmount] = useState("0")

    let web3
    if (typeof web3 !== "undefined") {
        web3 = new Web3("http://localhost:8545")
    } else {
        web3 = new Web3(process.env.INFURA_URL)
    }

    const stakingContract = new web3.eth.Contract(stakingAbi, stakingAddress)
    const tokenContract = new web3.eth.Contract(rewardTokenAbi, rewardTokenAddress)

    tokenContract.methods.name().call((err, result) => {
        console.log(` result: ${result}`)
    })

    const handleChange = (event) => {
        setAmount(event.target.value)
        console.log("value is:", event.target.value)
    }

    async function withdrawCall() {
        stakingContract.methods.withdraw(amount).call((err, result) => {
            console.log(result)
        })
        console.log(amount)
    }

    async function depositCall() {
        stakingContract.methods.stake(amount).call((err, result) => {
            console.log(result)
        })
        console.log(amount)
    }

    return (
        <div className="flex justify-center">
            <div>
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-center">Staking</h2>
                </div>
                <div>
                    <input
                        className="border-2 border-blue-500 rounded-md text-center"
                        type="number"
                        id="eth"
                        name="eth"
                        placeholder="Amount"
                        onChange={handleChange}
                    />
                    <button className="bg-blue-700 rounded-md text-white" onClick={depositCall}>
                        Deposit
                    </button>
                    <button className="bg-blue-700 rounded-md text-white" onClick={withdrawCall}>
                        Whitdraw
                    </button>
                </div>
            </div>
        </div>
    )
}
