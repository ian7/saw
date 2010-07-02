require 'test_helper'
require 'dynamic_type'
require 'ibm_import_controller'

class IBMImportControllerTest < ActiveSupport::TestCase
  fixtures :dynamic_types, :dynamic_type_attributes, :dynamic_type_scopes
  
  # Replace this with your real tests.
  test "count imported items" do
    
    ## firs of all i import the thing into the testing databse
    IBMImportController.load "test/ibm-data/"
    
    ## Issues count 
    assert Taggable.find(:all, :conditions=>{:type=>"Issue"}).size == 23 +1 # the one is included in the fixture
    
    ## Alternatives count
    assert Taggable.find(:all, :conditions=>{:type=>"Alternative"}).size == 107+1 # the one is included in the fixture
    
    ## Dependencies count
    assert Taggable.find(:all, :conditions=>{:type=>"Influences"}).size == 30

    ## TopicGroups count
    assert Taggable.find(:all, :conditions=>{:type=>"TopicGroup"}).size == 15
  end
end