class Bird < ActiveRecord::Base
  has_many :watchlist_items
  has_many :users, through: :watchlist_items

  def self.get_sci_name(searched_name)

    csv = CSV.read("lib/assets/ebird_taxa.csv")
    csv.shift
    common_names = csv.map{|row| row[1]}
    sci_names = csv.map{|row| row[0]}

    name_not_found = true
    common_names.each_with_index do |name,i|
      if name.match(/#{searched_name}/i)
        # name_not_found = false
        # render json: {
          # success: true ,
          # text:    sci_names[i]
        # }
        return sci_names[i]
      end
    end

    nil
  end
end
