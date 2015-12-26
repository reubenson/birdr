class Report < ActiveRecord::Base
  belongs_to :report_collection

  # def obs_dt=(date)
  #   binding.pry
  #   @obs_dt = DateTime.parse(date)
  # end
end
