class ReportCollection < ActiveRecord::Base
  has_many :reports
  geocoded_by :address
  # after_validation :geocode
  after_create :geocode

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

  def address
    if !self.location
      self.location = "Prospect Park, NY"
    end

    self.location
  end

end
