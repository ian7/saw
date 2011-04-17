# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

require 'yaml'


dynamic_types = YAML::load_file("#{Rails.root}/test/fixtures/dynamic_types.yml")

dynamic_types.each{ |name, values|
	dt=DynamicType.new
	dt.name = values["name"]
	dt.super_type = values["super_type"]
	dt.surrogate_class  = values["surrogate_class"]
	dt.save
	}

dynamic_type_attributes = YAML::load_file("#{Rails.root}/test/fixtures/dynamic_type_attributes.yml")

dynamic_type_attributes.each{ |name, values|
	dt=DynamicTypeAttribute.new
	dt.type_name = values["type_name"]
	dt.attribute_name = values["attribute_name"]
	dt.save
	}

dynamic_type_scopes = YAML::load_file("#{Rails.root}/test/fixtures/dynamic_type_scopes.yml")

dynamic_type_scopes.each{ |name, values|
	dt=DynamicTypeScope.new
	dt.type_name = values["type_name"]
	dt.type_scope = values["type_scope"]
	dt.save
	}


items = YAML::load_file("#{Rails.root}/test/fixtures/taggables.yml")

items.each{ |name, values|
	item=DynamicType.find_by_name(values["type"]).new_instance( values["name"] )
	item.save

	values.each { |key,value|
	    # just skip these two
	    if key=="type" || key == "name"
	      next
	    end
#	    puts "key: "+key+ " value: "+value
	    item[key]=value
    }
  item.save
	}

users = YAML::load_file("#{Rails.root}/test/fixtures/users.yml")

  users.each{ |name, values|
  	u = User.new({ :email=> values['email'], :password=>values['password']})
  	u.save
  	}
puts 'total users: ' + User.count.to_s

IBMImportController.load('test/ibm-data/')
