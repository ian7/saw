require_relative './logItem.rb'
require_relative './solvedBy.rb'

class AlternativeLogItem < LogItem
	def initialize( paramId = nil, paramEvents = nil )
		super paramId, paramEvents
	end
	def status
	end
	def analyze
		@events = []
		eventClasses = [CreationEvent,UpdateEvent,FocusEvent,RelationEvent,DestructionEvent]
		eventClasses.each{ |x| @events.concat( x.find( self.id, @allEvents ) ) }

		# this instantiates SolvedBy items 
		@events.concat( statuses )

		if relate
			@solvedByID = relate.to_id
		end

		@sortedEvents = @events.sort {|x,y| x.time.to_i <=> y.time.to_i }

		return @sortedEvents
	end

	def to_s
		@sortedEvents.each do |x|
			@output.puts x.to_s( self ) 
		end
	end

	def creation
		e = @filteredEvents.find { |x| x.controller == 'create' && x.distance == '0' && x.itemType == 'Alternative'}
		if( e )
			return CreationEvent.new( e )
		else
			puts 'no creation'
		end
	end
	def update
		return @filteredEvents.select { |x| x.verb == 'PUT' && x.action == 'update' } .map { |x| UpdateEvent.new(x) } 
	end	
	def relate
		ce = @filteredEvents.find { |x| x.controller == 'create' && x.distance == '0' && x.itemType == 'Alternative'}
		
		if not ce
			return nil
		end
		
		ie = @allEvents.find{ |x| x.time == ce.time && 
			x.user == ce.user && 
			x.distance == '1' &&
			x.itemType == 'Issue' &&
			x.controller == 'relate' &&
			x.action == 'Notify'}


		#debugger
		if ce && ie
			sbe = @allEvents.find{ |x|  x.time == ce.time &&
			x.distance == '0' &&
			x.itemType == 'SolvedBy' &&
			x.controller == 'relate' &&
			x.action == 'Notify'
			}	
			#debugger
			if sbe
				return RelationEvent.new sbe, ce.to_id, ie.to_id
			end
		else
			return nil
		end
	end
	def sbLog
		ce = @filteredEvents.find { |x| x.controller == 'create' && x.distance == '0' && x.itemType == 'Alternative'}
		if not ce
			#puts "didn't find creation - bailing out"
			return nil
		end

		sbe = @allEvents.find{ |x|  x.time == ce.time &&
			x.distance == '0' &&
			x.itemType == 'SolvedBy' &&
			x.controller == 'relate' &&
			x.action == 'Notify'
			}

		ie = @allEvents.find{ |x| x.time == ce.time && 
			x.user == ce.user && 
			x.distance == '1' &&
			x.itemType == 'Issue' &&
			x.controller == 'relate' &&
			x.action == 'Notify'}

		if sbe && ie
			#puts 'found solvedBy and issue - creating relation event'
			return RelationEvent.new sbe, @id, ie.to_id 
		else
			#puts "didn't find either sb or issue - bailing out"
			return nil 
		end
	end
	def delete
		ce = @filteredEvents.find { |x| x.controller == 'create' && x.distance == '0' && x.itemType == 'Alternative'}
		de = @filteredEvents.find { |x| x.controller == 'RController' && x.verb == 'DELETE' && x.action =='destroy'}
#		debugger
		if ce && de
			return DestructionEvent.new de
		else
			#puts 'failed to find destruction event'
		end
	end
	def statuses
		re = relate
		
		# if there is no SB (akward) then there is nothing to observe 
		if not relate
			return []
		end
		
		sbli = SolvedByLogItem.new re.to_id, @allEvents
		sblievs = sbli.analyze 
		return sblievs
	end
end