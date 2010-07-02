require 'test_helper'
require 'dynamic_type'

class TaggableTest < ActiveSupport::TestCase
  fixtures :dynamic_types, :dynamic_type_attributes, :dynamic_type_scopes
  
  # Replace this with your real tests.
  test "if sope count works" do
    project = DynamicType.find :first, :conditions=>{:name=>"Project"}
    assert project.scope.size == 2
  end
end
