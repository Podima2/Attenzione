import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const ROME_METRO_STATIONS = [
  // Line A (Battistini ↔ Anagnina)
    { name: "Battistini", id: "battistini", lines: "A", order: 0 },
    { name: "Cornelia", id: "cornelia", lines: "A", order: 1 },
    { name: "Baldo Degli Ubaldi", id: "baldo-degli-ubaldi", lines: "A", order: 2 },
    { name: "Valle Aurelia", id: "valle-aurelia", lines: "A", order: 3 },
    { name: "Cipro", id: "cipro", lines: "A", order: 4 },
    { name: "Ottaviano-San Pietro-Musei Vaticani", id: "ottaviano", lines: "A", order: 5 },
    { name: "Lepanto", id: "lepanto", lines: "A", order: 6 },
    { name: "Flaminio-Piazza del Popolo", id: "flaminio", lines: "A", order: 7 },
    { name: "Spagna", id: "spagna", lines: "A", order: 8 },
    { name: "Barberini-Fontana di Trevi", id: "barberini", lines: "A", order: 9 },
    { name: "Repubblica-Teatro dell'Opera", id: "repubblica", lines: "A", order: 10 },
    { name: "Termini", id: "termini", lines: "A,B,C", order: 11 },
    { name: "Vittorio Emanuele", id: "vittorio-emanuele", lines: "A", order: 12 },
    { name: "Manzoni-Museo della Liberazione", id: "manzoni", lines: "A", order: 13 },
    { name: "San Giovanni", id: "san-giovanni", lines: "A,C", order: 14 },
    { name: "Re di Roma", id: "re-di-roma", lines: "A", order: 15 },
    { name: "Ponte Lungo", id: "ponte-lungo", lines: "A", order: 16 },
    { name: "Furio Camillo", id: "furio-camillo", lines: "A", order: 17 },
    { name: "Colli Albani", id: "colli-albani", lines: "A", order: 18 },
    { name: "Arco di Travertino", id: "arco-di-travertino", lines: "A", order: 19 },
    { name: "Porta Furba-Quadraro", id: "porta-furba", lines: "A", order: 20 },
    { name: "Numidio Quadrato", id: "numidio-quadrato", lines: "A", order: 21 },
    { name: "Lucio Sestio", id: "lucio-sestio", lines: "A", order: 22 },
    { name: "Giulio Agricola", id: "giulio-agricola", lines: "A", order: 23 },
    { name: "Subaugusta", id: "subaugusta", lines: "A", order: 24 },
    { name: "Cinecittà", id: "cinecitt", lines: "A", order: 25 },
    { name: "Anagnina", id: "anagnina", lines: "A", order: 26 },
  
    // Line B (Laurentina ↔ Rebibbia)
    { name: "Laurentina", id: "laurentina", lines: "B", order: 0 },
    { name: "EUR Fermi", id: "eur-fermi", lines: "B", order: 1 },
    { name: "EUR Palasport", id: "eur-palasport", lines: "B", order: 2 },
    { name: "EUR Magliana", id: "eur-magliana", lines: "B", order: 3 },
    { name: "Marconi", id: "marconi", lines: "B", order: 4 },
    { name: "Basilica S. Paolo", id: "basilica-s-paolo", lines: "B", order: 5 },
    { name: "Garbatella", id: "garbatella", lines: "B", order: 6 },
    { name: "Piramide", id: "piramide", lines: "B", order: 7 },
    { name: "Circo Massimo", id: "circo-massimo", lines: "B", order: 8 },
    { name: "Colosseo", id: "colosseo", lines: "B", order: 9 },
    { name: "Cavour", id: "cavour", lines: "B", order: 10 },
    { name: "Termini", id: "termini", lines: "A,B,C", order: 11 },
    { name: "Castro Pretorio", id: "castro-pretorio", lines: "B", order: 12 },
    { name: "Policlinico", id: "policlinico", lines: "B", order: 13 },
    { name: "Bologna", id: "bologna", lines: "B,B1", order: 14 },
    { name: "Tiburtina", id: "tiburtina", lines: "B", order: 15 },
    { name: "Quintiliani", id: "quintiliani", lines: "B", order: 16 },
    { name: "Monti Tiburtini", id: "monti-tiburtini", lines: "B", order: 17 },
    { name: "Pietralata", id: "pietralata", lines: "B", order: 18 },
    { name: "Santa Maria del Soccorso", id: "santa-maria-soccorso", lines: "B", order: 19 },
    { name: "Ponte Mammolo", id: "ponte-mammolo", lines: "B", order: 20 },
    { name: "Rebibbia", id: "rebibbia", lines: "B", order: 21 },
  
    // Line B1 (Bologna ↔ Jonio)
    { name: "Bologna", id: "bologna", lines: "B,B1", order: 0 },
    { name: "Sant'Agnese/Annibaliano", id: "sant-agnese", lines: "B1", order: 1 },
    { name: "Libia", id: "libia", lines: "B1", order: 2 },
    { name: "Conca d'Oro", id: "conca-d-oro", lines: "B1", order: 3 },
    { name: "Jonio", id: "jonio", lines: "B1", order: 4 },
  
    // Line C (San Giovanni ↔ Monte Compatri/Pantano)
    { name: "San Giovanni", id: "san-giovanni", lines: "A,C", order: 0 },
    { name: "Lodi", id: "lodi", lines: "C", order: 1 },
    { name: "Pigneto", id: "pigneto", lines: "C", order: 2 },
    { name: "Malatesta", id: "malatesta", lines: "C", order: 3 },
    { name: "Teano", id: "teano", lines: "C", order: 4 },
    { name: "Gardenie", id: "gardenie", lines: "C", order: 5 },
    { name: "Mirti", id: "mirti", lines: "C", order: 6 },
    { name: "Parco di Centocelle", id: "parco-centocelle", lines: "C", order: 7 },
    { name: "Alessandrino", id: "alessandrino", lines: "C", order: 8 },
    { name: "Torre Spaccata", id: "torre-spaccata", lines: "C", order: 9 },
    { name: "Torre Maura", id: "torre-maura", lines: "C", order: 10 },
    { name: "Giardinetti", id: "giardinetti", lines: "C", order: 11 },
    { name: "Torrenova", id: "torrenova", lines: "C", order: 12 },
    { name: "Torre Angela", id: "torre-angela", lines: "C", order: 13 },
    { name: "Torre Gaia", id: "torre-gaia", lines: "C", order: 14 },
    { name: "Grotte Celoni", id: "grotte-celoni", lines: "C", order: 15 },
    { name: "Due Leoni – Fontana Candida", id: "due-leoni", lines: "C", order: 16 },
    { name: "Borghesiana", id: "borghesiana", lines: "C", order: 17 },
    { name: "Bolognetta", id: "bolognetta", lines: "C", order: 18 },
    { name: "Graniti", id: "graniti", lines: "C", order: 19 },
    { name: "Finocchio", id: "finocchio", lines: "C", order: 20 },
    { name: "Monte Compatri-Pantano", id: "monte-compatri", lines: "C", order: 21 },
  ];


