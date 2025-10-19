import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

// Sepolia ENS Base Registrar Controller address
const ENS_REGISTRY_SEPOLIA = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"

const ROME_STATIONS = [
  { "id": "battistini", "name": "Battistini", "ensName": "battistini.rome.crimenoviz.eth" },
  { "id": "cornelia", "name": "Cornelia", "ensName": "cornelia.rome.crimenoviz.eth" },
  { "id": "baldo-degli-ubaldi", "name": "Baldo Degli Ubaldi", "ensName": "baldo-degli-ubaldi.rome.crimenoviz.eth" },
  { "id": "valle-aurelia", "name": "Valle Aurelia", "ensName": "valle-aurelia.rome.crimenoviz.eth" },
  { "id": "cipro", "name": "Cipro", "ensName": "cipro.rome.crimenoviz.eth" },
  { "id": "ottaviano-san-pietro-musei-vaticani", "name": "Ottaviano-San Pietro-Musei Vaticani", "ensName": "ottaviano-san-pietro-musei-vaticani.rome.crimenoviz.eth" },
  { "id": "lepanto", "name": "Lepanto", "ensName": "lepanto.rome.crimenoviz.eth" },
  { "id": "flaminio-piazza-del-popolo", "name": "Flaminio-Piazza del Popolo", "ensName": "flaminio-piazza-del-popolo.rome.crimenoviz.eth" },
  { "id": "spagna", "name": "Spagna", "ensName": "spagna.rome.crimenoviz.eth" },
  { "id": "barberini-fontana-di-trevi", "name": "Barberini-Fontana di Trevi", "ensName": "barberini-fontana-di-trevi.rome.crimenoviz.eth" },
  { "id": "repubblica-teatro-dellopera", "name": "Repubblica-Teatro dell'Opera", "ensName": "repubblica-teatro-dellopera.rome.crimenoviz.eth" },
  { "id": "termini", "name": "Termini", "ensName": "termini.rome.crimenoviz.eth" },
  { "id": "vittorio-emanuele", "name": "Vittorio Emanuele", "ensName": "vittorio-emanuele.rome.crimenoviz.eth" },
  { "id": "manzoni-museo-della-liberazione", "name": "Manzoni-Museo della Liberazione", "ensName": "manzoni-museo-della-liberazione.rome.crimenoviz.eth" },
  { "id": "san-giovanni", "name": "San Giovanni", "ensName": "san-giovanni.rome.crimenoviz.eth" },
  { "id": "re-di-roma", "name": "Re di Roma", "ensName": "re-di-roma.rome.crimenoviz.eth" },
  { "id": "ponte-lungo", "name": "Ponte Lungo", "ensName": "ponte-lungo.rome.crimenoviz.eth" },
  { "id": "furio-camillo", "name": "Furio Camillo", "ensName": "furio-camillo.rome.crimenoviz.eth" },
  { "id": "colli-albani", "name": "Colli Albani", "ensName": "colli-albani.rome.crimenoviz.eth" },
  { "id": "arco-di-travertino", "name": "Arco di Travertino", "ensName": "arco-di-travertino.rome.crimenoviz.eth" },
  { "id": "porta-furba-quadraro", "name": "Porta Furba-Quadraro", "ensName": "porta-furba-quadraro.rome.crimenoviz.eth" },
  { "id": "numidio-quadrato", "name": "Numidio Quadrato", "ensName": "numidio-quadrato.rome.crimenoviz.eth" },
  { "id": "lucio-sestio", "name": "Lucio Sestio", "ensName": "lucio-sestio.rome.crimenoviz.eth" },
  { "id": "giulio-agricola", "name": "Giulio Agricola", "ensName": "giulio-agricola.rome.crimenoviz.eth" },
  { "id": "subaugusta", "name": "Subaugusta", "ensName": "subaugusta.rome.crimenoviz.eth" },
  { "id": "cinecitta", "name": "Cinecittà", "ensName": "cinecitta.rome.crimenoviz.eth" },
  { "id": "anagnina", "name": "Anagnina", "ensName": "anagnina.rome.crimenoviz.eth" },
  { "id": "laurentina", "name": "Laurentina", "ensName": "laurentina.rome.crimenoviz.eth" },
  { "id": "eur-fermi", "name": "EUR Fermi", "ensName": "eur-fermi.rome.crimenoviz.eth" },
  { "id": "eur-palasport", "name": "EUR Palasport", "ensName": "eur-palasport.rome.crimenoviz.eth" },
  { "id": "eur-magliana", "name": "EUR Magliana", "ensName": "eur-magliana.rome.crimenoviz.eth" },
  { "id": "marconi", "name": "Marconi", "ensName": "marconi.rome.crimenoviz.eth" },
  { "id": "basilica-s-paolo", "name": "Basilica S. Paolo", "ensName": "basilica-s-paolo.rome.crimenoviz.eth" },
  { "id": "garbatella", "name": "Garbatella", "ensName": "garbatella.rome.crimenoviz.eth" },
  { "id": "piramide", "name": "Piramide", "ensName": "piramide.rome.crimenoviz.eth" },
  { "id": "circo-massimo", "name": "Circo Massimo", "ensName": "circo-massimo.rome.crimenoviz.eth" },
  { "id": "colosseo", "name": "Colosseo", "ensName": "colosseo.rome.crimenoviz.eth" },
  { "id": "cavour", "name": "Cavour", "ensName": "cavour.rome.crimenoviz.eth" },
  { "id": "castro-pretorio", "name": "Castro Pretorio", "ensName": "castro-pretorio.rome.crimenoviz.eth" },
  { "id": "policlinico", "name": "Policlinico", "ensName": "policlinico.rome.crimenoviz.eth" },
  { "id": "bologna", "name": "Bologna", "ensName": "bologna.rome.crimenoviz.eth" },
  { "id": "santagnese-annibaliano", "name": "Sant'Agnese/Annibaliano", "ensName": "santagnese-annibaliano.rome.crimenoviz.eth" },
  { "id": "libia", "name": "Libia", "ensName": "libia.rome.crimenoviz.eth" },
  { "id": "conca-doro", "name": "Conca d'Oro", "ensName": "conca-doro.rome.crimenoviz.eth" },
  { "id": "jonio", "name": "Jonio", "ensName": "jonio.rome.crimenoviz.eth" },
  { "id": "tiburtina", "name": "Tiburtina", "ensName": "tiburtina.rome.crimenoviz.eth" },
  { "id": "quintiliani", "name": "Quintiliani", "ensName": "quintiliani.rome.crimenoviz.eth" },
  { "id": "monti-tiburtini", "name": "Monti Tiburtini", "ensName": "monti-tiburtini.rome.crimenoviz.eth" },
  { "id": "pietralata", "name": "Pietralata", "ensName": "pietralata.rome.crimenoviz.eth" },
  { "id": "santa-maria-del-soccorso", "name": "Santa Maria del Soccorso", "ensName": "santa-maria-del-soccorso.rome.crimenoviz.eth" },
  { "id": "ponte-mammolo", "name": "Ponte Mammolo", "ensName": "ponte-mammolo.rome.crimenoviz.eth" },
  { "id": "rebibbia", "name": "Rebibbia", "ensName": "rebibbia.rome.crimenoviz.eth" },
  { "id": "lodi", "name": "Lodi", "ensName": "lodi.rome.crimenoviz.eth" },
  { "id": "pigneto", "name": "Pigneto", "ensName": "pigneto.rome.crimenoviz.eth" },
  { "id": "malatesta", "name": "Malatesta", "ensName": "malatesta.rome.crimenoviz.eth" },
  { "id": "teano", "name": "Teano", "ensName": "teano.rome.crimenoviz.eth" },
  { "id": "gardenie", "name": "Gardenie", "ensName": "gardenie.rome.crimenoviz.eth" },
  { "id": "mirti", "name": "Mirti", "ensName": "mirti.rome.crimenoviz.eth" },
  { "id": "parco-di-centocelle", "name": "Parco di Centocelle", "ensName": "parco-di-centocelle.rome.crimenoviz.eth" },
  { "id": "alessandrino", "name": "Alessandrino", "ensName": "alessandrino.rome.crimenoviz.eth" },
  { "id": "torre-spaccata", "name": "Torre Spaccata", "ensName": "torre-spaccata.rome.crimenoviz.eth" },
  { "id": "torre-maura", "name": "Torre Maura", "ensName": "torre-maura.rome.crimenoviz.eth" },
  { "id": "giardinetti", "name": "Giardinetti", "ensName": "giardinetti.rome.crimenoviz.eth" },
  { "id": "torrenova", "name": "Torrenova", "ensName": "torrenova.rome.crimenoviz.eth" },
  { "id": "torre-angela", "name": "Torre Angela", "ensName": "torre-angela.rome.crimenoviz.eth" },
  { "id": "torre-gaia", "name": "Torre Gaia", "ensName": "torre-gaia.rome.crimenoviz.eth" },
  { "id": "grotte-celoni", "name": "Grotte Celoni", "ensName": "grotte-celoni.rome.crimenoviz.eth" },
  { "id": "due-leoni-fontana-candida", "name": "Due Leoni ‒ Fontana Candida", "ensName": "due-leoni-fontana-candida.rome.crimenoviz.eth" },
  { "id": "borghesiana", "name": "Borghesiana", "ensName": "borghesiana.rome.crimenoviz.eth" },
  { "id": "bolognetta", "name": "Bolognetta", "ensName": "bolognetta.rome.crimenoviz.eth" },
  { "id": "graniti", "name": "Graniti", "ensName": "graniti.rome.crimenoviz.eth" },
  { "id": "finocchio", "name": "Finocchio", "ensName": "finocchio.rome.crimenoviz.eth" },
  { "id": "monte-compatri-pantano", "name": "Monte Compatri-Pantano", "ensName": "monte-compatri-pantano.rome.crimenoviz.eth" }
];

