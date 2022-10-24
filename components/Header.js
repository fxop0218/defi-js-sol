import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Header() {
    return (
        <div className="flex flex-row">
            <div>DEFI APP</div>
            <div>
                <ConnectButton />
            </div>
        </div>
    )
}
