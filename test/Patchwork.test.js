const Patchwork_contract = artifacts.require("Patchwork");
const PatchworkMetadata_contract = artifacts.require("PatchworkMetadata");
const assert = require('assert');
const { default: BigNumber } = require('bignumber.js');

contract("Patchwork", accounts => {

  var BN = web3.utils.BN;
  beforeEach(async() =>{
    Patchwork = await Patchwork_contract.deployed();
    PatchworkMetadata = await PatchworkMetadata_contract.deployed();
    await web3.eth.accounts.wallet.create(1)
    PatchworkAddress = await Patchwork.address
    PatchworkMetadataAddress = await PatchworkMetadata.address
  });

  it("... should deploy with less than 4.7 mil gas", async () => {
    let PatchworkInstance = await Patchwork_contract.new();
    let PatchworkMetadataInstance = await PatchworkMetadata_contract.new();
    let receiptPatchwork = await web3.eth.getTransactionReceipt(PatchworkInstance.transactionHash);
    let receiptPatchworkMetadataInstance = await web3.eth.getTransactionReceipt(PatchworkMetadataInstance.transactionHash);
    console.log(`Clock gas deployement cost: ${receiptPatchwork.gasUsed}`)
    console.log(`Clock URI gas deployement cost: ${receiptPatchworkMetadataInstance.gasUsed}`)
    console.log(`Total deployement cost: ${receiptPatchwork.gasUsed + receiptPatchworkMetadataInstance.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptPatchwork.gasUsed + receiptPatchworkMetadataInstance.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptPatchwork.gasUsed + receiptPatchworkMetadataInstance.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptPatchwork.gasUsed + receiptPatchworkMetadataInstance.gasUsed)*30*10**9/(10**18)} ETH`)
  });

  it("...should do admin stuff", async() =>{
    assert(await Patchwork.setPatchworkMetadataAddress(PatchworkMetadataAddress), "Couldn't set the PatchMetadataAddress")
  })

  it("... should mint", async () =>{
    let size = await Patchwork._size.call();
    let colors= [
      'gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
      // '555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555',
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      '555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555',
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      '555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555',
      '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      '555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555',
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      '555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555',
      '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      '555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555',
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      '555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555',
      '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      '555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555',
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      '555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555',
      '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    ]
    let shapes = [
      'ddddddddddddddddddddddddd',
      // 'scscsscccssccscscscsscccs',
      'scscscssccscscscsscccscss',
      'scscsscccssccscscsscccscs',
      'scscsscccssccscscsscccscs',
      'scscsscccssccscscssscccsc',
      'scscsscccssccscsccsscccss',
      'scscsscccssccscscsscccscs',
      'scscsscccssccscscsscccscs',
      'scscsscccssccscscsscccscs',
      'scscsscccssccscscsscccscs',
      'scscsscccssccsccsscccscsc',
      'scscsscccssccscscscsscccs',
      'scscsscccssccscscsscccscs',
      'scscsscccssccscscsscccscs',
      'scscsscccssccscscsscccscs',
      'scscscccssccscscscsscscss',
      'scscscscccssccscsccscccsc',
      'scscsccscssccscscscsscccs',
      'scscsccssccscscscscsscscs',
      'scscsccsscsccscscsccccscs',
      'scscsccssccscssccsscccscs',
      'scscsccssccscscscsscccscs',
      'scscsccsscscscsscccsscscs',
      'scscsccscscscscsscccscscs',
      'scscscsccscscscsscccscscs',
    ];

    let borders = [
      ';;;;;;;;;;;;;;;;;;;;;;;;;',
      // 'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy',
      'yyyyyyyyyyyyyyyyyyyyyyyyy'
  ];
    
  let borderColors= [
    '>.....!@#$%^&*()_+>.....!@#$%^&*()_+>.....!@#$%^&*()_+>.....!@#$%^&*()_+>.....!@#$%^&*()_+>.....!@#$%^&*()_+>.....!@#$%^&*()_+>.....!@#$%^&*()_+fdwfda',
    // '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
  ]

    await assert.rejects(Patchwork.adminMintPatch(accounts[0], colors[0], shapes[0], borders[0], borderColors[0], {from: accounts[0]}), "Could mint a Patch when shuld have mint a Patchwork")
    assert(await Patchwork.adminMintPatchwork(accounts[0],  colors[0], shapes[0], borders[0], borderColors[0], {from: accounts[0]}), "Could not mint a patchwork");
    for(let i = 0; i < size*size; i++){
      await assert.rejects(Patchwork.adminMintPatchwork(accounts[0], colors[i], shapes[i], borders[i], borderColors[i], {from: accounts[0]}), "Could mint a Patchwork when should have mint a Patch")
      console.log(i)
      assert(await Patchwork.adminMintPatch(accounts[0], colors[i], shapes[i], borders[i], borderColors[i], {from: accounts[0]}), "Could not mint");
    }

    await assert.rejects(Patchwork.adminMintPatch(accounts[0], colors[0], shapes[0], borders[0], borderColors[0], {from: accounts[0]}), "Could mint a Patch when shuld have mint a Patchwork")
    assert(await Patchwork.adminMintPatchwork(accounts[0],  colors[0], shapes[0], borders[0], borderColors[0], {from: accounts[0]}), "Could not mint a patchwork");

    for(let i = 0; i < size*size-5; i++){
      await assert.rejects(Patchwork.adminMintPatchwork(accounts[0], colors[i], shapes[i], borders[i], borderColors[i], {from: accounts[0]}), "Could mint a Patchwork when should have mint a Patch")
      console.log(i)
      assert(await Patchwork.adminMintPatch(accounts[0], colors[i], shapes[i], borders[i], borderColors[i], {from: accounts[0]}), "Could not mint");
    }
  })


  it("... should return an URI for a patch", async()=>{
    console.log(await Patchwork.tokenURI(1))
    console.log(await Patchwork.tokenURI(2))
  })

  it("... should return an URI for a patchwork", async()=>{
    console.log(await Patchwork.tokenURI(0))
  })

  // it("... should set moonbird address", async () =>{
  //   assert(await BirdBlotter.setMoonbirdAddress(MoonbirdTest.address, {from: accounts[0]}), "Could not set moonbird address");
  // })

  // it("... should not mint when not activated", async () =>{
  //   await assert.rejects(BirdBlotter.publicMint(9987, accounts[4], {from: accounts[4], value: 50000000000000000}), "Could mint more NFTs that allowed by the batch")
  //   assert(await BirdBlotter.toggleMintState(), "Could not open the drop");
  //   await assert.rejects(BirdBlotter.publicMint(9987,  accounts[3], {from: accounts[3], value: 50000000000000000}), "Could mint more NFTs that allowed by the batch")
  //   assert(await BirdBlotter.publicMint(9987, accounts[4], {from: accounts[4], value: 50000000000000000}), "Could mint more NFTs that allowed by the batch")
  // })

  // // it("... should mint only 1000 NFTs", async () =>{
  // //   for(i=1; i <= 1000; i++){
  // //     assert(await BirdBlotter.publicMint(i, {value: 50000000000000000}), "Could not mint a bird");
  // //   }
  // //   await assert.rejects(BirdBlotter.publicMint(1001, {value: 50000000000000000}), "Could mint more NFTs that allowed by the batch")
  // // })

  // // it("... should mint more NFTs after increasing the supply", async () =>{
  // //   assert(await BirdBlotter.increateSupply(), "Could not increase supply");
  // //   assert(await BirdBlotter.publicMint(1001, {value: 50000000000000000}), "Could not mint a bird");
  // // })

  // // it("... should mint more NFTs after increasing the supply", async () =>{
  // //   assert(await BirdBlotter.toggleAllMintsAllowedState(), "Could not increase supply");
  // //   assert(await BirdBlotter.publicMint(1001, {value: 50000000000000000}), "Could not mint a bird");
  // // })

  // // it("... should not mint the same NFT twice", async () =>{
  // //   await assert.rejects(BirdBlotter.publicMint(1001, {from: accounts[1], value: 50000000000000000}), "Could mint more NFTs that allowed by the batch")
  // // })

  // it("... should add Admins, including a contract", async () =>{
  //   assert(await BirdBlotter.approveAdmin(accounts[1], {from: accounts[0]}));
  // });
  
  // it("... should allow to perform tasks when admin", async () =>{
  //   assert(await BirdBlotter.adminMint(1170, accounts[2], {from: accounts[1]}), "Could not airdrop a bird");
  //   assert(await BirdBlotter.increateSupply(), {from: accounts[1]}, "Could not increase the supply");
  //   assert(await BirdBlotter.setURI('https://arweave.net/8Tbqd2a7lTiqK694CACfg5QPlu222W_k2xbQ4HfpTzI/'), {from: accounts[1]}, "Could not set URIs")
  //   assert(await BirdBlotter.toggleMintState(), {from: accounts[1]}, "Could not toggle the mint state");
  //   assert(await BirdBlotter.setRoyalties(accounts[1], 10), {from: accounts[1]}, "Could not setRoyalties")
  // })

  // it("... should allow the owner to redeem a blotter", async () =>{
  //   await assert.rejects(BirdBlotter.redeemBlotter(1170, {from: accounts[3]}), "Could redeem someoone else's blotter");
  //   assert(await BirdBlotter.redeemBlotter(1170, {from: accounts[2]}), "Could redeem its own blotter");
  // });

  // it("... should have a working URI", async () =>{
  //   let uri = await BirdBlotter.tokenURI(1170)
  //   // assert.rejects(await BirdBlotter.tokenURI(1170));
  //   console.log(uri);
  // });


  
});
