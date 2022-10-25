import "../styles/globals.css"
import Header from "../components/Header"
import { createClient, configureChains, chain, WagmiConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import "@rainbow-me/rainbowkit/styles.css"

const { chains, provider, webSocketProvider } = configureChains(
    [chain.goerli, chain.hardhat],
    [publicProvider()]
    // alchemyProvider({ apiKey: process.env.ALCHEMY_KEY }),
)

const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
})

const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
    connectors,
})

function MyApp({ Component, pageProps }) {
    return (
        <WagmiConfig client={client}>
            <RainbowKitProvider chains={chains}>
                <Header />
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiConfig>
    )
}

export default MyApp
