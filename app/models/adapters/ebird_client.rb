module Adapters
	class EbirdClient
		def connection
			@connection = Adapters::EbirdConnection.new
		end

		def find_by_species(species)
			results = connection.species_query(species)
		end

		def find
			results = connection.location_query()
		end

	end
end
