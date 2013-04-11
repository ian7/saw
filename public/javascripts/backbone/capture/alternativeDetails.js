/*global App, Backbone,_,jQuery,JST,userName*/

App.module("main.capture",function(){
  this.Views.AlternativeDetails = Backbone.Marionette.CompositeView.extend({
    itemView: App.main.capture.Views.DecisionDetails,
    itemViewOptions: null, 
    itemViewContainer: "table.decisionDetails tbody",
    template: JST['capture/alternativeDetails'],
    tagName: "tr",
    className : "alternative", 
    events : {
/*        'mouseover' : 'mouseover',
        "click .deleteAlternative"  : "deleteAlternative",
        "click .unrelateAlternative": "unrelateAlternative",
        */
        "click .decide"             : "decide",
        "click .undecide"           : "undecide",
        "click #deleteAlternative"   : "deleteAlternative",
        "click #sealAlternative"    : 'onSealAlternative',
        "click #tags"   : 'onTags',
        "click #requestFocus"   : 'onRequestFocus',
        "click div#editRationale"   : "editRationale",
        "click #relate" : "relate",
        "click i#expand" : "expandClicked",
        "click span#header" : "expandClicked"
/*        'mouseout' : 'mouseout',
        'click div.name'    : 'edit',
*/
    },
    focusedUsers : {},

    initialize: function() {
        _(this).bindAll();
        
        // set-up superCollection of decisions around this alternative...
        this.collection = this.model.decisions;
        this.collection.comparator = this.projectComparator;
                
        this.collection.on('add',this.updateDecisionCount,this);
        this.collection.on('remove',this.updateDecisionCount,this);
        this.collection.on('change',this.updateDecisionCount,this);
        
        this.collection.on('add',this.onDecisionAdded,this);

        this.model.projectDecisions.on('add',this.updateDecisionCount,this);
        this.model.projectDecisions.on('remove',this.updateDecisionCount,this);

        this.model.on('notify',this.notified,this);

        // hook up for the notifications. 

        // set-up itemViews
        this.itemView = App.main.capture.Views.DecisionDetails;
        this.itemViewOptions = {context: this.context.parentContext};

        // set-up alternative attribtues editing:
        this.attributesView = new App.main.capture.Views.ItemAttributes({ model: this.model, startUnExpanded: true });
        // and hook up rendering it
        this.on('composite:model:rendered',this.onItemRendered,this);


       this.relatedToList = new App.main.capture.Views.ItemRelationList({
           context: this.context,
           collection: this.model.getRelationsTo(), 
           relationEnd: 'origin'
       });

       this.model.relationsTo.on('add',this.updateSealing,this);
       this.model.relationsTo.on('remove',this.updateSealing,this);

       this.relatedFromList = new App.main.capture.Views.ItemRelationList({
           context: this.context,
           collection: this.model.getRelationsFrom(),
           relationEnd: 'tip'
       });

       this.userDecided = false;

       },
    expandClicked : function(){
        var expandEl = jQuery("i#expand",this.el);
        // to be expanded
        if( expandEl.hasClass("icon-plus-sign") ){
            expandEl.removeClass("icon-plus-sign");
            expandEl.addClass("icon-minus-sign");

            jQuery(".expanded",this.el).slideDown();

            localStorage.setItem('expanded'+this.model.get('id'),true);
        }
        // to be shrunk
        else{
            expandEl.removeClass("icon-minus-sign");
            expandEl.addClass("icon-plus-sign");

            jQuery(".expanded",this.el).slideUp();
            localStorage.removeItem('expanded'+this.model.get('id'));
        }
        
    },
    notified : function( notification ){

        /* this should happen on the model level 

        // this catches notification of decision made - it is in distance of 2 hops!
        if( notification.distance === 2 ){
            if( notification.event === "dotag" || notification.event === 'destroy' ){            
            
                this.collection.fetch();
            }
        }

        */
       
       if( notification.distance === 0 && notification.event === 'requestFocus'){
           // let's remove focus from all other items
           jQuery('table.alternativeListDetails tr.alternative').removeClass('requestFocus');
           // and add only to this one. 
           jQuery(this.el).addClass('requestFocus');        
       }
    },
    onItemRendered : function(){
        // this way we start in unExpanded state
        jQuery(".expanded",this.el).hide();

        this.attributesView.el = jQuery("div.itemAttributes",this.el).first();
        this.attributesView.render();


        this.relatedToList.setElement(jQuery("div#relationsTo",this.el));
        this.relatedToList.render();

        this.relatedFromList.setElement(jQuery("div#relationsFrom",this.el));
        this.relatedFromList.render();

        this.updateDecisionCount();

        jQuery("#deleteAlternative",this.el).popover({
            trigger: 'hover',
            title: 'Delete',
            content: 'Delete this Alternative',
            placement: 'top'
        });

        jQuery("#sealAlternative",this.el).popover({
            trigger: 'hover',
            title: 'Seal',
            content: '(un)seal this Alternative',
            placement: 'top'
        });

        jQuery("#expand",this.el).popover({
            trigger: 'hover',
            title: 'Expand',
            content: 'Expand this Alternative',
            placement: 'right'
        });

        jQuery("#relate",this.el).popover({
            trigger: 'hover',
            title: 'Relate',
            content: 'Change relations to and from this Alternative',
            placement: 'top'
        });

        jQuery("#tags",this.el).popover({
            trigger: 'hover',
            title: 'Tags',
            content: 'Add and remove tags on this Alternative',
            placement: 'top'
        });

        jQuery("#requestFocus",this.el).popover({
            trigger: 'hover',
            title: 'Focus',
            content: 'Request your team to focus on this Alternative',
            placement: 'top'
        });

       if( localStorage.getItem('expanded'+this.model.get('id')) ){
            this.expandClicked();
       }

    },
    projectComparator : function( decision ){
            //return decision.get('id');        
            //return decision.findDecisionName( this.context.parentContext );
            if( decision.project ){
                return decision.project.get('name');
            }
            else{
                return "";
            }
    },
    updateDecisionCount : function(){
      //  this.collection.sort();
        var projectDecisions = this.model.projectDecisions;
    
        jQuery("span#projectDecisionCount",this.el).html( projectDecisions.length);

        if( projectDecisions.length === 0){
            jQuery("table.decisionDetails",this.el).hide();
        }
        else{
            jQuery("table.decisionDetails",this.el).show();            
        }

        jQuery("span#otherDecisionCount",this.el).html(this.collection.length - projectDecisions.length);

        // first I remove all coloring classes
        jQuery( this.el ).removeClass('colliding');
        _(this.context.parentContext.decisions.models).each(function( decision ){
            jQuery( this.el ).removeClass( decision.get('name').toLowerCase() );
        },this);
        // and then I add some
        if( this.model.isColliding( {project: this.context.parentContext.project }) ){
            jQuery( this.el ).addClass("colliding");
        }
        if( this.model.isDecided( {project: this.context.parentContext.project } ) ){

            var decisionID = this.model.decision( { project: this.context.parentContext.project } );
            var decisionTag = _(this.context.parentContext.decisions.models).where({id:decisionID})[0];

            // and then we just add name of the decision tag as a class
            jQuery( this.el ).addClass( decisionTag.get('name').toLowerCase() );
        }
        this.renderDecisionButtons();
    },
    
    renderDecisionButtons : function(){
            // we'll return this 
            
            var h = "";


            var projectDecisions = this.model.projectDecisions.models;

            // in case there are no 'our' decisions
            var myDecisions = _(projectDecisions).filter( function( decision ) {
                    return ( decision.get('author_name') === userName &&
                             !decision.get('revoked') );
                },this);
            
            if( myDecisions.length === 0 ){
                _(this.context.parentContext.decisions.models).each( function( decision ){
                    h += "<div class='button decide "+ decision.get('color').toLowerCase() +"'";
                    h += "id='"+ decision.get('name') + "' rel='whatever.html'>" + decision.get('name') /*+ "("+ decision.count + ")*/ + "</div><br/>";
                },this);
            }
            // in case that there already are 'our' decisions
            else{
                _(this.context.parentContext.decisions.models).each(function(decision) {
                    if( myDecisions[0].get('origin') === decision.get('id') ) { 
                        h += "<div class='button undecide " +  decision.get('color').toLowerCase() + "' id='" + decision.get('id') + "'>Revoke</div><br/>";
                    } 
                    else { 
                        h += "<div class='button disabled' id='" + decision.get('name') +"'>" + decision.get('name') + "</div><br/>";
                    }
                },this); 
            }

//            h += "<div class='button black expanded' id='relate'>Relate</div>";
            jQuery("div#decisionButtons",this.el).html( h );

            if( this.model.isSealed()) {
               jQuery("div.button",this.el)
                   .removeClass('red green blue orange')
                   .addClass('disabled')
                   .attr('id','');
            }
        },
    onRender : function(){
        this.updateSealing();
    },
    selectAll : function( e ){ 
        if( e.toElement.innerText === '(edit to add)') {
            document.execCommand('selectAll',false,null);
        }
    },
    deleteAlternative : function(){
      if( confirm("Are you sure that you want to delete design alternaitve named:\n"+this.model.get('name') ) ) {
        // and then destroy it.
        this.model.destroy();
        jQuery("div.popover").remove();
        }
    },
    unrelateAlternative : function() {
    },
    decide : function( event ) {
        var decisionName = event.target.id;
        this.userDecided = true;

        this.context.dispatch( "capture:alternative:decided",{ decisionName : decisionName, alternative: this.model });
     
    },
    undecide : function( event ) {
        //jQuery.getJSON( this.model.get('relation_url') + '/tag/untag?from_taggable_id='+element.target.id+'&project_id='+this.model.get('project_id'), function(data) {});      
        //
        var projectDecisions = this.model.projectDecisions.models;

        // in case there are no 'our' decisions
        var myDecisions = _(projectDecisions).filter( function( decision ) {
                return ( decision.get('author_name') === userName && 
                         decision.get('origin') === event.target.id );
            },this);

        _(myDecisions).each( function( decision ){
            decision.set('revoked','just because');
            decision.save();
        },this);

        //
//        jQuery("td.decisions", this.el).html("<img src='/images/ui-anim_basic_16x16.gif'/>");
    },
    editRationale : function( model ){
        var decisionModel = null;
        
        if( !model.attributes ){
        var projectDecisions = this.model.projectDecisions.models;
        
        // in case there are no 'our' decisions
        var myDecisions = _(projectDecisions).filter( function( decision ) {
                return ( decision.get('author_name') === userName &&
                    !decision.get('revoked'));
            },this);
        
        if( myDecisions.length === 0 ){
            return;
            }
        decisionModel = myDecisions[0];
        }
        else{
            decisionModel = model;
        }
        
        var rationaleWidget = new App.main.capture.Views.RationaleWidget( { context: this.context, model: decisionModel } );
        App.main.layout.modal.show( rationaleWidget );
    },
  /*  recordRationale : function() {
                alert('and here!');
                jQuery("div.rationaleText").keydown( function( e ) {

                    // if there is still decision id attached to the tooltip div
                    if( jQuery("div.tooltip").attr('id') ) {

                        // escape pressed
                        if( e.keyCode == 27 ){
                            jQuery("div.tooltip").hide();               
                        }
                        // enter pressed
                        if( e.keyCode == 13 ) {
                            jQuery("div.tooltip").hide();
                            // save the contents
                            jQuery.ajax({
                                url: "/rationales",
                                type: 'POST',
                                dataType: "json",
                                data: {
                                    name: jQuery("div.rationaleText").text(),
                                    decision_id: jQuery("div.tooltip").attr('id'),
                                }
                            });
                            jQuery("div.tooltip").removeAttr('id');
                        }
                    }

                });

                jQuery( "div.rationaleText" ).autocomplete({
                    source: function( request, response ) {
                        jQuery.ajax({
                            url: "/search/"+request.term+'?type=Rationale',
                            success: function( data ) {
                                response( jQuery.map( data, function( item ) {
                                    return {
                                        label: item.name,
                                        value: item.name,
                                        id: item._id
                                    };
                                }));
                            }
                        });
                    },
                    minLength: 0,
                    select: function( event, ui ) {
                        //alert( ui.item.id );
                        jQuery.getJSON( '/relations/relate?tip='+jQuery(this).parent().attr('id')+'&origin='+ui.item.id+'&relation_type=Tagging', function(data) {});
                        jQuery("div.tooltip").hide();   
                    },
                    open: function() {
                        jQuery( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
                    },
                    close: function() {
                        jQuery( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
                    }
                }); 
    },*/
    relate : function(){
        //this.context.item = this.model;
        this.context.dispatch("capture:item:relate",this.model);
        return false;
    },
    onTags : function(){
      var widget = new App.main.Views.TaggingWidget({context:App.main.context, model: this.model });
      App.main.layout.modal.show( widget );
      return false;
    },
    updateSealing : function(){
        var sealingEl = jQuery('#sealAlternative',this.el);
        if( this.model.isSealed() && !sealingEl.hasClass('icon-lock') ){
            sealingEl.addClass('icon-lock').removeClass('icon-unlock');
            // disable editing 
            //this.render();
            jQuery("div.editable",this.el).attr('contenteditable', 'false');
            this.renderDecisionButtons();
        }

        if( !this.model.isSealed() && !sealingEl.hasClass('icon-unlock')){
            sealingEl.addClass('icon-unlock').removeClass('icon-lock');
            // rerender the widget
            jQuery('body').oneTime(10,this.render);
        }
    },
    onSealAlternative : function(){
        jQuery("i#sealAlternative",this.el).mouseout();
        this.model.toggleSeal();
        return false;
    },
    onRequestFocus : function(){
        this.model.notify('requestFocus');
        return false;
    },
    onDecisionAdded : function( decision ){
        if( decision.get('author_name') === userName &&
            this.userDecided ){
            this.userDecided = false;
            this.editRationale( decision );
        }
    }
});
});