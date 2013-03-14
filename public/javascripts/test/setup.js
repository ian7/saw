/*global chai, mocha,jQuery*/   
   chai.should();
   expect = chai.expect;
   mocha.setup('bdd');
    jQuery(function () {
      mocha
        .run()
        .globals(['App']); // acceptable globals
    });