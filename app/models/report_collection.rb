class ReportCollection < ActiveRecord::Base
  has_many :reports

  def centroid
    lats = []
    lngs = []
    self.reports.each do |report|
      lats << report.lat
      lngs << report.lng
    end

    [ lats.inject{|sum,lat| sum+lat}/lats.length , lngs.inject{|sum,lng| sum+lng}/lngs.length ]
  end

  def species_list
    self.reports.pluck(:com_name)
  end

  def search_species
    self.reports.where('com_name LIKE (?)',"%#{self.query}")
  end
end
