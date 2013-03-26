var Issue1 = new App.Models.Issue();
var newIssue = null;
//var Issue2 = new App.Models.Issue();
//var Project = new App.Models.Project();

var mainContext = App.main.context = new App.main.Context();
var captureContext = App.main.capture.context = new App.main.capture.Context({parentContext: mainContext });

var Project = mainContext.project;

describe('Project', function() {
    it('Project should have no id after creation', function() {
      return expect(Project.get('id')).to.be.undefined;
    });


    it('Project shound emit saved on save', function( done ){
        Project.on('saved',function(){ 
            done(); 
        });
        Project.set('name','bogus name');
        Project.save();
    });

    it('should create an Project nicely',function( done ){
        Project.save(null,{success:function(){
            done();
            }
        });
    });

    it('Project should have an id after creation', function(){
        expect(Project.get('id')).to.not.be.undefined;
    });


    it('Create and add new issue to the project', function( done ){
        var command = new captureContext.newIssue();
        command.context = captureContext;
        command.execute();

        newIssue = command.newIssue; 

        captureContext.issues.on('add',function(){
            done();
        });
    });

    var tempProjectID = null;

    it('loads issues for the extsting project', function( done ){
        this.timeout(10000);
        tempProjectID = Project.get('id');
        
        Project.set('id','4f9d830ae90a3e203400000b');

        captureContext.issues.on('add',function(){
            if( captureContext.issues.length === 9 ) {
                done();
            }
        });
        Project.fetch();
    });

    it('loads back the temporary project', function( done ){
        this.timeout(10000);
        Project.set('id',tempProjectID);

        var handler = function(){
            if( captureContext.issues.length === 1 ) {
                done();
            }
        };
        captureContext.issues.on('add',handler);
        captureContext.issues.on('remove',handler);

        Project.fetch();
    });

   /* it('removes issue after it is deleted', function( done ){

        captureContext.issues.on('remove', function(){
            if( captureContext.issues.length === 0 ){
                done();
            }
        });
        newIssue.destroy();
    });*/

   /* it('should clean up nicely after destroying Project', function( done ){
        this.timeout(10000);
        Project.destroy({success: function(){
            done();
            }
        });
    });
    */




});
