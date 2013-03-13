/*global chai, mocha,jQuery*/   
   chai.should();
   mocha.setup('bdd');
    jQuery(function () {
      mocha
        .run()
        .globals(['App']); // acceptable globals
    });