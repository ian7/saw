require File.dirname(__FILE__) + '/../test_helper'
#require 'test_helper'
require 'alternatives_controller'

class AlternativesControllerTest < ActionController::TestCase
    fixtures :taggables

  
  def setup
    @controller = AlternativesController.new
    @request = ActionController::TestRequest.new
    @response = ActionController::TestResponse.new
  end
  
  test "getting index" do
    get :index
    assert_response :success
    
    # and there we count the items in the index.
    #assert_tag :tag => "table", :children=> { :count=>1, :only=> {:tag=>"th"}}    
    assert_not_nil assigns(:alternatives)
  end
  
  test "should get new alternative" do
    get :new
    assert_response :success
  end
  
  test "should create alternative" do
    assert_difference('DynamicType.find_by_name("Alternative").count') do
      post :create, :alternative => { :id=>"123", :name=>"tralala", :comment=>"xxx"}
    end
    
    #assert_redirected_to alternative_path(assigns(:alternative))
  end
  
  test "should show alternative" do
   # TODO: that is quite ugly.... i should work more on the 
       
    get :show, :id => Taggable.find(:all, :conditions=>{:type=>"Alternative"})[0].to_param
    assert_response :success
  end
  
  test "should get edit" do
    # TODO: that is quite ugly.... i should work more on the 
    
    get :edit, :id => Taggable.find(:all, :conditions=>{:type=>"Alternative"})[0].to_param
    assert_response :success
  end
  
  test "should update alternative" do
    # TODO: that is quite ugly.... i should work more on the
 
    id = Taggable.find(:all, :conditions=>{:type=>"Alternative"})[0].to_param
 
    put :update, :id => id , :alternative => { :name=>"new_name" }
    
    assert_redirected_to "/alternatives/"+id.to_s
  end
  
  test "should destroy alternative" do
    assert_difference('Taggable.find(:all, :conditions=>{:type=>"Alternative"}).size', -1) do
      delete :destroy, :id =>  Taggable.find(:all, :conditions=>{:type=>"Alternative"})[0].to_param
    end
    
    assert_redirected_to "/alternatives"
  end
  
end
