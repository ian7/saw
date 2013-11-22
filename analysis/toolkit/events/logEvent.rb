require 'json'

# this actually wrapes single line of digest and gives names to the fields
# mind, that if digest changes this is going to change too
class LogEvent < Array
	def initialize( content )
		super( content )
		if self[13] && self[13] != "(no)" #&& (self[13].match(/created_at/)==nil)
			begin
				@parameters = JSON.parse(self[13].gsub("\;",",").gsub("nil","\"nil\""))
				#@parameters = {}
			rescue Exception => e
				@parameters = {}
			end
		else
			@parameters = {}
		end
	end
	def id
		return self[8]
	end 
	def ip
		return self[0]
	end
	def time
		return self[1]
	end
	def user
		return self[2]
	end
	def verb
		return self[5]
	end
	def controller 
		return self[6]
	end
	def action
		return self[7]
	end
	def item_id
		return self[8]
	end
	def to_id
		return self[9]
	end
	def distance
		return self[10]
	end
	def related_to
		return self[10]
	end
	def related_from
		return self[11]
	end
	def itemType
		return self[11].to_s.strip
	end
	def taggingTip
		return self[11]
	end
	def payload
		return self[12].to_s.strip
	end
	def param
		return self[4]
	end
	def parameters
		return @parameters
	end
end