const BATCH_SIZE = 10;
// --- REMOVE HARDCODED FEE ---
// const AGGRESSIVE_FEE = 30000000000; 
// Use a reasonable gas limit for contract deployment (~6 million is safe for most contracts)
const DEPLOYMENT_GAS_LIMIT = 6000000; 
const STATION_DEPLOY_GAS_LIMIT = 5000000;

const deployStationFactory: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts()
  const { deploy } = hre.deployments
  
  const isLocal = hre.network.name === 'localhost' || hre.network.name === 'hardhat'

  console.log("🏭 Deploying Station Factory System...\n")

  let ensRegistryAddress: string

  // --- 1. Deploy MockENSRegistry ---
  console.log("📝 Deploying MockENSRegistry...")
  const ensRegistry = await deploy("MockENSRegistry", {
    from: deployer,
    args: [],
    log: true,
    autoMine: isLocal,
    // ❌ REMOVED: maxFeePerGas: AGGRESSIVE_FEE,
    // ❌ REMOVED: maxPriorityFeePerGas: AGGRESSIVE_FEE,
    gasLimit: DEPLOYMENT_GAS_LIMIT,
  })
  ensRegistryAddress = ensRegistry.address
  console.log(`✅ MockENSRegistry: ${ensRegistryAddress}`)
  
  // 🚩 CRITICAL WAIT: Wait for the first contract to be fully mined before starting the second deployment
  if (!isLocal) {
    console.log("⏳ Waiting 15 seconds to ensure MockENSRegistry transaction is confirmed...")
    await new Promise(resolve => setTimeout(resolve, 15000));
  }
  console.log('\n')


  // --- 2. Deploy StationFactory ---
  console.log("🏭 Deploying StationFactory...")
  const factory = await deploy("StationFactory", {
    from: deployer,
    args: [ensRegistryAddress],
    log: true,
    autoMine: isLocal,
    // ❌ REMOVED: maxFeePerGas: AGGRESSIVE_FEE,
    // ❌ REMOVED: maxPriorityFeePerGas: AGGRESSIVE_FEE,
    gasLimit: DEPLOYMENT_GAS_LIMIT,
  })
  console.log(`✅ StationFactory: ${factory.address}\n`)

  // Get contract instances
  const ensRegistryContract = await hre.ethers.getContract("MockENSRegistry", deployer)
  const factoryContract = await hre.ethers.getContract("StationFactory", deployer)

  // --- 3. Transfer ENS ownership to factory ---
  console.log("🔑 Transferring ENS registry ownership to factory...")
  const transferTx = await ensRegistryContract.transferOwnership(factory.address, { 
    // ❌ REMOVED: maxFeePerGas: AGGRESSIVE_FEE,
    // ❌ REMOVED: maxPriorityFeePerGas: AGGRESSIVE_FEE,
  })
  await transferTx.wait()
  
  const newOwner = await ensRegistryContract.owner()
  console.log(`✅ Ownership transferred to: ${newOwner}\n`)
  
  if (newOwner !== factory.address) {
    throw new Error("❌ Ownership transfer failed!")
  }

  // --- 4. Deploy Stations (Batched) ---
  console.log("\n🚇 Deploying station contracts in batches...\n")
  
  let successCount = 0
  let failCount = 0
  
  for (let i = 0; i < ROME_STATIONS.length; i += BATCH_SIZE) {
    const batch = ROME_STATIONS.slice(i, i + BATCH_SIZE);
    
    console.log(`--- Starting Batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} stations) ---`)
    
    for (const station of batch) {
      try {
        console.log(`Deploying ${station.name}...`)
        
        const tx = await factoryContract.deployStation(
          station.id,
          station.name,
          "rome",
          station.ensName,
          { 
            // ❌ REMOVED: maxFeePerGas: AGGRESSIVE_FEE,
            // ❌ REMOVED: maxPriorityFeePerGas: AGGRESSIVE_FEE,
            gasLimit: STATION_DEPLOY_GAS_LIMIT,
          } 
        )
        await tx.wait()
        
        const stationAddress = await factoryContract.getStationAddress(station.id)
        console.log(`   ✓ ${station.name}`)
        console.log(`     ENS: ${station.ensName}`)
        console.log(`     Contract: ${stationAddress}\n`)
        
        successCount++
      } catch (error: any) {
        console.log(`   ✗ Failed: ${station.name}`)
        console.log(`     Error: ${error.message}\n`)
        failCount++
      }
    }

    // Wait 10 seconds between batches to let transactions confirm
    if (i + BATCH_SIZE < ROME_STATIONS.length) {
        console.log(`⏸️ Batch complete. Waiting 10 seconds before next batch...`)
        await new Promise(resolve => setTimeout(resolve, 10000));
        console.log(`▶️ Resuming deployment.\n`)
    }
  }

  console.log("\n✅ Station Factory deployment complete!")
  console.log(`📊 Deployed: ${successCount}/${ROME_STATIONS.length}`)
  if (failCount > 0) console.log(`⚠️  Failed: ${failCount}`)
}

export default deployStationFactory
deployStationFactory.tags = ["StationFactory"]