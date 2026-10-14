require "active_support"
require "active_support/current_attributes"

class Current < ActiveSupport::CurrentAttributes
  attribute :account_id
end
