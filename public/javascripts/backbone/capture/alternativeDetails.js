/*global App, Backbone,_,jQuery,JST*/

App.module("main.capture",function(){
  this.Views.AlternativeDetails = Backbone.Marionette.CompositeView.extend({
    itemView: App.main.capture.Views.DecisionDetails,
    itemViewOptions: null, 
    itemViewContainer: "table.decisionDetails tbody",
    template: JST['capture/alternativeDetails'],
    tagName: "tr",
    className : "alternative", 
    templateHelpers: {
        renderDecisionButtons : function(){
            // we'll return this 
            var h = "";

            /* that's old code 
            if( !( this.your_decision && this.your_decision.name ) ) { 
                _(this.decisions).each(function(decision) { 
                    h += "<div class='button decide "+ decision.color.toLowerCase() +"'";
                    h += "id='"+ decision.decision_tag_id + "' rel='whatever.html'>" + decision.name + "("+ decision.count + ")</div>";
                }, this);
            } else { 
                _(this.decisions).each(function(decision) {
                    if( decision.name == this.your_decision.name ) { 
                        h += "<div class='button undecide " +  decision.color.toLowerCase() + "' id='" + decision.decision_tag_id + "'>Revoke(" + decision.count + ")</div>";
                    } 
                    else { 
                        h += "<div class='button disabled' id='" + decision.decision_tag_id +"'>" + decision.name +"(" + decision.count +")</div>";
                    }
                },this); 
            }
            */
            if( !this.context || !this.context.parentContext ){
                return "";
            }

            _(this.context.parentContext.decisions.models).each( function( decision ){
                h += "<div class='button decide "+ decision.get('Color') +"'";
                h += "id='"+ decision.get('name') + "' rel='whatever.html'>" + decision.get('name') /*+ "("+ decision.count + ")*/ + "</div><br>";
            },this);

            h += "<div class='button black' id='relate'>Relate</div>";
            return(h);
        }
    },
    events : {
/*        'mouseover' : 'mouseover',
        "click .deleteAlternative"  : "deleteAlternative",
        "click .unrelateAlternative": "unrelateAlternative",
        */
        "click .decide"             : "decide",
        "click .undecide"           : "undecide",
        "click div.button#deleteAlternative"   : "deleteAlternative",
        "click #relate" : "relate"
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
        
        if( !this.model.areDecisionsUpdated ){
            // here we pass mainContext reference. 
            this.model.updateDecisions(this.context.parentContext);
        }
        
        this.collection.on('add',this.updateDecisionCount,this);
        this.collection.on('remove',this.updateDecisionCount,this);
        this.collection.on('gotProjects',this.updateDecisionCount,this);
        
        this.model.on('notify',this.notified,this);

        // hook up for the notifications. 

        // set-up itemViews
        this.itemView = App.main.capture.Views.DecisionDetails;
        this.itemViewOptions = {context: this.context.parentContext};

        // set-up alternative attribtues editing:
        this.attributesView = new App.main.capture.Views.ItemAttributes({ model: this.model });
        // and hook up rendering it
        this.on('composite:model:rendered',this.onItemRendered,this);


       this.relatedToList = new App.main.capture.Views.ItemRelationList({
           context: this.context,
           collection: this.model.relationsTo,
           relationEnd: 'origin'
       });
       this.model.updateRelationsTo = true;
       this.model.getRelationsTo();

       this.relatedFromList = new App.main.capture.Views.ItemRelationList({
           context: this.context,
           collection: this.model.relationsFrom,
           relationEnd: 'tip'
       });
       this.model.updateRelationsFrom = true;
       this.model.getRelationsFrom();
        },
    notified : function( notification ){

        // this catches notification of decision made - it is in distance of 2 hops!
        if( notification.distance === 2 ){
            if( notification.event === "dotag" || notification.event === 'destroy' ){            
            
                this.collection.fetch();
            }
        }
    },
    onItemRendered : function(){
        this.attributesView.el = jQuery("div.itemAttributes",this.el).first();
        this.attributesView.render();


        this.relatedToList.setElement(jQuery("div#relationsTo",this.el));
        this.relatedToList.render();

        this.relatedFromList.setElement(jQuery("div#relationsFrom",this.el));
        this.relatedFromList.render();
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
        jQuery("span.decisionCount",this.el).html(this.collection.length);

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


    },
    onRender : function(){
  /*      var color = "white";
        if( this.model.attributes.decisions ) {
        _.each( this.model.attributes.decisions, function( decision ) {
            if( decision.count > 0 ) {
                if( color == 'white' ) {
                    color = decision.color;
                }
                else {
                    color = 'gray';
                }
            }
        });
        }
        // this colors decisions 
        jQuery(this.el).removeClass().addClass("decision").addClass(color.toLowerCase());
        */
       
       // let's render all the relations lists:
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
        }
    },
    unrelateAlternative : function() {
    },
    decide : function( event ) {
        var decisionName = event.target.id;

        this.context.dispatch( "capture:alternative:decided",{ decisionName : decisionName, alternative: this.model });
     
    },
    undecide : function(element) {
        jQuery.getJSON( this.model.get('relation_url') + '/tag/untag?from_taggable_id='+element.target.id+'&project_id='+this.model.get('project_id'), function(data) {});      
        jQuery("td.decisions", this.el).html("<img src='/images/ui-anim_basic_16x16.gif'/>");
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
        this.context.item = this.model;
        this.context.dispatch("capture:item:relate");
    }
});
});