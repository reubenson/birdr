class Report < ActiveRecord::Base
  belongs_to :report_collection

  def obs_dt=(date)
    @obs_dt = DateTime.parse(date)
  end
end
