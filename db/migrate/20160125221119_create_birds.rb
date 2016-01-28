class CreateBirds < ActiveRecord::Migration
  def change
    create_table :birds do |t|
      t.string :com_name
      t.string :sci_name
      t.timestamps null: false
    end
  end
end
