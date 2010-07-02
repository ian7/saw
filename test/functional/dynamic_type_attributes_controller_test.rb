require 'test_helper'

class DynamicTypeAttributesControllerTest < ActionController::TestCase
fixtures :dynamic_type_attributes
  
  def test_create
    assert_difference('DynamicTypeAttribute.count') do
      post :create, :dynamic_type_attribute => { :type_name=>"dtaName" }
    end
  end
  
  def test_destroy
    assert_difference('DynamicTypeAttribute.count', -1) do
      delete :destroy, :id => DynamicTypeAttribute.first.to_param
    end
  end

  def test_edit
      get :edit, :id => DynamicTypeAttribute.first.to_param
      assert_response :success   
  end

  def test_index
    get :index
    assert_response :success
    assert_not_nil assigns(@dynamic_type_attributes)
  end

  def test_new
      get :new
      assert_response :success  
  end

  def test_show
    get :show, :id => DynamicTypeAttribute.first.to_param
    assert_response :success  
  end
  
  def test_update
    put :update, :id => DynamicTypeAttribute.first.to_param, :dynamic_type_attribute => { :type_name=>"anotherDTAname"}
    assert_redirected_to dynamic_type_attribute_path(DynamicTypeAttribute.first.to_param)
  end

end
