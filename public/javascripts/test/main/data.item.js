/*global describe,it,App,expect*/
var item = new App.Models.Issue();
var itemClone = new App.Models.Issue();
var itemClone2 = new App.Models.Issue();

var issue2 = new App.Models.Issue();

describe('item', function() {
    it('should have no id after creation', function() {
      return expect(item.get('id')).to.be.undefined;
    });


    it('shound emit saved on save', function( done ){
        this.timeout(10000);
        item.on('saved',function(){ 
            done(); 
        });
        item.set('name','bogus name');
        item.save();
    });

    it('should create an item nicely',function( done ){
        item.save(null,{success:function(){
            done();
            }
        });
    });

    it('should have an id after creation', function(){
        expect(item.get('id')).to.not.be.undefined;
    });

    it('clone should get the same name as original ', function( done ){
        itemClone.set('id',item.get('id') );
        itemClone.fetch();

        itemClone.on('change',function(){
            if(itemClone.get('name')==='bogus name') {
                done();
            }
        });
    });

    it('second clone should be blazing fast', function( done ){
        itemClone2.set('id',item.get('id') );

        itemClone2.on('change',function(){
            if(itemClone2.get('name')==='bogus name') {
                done();
            }
        });

        itemClone2.fetch();
    });

    
    it('another issue should get an id on save', function( done ){
           issue2.on('change:id',function(){
               done();
           });
           issue2.save();
    });

    it('should have no relations if it is new', function(){
        expect(issue2.getRelationsTo().length).to.be.zero;
    });

    it('related items should get their collections updated', function(done){
        this.timeout(10000);
        issue2.updateRelationsTo = true;
        issue2.updateRelationsFrom = true;
        
        issue2.relationsTo.on('add',function(){
            done();
        });

        issue2.relate({
            relation: 'Implies',
            item: item
        })
        //expect(issue2.getRelationsTo().length).to.be.zero;
    });


    var mainContext = new App.main.Context();
    var captureContext =new App.main.capture.Context({parentContext: mainContext });

    it('should create related alternative', function( done ){
        this.timeout(10000);
        item.relationsTo.on('add', function( model ){
//            console.log('here!');
            done();
        });

        captureContext.trigger("capture:alternatives:create",{ model: item });

    });


    it('should clean up nicely after destroy', function( done ){
        item.destroy({success: function(){
            done();
            }
        });
    });
    



});
