xml.instruct! :xml, :version=>"1.0"



xml.graphml( 
	:xmlns=>"http://graphml.graphdrawing.org/xmlns",
	:"xmlns:xsi" =>:"http://www.w3.org/2001/XMLSchema-instance",
	:"xmlns:yed" =>:"http://www.yworks.com/xml/yed/3",
	:"xmlns:y"=> :"http://www.yworks.com/xml/graphml",
	:"xsi:schemaLocation" =>:"http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd" ) do


	xml.key :for=>"node", :id=>"d6", :"yfiles.type"=>"nodegraphics"
 	xml.key :id=>"name", :for=>"node", :"attr.name"=>"name", :"attr.type"=>"string"
	xml.graph( :edgedefault=>"directed", :id=>"G" )  do
		projects = Project.find(params[:project_id]).children 

		@issues.each do |issue|
			xml.node :id=>issue.id do
				xml.data :key=>"name" do
					xml.text! issue.name
				end
				xml.data :key=>"d6" do
					xml.y :ShapeNode do
								xml.y( :Fill, :color=>"#AAAAAA",:transparent=>"false")
								#xml.y( :Geometry, :height=>"40.0", :width=>"150.0", :x=>"0.0", :y=>"0.0" )
								xml.y( :BorderStyle, :color=>"#000000", :type=>"line", :width=>"1.0" )
		 						xml.y( :NodeLabel, issue.name,
									:alignment=>"center",
									:autoSizePolicy=>"content",
									:fontFamily=>"Dialog",
									:fontSize=>"12",
									:fontStyle=>"plain",
									:textColor=>"#000000",
								#	:width=>"100",
								#	:height=>"30",
									:visible=>"true" ) 
							xml.y :Shape, :type=>"roundrectangle"	
						end
					
				end
			end

			relations = issue.relations_to("SolvedBy").all
			
			relations.each do |relation|
				if not Taggable.exists?(:conditions=>{:id=>relation.origin})
					next
				end
				alternative = Taggable.find relation.origin
				xml.tag!("node", :id=>alternative.id ) do
					xml.data :key=>"d6" do
					xml.y :ShapeNode do
								xml.y( :Fill, :color=>"#FFCC00",:transparent=>"false")
								#xml.y( :Geometry, :height=>"40.0", :width=>"150.0", :x=>"0.0", :y=>"0.0" )
								xml.y( :BorderStyle, :color=>"#000000", :type=>"line", :width=>"1.0" )
		 						xml.y( :NodeLabel, alternative.name, 
									:alignment=>"center",
									:autoSizePolicy=>"content",
									:fontFamily=>"Dialog",
									:fontSize=>"12",
									:fontStyle=>"plain",
									:textColor=>"#000000",
									:modelName=>"internal",
									:modelPosition=>"c",
									:height=>"18.1328125",
									:y=>"5",
									:x=>"5",
									:visible=>"true" ) 
							xml.y :Shape, :type=>"ellipse"	
						end
					end
				end

				xml.tag!("edge", :id=>relation.id, :source=>relation.tip, :target=>relation.origin)
			end
		end
	end
end
  