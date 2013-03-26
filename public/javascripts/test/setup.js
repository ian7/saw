/*global chai, mocha,jQuery*/   
   chai.should();
   expect = chai.expect;
   mocha.setup('bdd');
    jQuery(function () {
      mocha.setup({ignoreLeaks: true, bail: false});
      //mocha.bail(false);
      mocha
        .run()
        .globals(['App']); // acceptable globals
    });