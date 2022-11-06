var Patchwork = artifacts.require("Patchwork");
var PatchworkMetadata = artifacts.require("PatchworkMetadata");

module.exports = async function(deployer) {
  await deployer.deploy(Patchwork);
  await deployer.deploy(PatchworkMetadata);
};