const deployRomeMetro: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🚀 Deploying CrimeRegistry for Rome Metro...\n");

  const deployment = await deploy("CrimeRegistry", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Only create stations if this is a new deployment
  if (!deployment.newlyDeployed) {
    console.log("⏭️  CrimeRegistry already deployed, skipping station creation\n");
    return;
  }

  const crimeRegistry = await hre.ethers.getContract<Contract>(
    "CrimeRegistry",
    deployer
  );
  const contractAddress = await crimeRegistry.getAddress();

  console.log(`✅ CrimeRegistry deployed to: ${contractAddress}\n`);
  console.log("📍 Creating Rome Metro stations...\n");

  const createdStations = new Set<string>();

  for (const station of ROME_METRO_STATIONS) {
    if (createdStations.has(station.id)) {
      console.log(` ⊘ Skipped: ${station.name} (already created)`);
      continue;
    }

    try {
      const tx = await crimeRegistry.createStation(
        station.id,
        station.name,
        "rome",
        station.lines,
        station.order
      );

      await tx.wait();
      createdStations.add(station.id);
      console.log(` ✓ Created: ${station.name} (Lines: ${station.lines})`);
    } catch (error) {
      console.log(` ✗ Error creating ${station.name}:`, error);
    }
  }

  console.log("\n✅ Deployment complete!");
  console.log(`\n📋 Contract Address: ${contractAddress}`);
  console.log(`📍 Total Unique Stations Created: ${createdStations.size}`);
  console.log(`🚇 Coverage: 3 Lines (A, B/B1, C)`);
};

export default deployRomeMetro;
deployRomeMetro.tags = ["CrimeRegistry"];