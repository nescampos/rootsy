# Rootsy

Rootsy is a next-generation platform that empowers open source developers to fund, launch, and grow their projects using blockchain and decentralized finance. Built on the Zora protocol, Rootsy enables anyone to create, fund, and trade ERC-20 "Creator Coins" for open source projects.

## Why Open Source Matters

- **$4.15B invested in open-source generates $8.8T of value for companies** (Harvard research).
- **Every $1 invested in open-source creates $2,000 of value.**
- **Without open source, companies would need to spend 3.5x more on software.**
- Open source powers the internet, science, and innovation. Funding open source means supporting the creators who build the tools and infrastructure we all rely on.

## Features

- List and discover open source projects.
- Instantly create your own ERC-20 coin ("Creator Coin") on the Zora protocol.
- Fund projects you believe in by purchasing or trading their coins using ETH or ZORA.
- Track your profile and see your balances for all coins created on the platform.
- Explore detailed project and coin analytics powered by Zora's onchain data.
- Wallet connection via RainbowKit + wagmi.

## Tech Stack

- React + Vite
- @zoralabs/coins-sdk
- ethers
- wagmi
- RainbowKit
- Supabase (for project data)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/nescampos/rootsy.git
cd rootsy
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory with the following:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_ZORA_API=your_zora_api_key
VITE_ZORA_REFERRAL_CODE=your_eth_address_referral
```

### 4. Start the development server
```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) (or the port Vite specifies).

## Deployment

This app is built with Vite and can be deployed to any static hosting provider (Vercel, Netlify, GitHub Pages, etc.).

- **For static hosting:** Ensure you set up a [SPA fallback](https://vitejs.dev/guide/static-deploy.html#single-page-applications-spa) so all routes serve `index.html`.
- **Build for production:**
  ```bash
  npm run build
  ```
- **Preview production build:**
  ```bash
  npm run preview
  ```

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit and push (`git commit -am 'Add new feature' && git push origin feature/your-feature`)
5. Open a pull request

Please open issues for bugs, feature requests, or questions.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💡 Acknowledgements

- [Zora Protocol](https://zora.co/)
- [Harvard Open Source Research](https://www.hbs.edu/ris/Publication%20Files/24-038_51f8444f-502c-4139-8bf2-56eb4b65c58a.pdf)
- [RainbowKit](https://www.rainbowkit.com/)
- [wagmi](https://wagmi.sh/)
- [Supabase](https://supabase.com/)

---

> "Open source is not just code—it's a global engine for innovation, efficiency, and economic growth."

# Team

Created by [Nestor Campos](https://www.linkedin.com/in/nescampos/). Wallet Id: 0xda3ec0b8bddd2e8bdedede3333fbaf938fcc18c5