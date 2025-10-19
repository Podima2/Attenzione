# Attenzione!
<img width="1024" height="1024" alt="ChatGPT Image Oct 18, 2025, 09_01_14 PM" src="https://github.com/user-attachments/assets/307bebbb-bbe8-455c-bd31-e908ff2d67d3" />

# 🚇 Attenzione!

**Decentralized Crime Reporting for Rome Metro System**

Attenzione! is a blockchain-based platform for transparent, immutable crime reporting across Rome's metro network. Built on Ethereum with **ENS integration**, **IPFS storage**, and an immersive **3D visualization**, Attenzione! empowers citizens to report incidents while providing real-time safety insights through a dynamic crime density heatmap.

**Live Demo**: [Coming Soon] | **3D Scene**: Navigate Rome's 73 metro stations in an interactive WebGL environment

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Key Features](#-key-features)
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Smart Contracts](#-smart-contracts)
- [Contributing](#-contributing)
- [License](#-license)

---

## ⚡ Quick Start

To run the project locally, follow these steps:

```bash
# Install dependencies
yarn install

# Start local blockchain
yarn chain

# Deploy contracts & subgraph (in a new terminal)
yarn deploy
yarn subgraph:deploy

# Start frontend (in a new terminal)
yarn start

# Navigate to http://localhost:3000/scene
```

---

## 🎯 Key Features

### Core Functionality

- ✅ **Station-Based Reporting**: Submit crime reports for any of 73 Rome metro stations
- ✅ **Severity Scoring**: 0-10 scale for incident severity classification
- ✅ **IPFS Integration**: Immutable, decentralized report storage via Pinata
- ✅ **Smart Contract Registry**: On-chain station and report tracking
- ✅ **ENS Resolution**: Human-readable contract addresses (e.g., `termini.rome.crimenoviz.eth`)

### User Experience

- ✅ **3D Interactive Map**: WebGL-powered metro system visualization using Three.js
- ✅ **Dynamic Crime Heatmap**: Terrain elevation reflects report concentration
- ✅ **Station Search**: Autocomplete dropdown with fuzzy matching
- ✅ **Real-time Updates**: The Graph indexing for instant data synchronization

---

## 🧱 Architecture Overview

Attenzione! combines smart contracts, decentralized storage, blockchain indexing, and WebGL rendering to create an immersive, trustless crime data platform.

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
    ┌────┴─────┬──────────┬─────────┐
    │          │          │         │
┌───▼───┐  ┌──▼──┐  ┌────▼────┐ ┌─▼────┐
│Three.js│  │Wagmi│  │The Graph│ │ ENS  │
│(3D Map)│  │     │  │(Indexer)│ │      │
└────────┘  └──┬──┘  └────┬────┘ └──────┘
               │          │
            ┌──▼──────────▼──┐
            │ Smart Contracts│
            │   (Ethereum)   │
            └────────┬───────┘
                     │
                 ┌───▼────┐
                 │  IPFS  │
                 │(Pinata)│
                 └────────┘
```
<img width="3686" height="1864" alt="Untitled diagram-2025-10-18-200913" src="https://github.com/user-attachments/assets/3292b29f-f109-44da-a6f7-1a66237bbead" />

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Three.js** & `@react-three/fiber`
- **Tailwind CSS**

### Smart Contracts
- **Solidity 0.8.13**
- **Hardhat**
- **Ethers.js v6**
- **OpenZeppelin**

### Infrastructure
- **Ethereum** (Local/Sepolia)
- **The Graph** (Indexing)
- **IPFS** (Pinata)
- **ENS** (Ethereum Name Service)

### Development Tools
- **Scaffold-ETH 2**
- **Hardhat Deploy**
- **Docker**
- **Wagmi**

---

## 📁 Project Structure

```
attenzione/
├── packages/
│   ├── hardhat/          # Smart contracts & deployment
│   │   ├── contracts/
│   │   ├── deploy/
│   │   └── test/
│   ├── nextjs/           # Frontend application
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── public/
│   └── subgraph/         # The Graph indexing
│       ├── src/
│       └── subgraph.yaml
├── docker-compose.yml
└── package.json
```

---

## 📜 Smart Contracts

### Core Contracts

**StationRegistry.sol**
- Manages the 73 Rome metro stations
- Stores station metadata (name, line, coordinates)
- Emits events for station creation

**CrimeReportRegistry.sol**
- Records crime reports linked to stations
- Stores IPFS hashes for detailed reports
- Implements severity scoring (0-10)
- Enables report querying and filtering

### ENS Integration

Contracts are accessible via human-readable ENS names:
- `termini.rome.crimenoviz.eth`
- `colosseo.rome.crimenoviz.eth`
- `spagna.rome.crimenoviz.eth`

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (ESLint + Prettier)
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Scaffold-ETH 2](https://scaffoldeth.io/)
- Rome metro station data from [ATAC Open Data](https://romamobilita.it/)
- 3D rendering powered by [Three.js](https://threejs.org/)
- Decentralized storage via [IPFS](https://ipfs.io/)

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)
- **Twitter**: [@AttenzioneDAO](#)

---

<div align="center">
  
**⚠️ Attenzione! - Making Rome Metro Safer Through Transparency**

Built with ❤️ by the community, for the community

[Report an Incident](#) • [View 3D Map](#) • [Documentation](#)

</div>