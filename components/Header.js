import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Header() {
    return (
        <div className="flex flex-row">
            <div className=" px-5 py-3">
                <h1 className="text-3xl font-bold text-blue-800">🤖 DEFI APP</h1>
            </div>
            <div className="absolute top-0 right-0 px-5 py-3">
                <ConnectButton />
            </div>
        </div>
    )
}
