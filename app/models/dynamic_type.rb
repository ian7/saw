class DynamicType # < ActiveRecord::Base
	include Mongoid::Document
	unloadable

    field :name, :type => String
    field :super_type, :type => String
    field :surrogate_class, :type => String

	def self.find_by_name( name )
		DynamicType.find(:first, :conditions=>{:name=>name })
	end

	#  has_many :dynamic_type_attributes, :foreign_key=>"type_name", :primary_key=>"name"
	#  has_many :dynamic_type_scopes, :foreign_key=>"type_name", :primary_key=>"name"
	def dynamic_type_attributes
		return DynamicTypeAttribute.find( :all, :conditions=>{:type_name=>name})
	end

	def dynamic_type_scopes
		return DynamicTypeScope.find( :all, :conditions=>{:type_name=>name} )
	end

	def scope
		scopes = DynamicTypeScope.find :all, :conditions=>{:type_name=>name}
		types = []
		scopes.each do |scope|
			found_type = DynamicType.find :first, :conditions=>{:name=>scope.type_scope}
			if found_type != nil
			types << found_type
			end
		end
		return types
	end

	def new_instance( instance_name = nil, creator = nil )

		## this will look upwards on the inheritance structure
		#
		#  type_with_surogate = type
		#
		#  while (surrogate_class == nil || surrogate_class == "")
		#
		#    if super_type == nil
		#      raise "This DynamicType has no surrogate nor super DynamicType - failing"
		#    end
		#
		#    super_dt = DynamicType.find_by_name super_type
		#
		#    if super_dt == nil
		#      raise "Dynamic type without surogate class in the inheritance hierarhy"
		#    end

		instance = surrogate_class.constantize.new
		instance.type = name
		instance.name = instance_name
		instance._type = surrogate_class

		if creator != nil  
		  instance.creator = creator
		  instance.author = creator
		end

		# is this really right there ? - not
		#instance.save

		return instance
	end

	def find_by_name( instance_name )
		Taggable.find :all, :conditions=>{:type=>name, :name=>instance_name}
	end

	def count
		Taggable.find(:all, :conditions=>{:type=>name}).size
	end

	def children_types
		DynamicType.find :all, :conditions=>{:super_type=>name}
	end

	def children_types_recursive
		children = children_types
		retval = []

		children_types.each do |child|
			retval << child
			sub_children = child.children_types_recursive

			sub_children.each do |sub_child|
				retval << sub_child
			end
		end
		return retval
	end

	def instances
		Taggable.find :all, :conditions=>{:type=>name}
	end

	def children_instances
		retval = []
		children_types.each do |type|
			type.instances.each do |instance|
				retval << instance
			end
		end
		return retval
	end

	def children_instances_recursive
		retval = []
		children_types_recursive.each do |type|
			type.instances.each do |instance|
				retval << instance
			end
		end
		return retval
	end

	def to_hash
		h={}
		h["name"]=name
		h["id"]=id
		h['super_type']=super_type
		##h["data"]=[]
		h["attributes"]=[]
        DynamicTypeAttribute.find(:all, :conditions=>{:type_name=>name}).each do |a|
          h["attributes"] << a.attribute_name
        end

		h["scopes"]=[]
        DynamicTypeScope.find( :all, :conditions=>{:type_name=>name} ).each do |a|
			s = {}
			s["scope"] = a.type_scope
			if a['type_domain']
				s["domain"] = a.type_domain
			end
         	h["scopes"] << s.to_hash
        end

        h["children"] = []
		children_types.each do |child|
			h["children"] << child.name
		end

		return h
	end

	def to_hash_recursive
		h = to_hash

		children = children_types
		h["children"]=[]

		children_types.each do |child|
			h["children"] << child.to_hash_recursive
		end
		return h
	end

	## simply doens't work
	def<=>( a )
		if( a.name > name )
		return -1
		end

		if( a.name < name )
		return 0
		end

		return 0
	end

end
