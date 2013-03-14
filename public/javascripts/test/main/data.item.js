/*global describe,it,App,expect*/
var Item = new App.Models.Issue();


describe('Item', function() {
  describe('create without id', function() {
    it('should have no id after creation', function() {
      return expect(Item.get('id')).to.be.undefined;
    });


    it('shound emit sync on save', function( done ){
        Item.on('saved',function(){ 
            done(); 
        });
        Item.set('name','bogus name');
        Item.save();
    });


    it('should create an item nicely',function( done ){
        Item.save(null,{success:function(){
            done();
            }
        });
    });

    it('should have an id after creation', function(){
        expect(Item.get('id')).to.not.be.undefined;
    });

    var mainContext = new App.main.Context();
    var captureContext =new App.main.capture.Context({parentContext: mainContext });

    it('should create related alternative', function( done ){

        Item.relationsTo.on('add', function( model ){
//            console.log('here!');
            done();
        });

        captureContext.trigger("capture:alternatives:create",{ model: Item });

    });


    it('should clean up nicely after destroy', function( done ){
        Item.destroy({success: function(){
            done();
            }
        });
    });
    



  });

});
