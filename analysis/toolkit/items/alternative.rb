require_relative './logItem.rb'

class AlternativeLogItem < LogItem
	def initialize( paramId = nil, paramEvents = nil )
		super paramId, paramEvents
	end
	def status
	end
	def analyze( output )
		@output.puts creation.to_s
		update.each do |x|
			@output.print x.to_s + "\t"
			@output.print (x.time.to_i-creation.time.to_i ).to_s + "\t"
			@output.print "\n"
		end
		focus.each do |x|
			@output.print x.to_s + "\t"
			@output.print "\n"
		end
		self.sbLog
#		relate.each do |x|
#			@output.print x.to_s + "\t"
#			@output.print "\n"
#		end
		if delete
			@output.print delete.to_s + "\t"
			@output.print (delete.time.to_i - creation.time.to_i).to_s + "\t"
			@output.puts
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
		iev = @allEvents.find{ |x| x.time == ce.time && 
			x.user == ce.user && 
			x.distance == '1' &&
			x.itemType == 'Issue' &&
			x.controller == 'relate' &&
			x.action == 'Notify'}


		#debugger
		if re
			sbe = @allEvents.find{ |x|  x.time == ce.time &&
			x.distance == '0' &&
			x.itemType == 'SolvedBy' &&
			x.controller == 'relate' &&
			x.action == 'Notify'
			}	
			if Taggable.exists? :conditions=>{:id=>sbe.id}
				rei = Taggable.find :first, :conditions=>{:origin=>@id, :tip=>re.to_id}
			else
				puts 'found tagging event, but no relation '
			end

			return RelationEvent.new re
		else
			return nil
		end
	end
	def sbLog
		ce = @filteredEvents.find { |x| x.controller == 'create' && x.distance == '0' && x.itemType == 'Alternative'}
		if not ce
			puts "didn't find creation - bailing out"
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
			puts "didn't find either sb or issue - bailing out"
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
end