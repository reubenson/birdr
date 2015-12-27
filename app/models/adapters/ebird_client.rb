module Adapters
	class EbirdClient

		def connection
			@connection = Adapters::EbirdConnection.new
		end

		def valid_species?(name)
			# eBird allows non-specific taxanomic observation data to be logged,
			# which i've chosen to exclude in populating the species list here.
			# see http://help.ebird.org/customer/portal/articles/1006768-entering-non-species-taxa
			name && !name.include?('sp.') && !name.include?('hybrid') && !name.include?('/') && !name.include?('Domestic type')
		end

		def find_by_species(species)
			results = connection.species_query(species)
		end

		def find_by_location(latitude,longitude)
			results = connection.location_query(latitude,longitude)
			reports = results.collect do |r|
	      if valid_species?(r["comName"])
	        Report.new({
	          obs_dt: DateTime.parse(r["obsDt"]),
	          lng: r["lng"],
	          lat: r["lat"],
	          how_many: r["howMany"],
	          com_name: r["comName"],
	          sci_name: r["sciName"]
	        });
	      end
	    end
			reports.compact
		end

	end
end
