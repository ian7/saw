
class Project < TreeTag
  has_and_belongs_to_many :managers, :class_name=>'User'
  has_and_belongs_to_many :users, :class_name=>'User'
  has_and_belongs_to_many :observers, :class_name=>'User'
end