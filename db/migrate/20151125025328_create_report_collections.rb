class CreateReportCollections < ActiveRecord::Migration
  def change
    create_table :report_collections do |t|
      
      t.timestamps null: false
    end
  end
end
