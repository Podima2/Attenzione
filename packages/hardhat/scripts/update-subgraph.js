const fs = require('fs')
const path = require('path')

async function main() {
  // Read CrimeRegistry deployment
  const deploymentPath = path.join(__dirname, '../deployments/localhost/CrimeRegistry.json')
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'))
  
  const address = deployment.address
  const blockNumber = deployment.receipt.blockNumber
  
  console.log(`📝 Updating subgraph.yaml...`)
  console.log(`   Address: ${address}`)
  console.log(`   StartBlock: ${blockNumber}`)
  
  // Read subgraph.yaml
  const subgraphPath = path.join(__dirname, '../../subgraph/subgraph.yaml')
  let yaml = fs.readFileSync(subgraphPath, 'utf8')
  
  // Replace address
  yaml = yaml.replace(/address: "0x[a-fA-F0-9]{40}"/, `address: "${address}"`)
  
  // Replace or add startBlock
  if (yaml.includes('startBlock:')) {
    yaml = yaml.replace(/startBlock: \d+/, `startBlock: ${blockNumber}`)
  } else {
    yaml = yaml.replace(
      /(address: "0x[a-fA-F0-9]{40}")/,
      `$1\n      startBlock: ${blockNumber}`
    )
  }
  
  fs.writeFileSync(subgraphPath, yaml)
  console.log(`✅ Updated subgraph.yaml`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })