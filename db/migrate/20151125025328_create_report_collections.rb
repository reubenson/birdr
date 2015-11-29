class CreateReportCollections < ActiveRecord::Migration
  def change
    create_table :report_collections do |t|
      t.string :query

      t.timestamps null: false
    end
  end
end
