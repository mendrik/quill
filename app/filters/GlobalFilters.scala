package filters

import javax.inject.Inject

import play.api.http.HttpFilters
import play.filters.cors.CORSFilter

class GlobalFilters @Inject() (
    corsFilter: CORSFilter
) extends HttpFilters {
  def filters = Seq(corsFilter)
}

