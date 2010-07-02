require 'test_helper'
require 'dynamic_type'

class DynamicTypesControllerTest < ActionController::TestCase
  fixtures :dynamic_types
  
  def test_create
    assert_difference('DynamicType.count') do
      post :create, :dynamic_type => { :name=>"dtName" }
    end
  end
  
  def test_destroy
    assert_difference('DynamicType.count', -1) do
      delete :destroy, :id => DynamicType.first.to_param
    end
  end

  def test_edit
      get :edit, :id => DynamicType.first.to_param
      assert_response :success   
  end

  def test_index
    get :index
    assert_response :success
    assert_not_nil assigns(@dynamic_types)
  end

  def test_new
      get :new
      assert_response :success  
  end

  def test_show
    get :show, :id => DynamicType.first.to_param
    assert_response :success  
  end
  
  def test_update
    put :update, :id => DynamicType.first.to_param, :dynamic_type => { :name=>"anotherDTname"}
    
    assert_redirected_to dynamic_type_path(DynamicType.first.to_param)
  end
end
