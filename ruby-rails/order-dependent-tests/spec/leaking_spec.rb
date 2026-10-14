require_relative "../current"

RSpec.describe "Account state without lifecycle isolation" do
  it "sets an account for one operation" do
    Current.account_id = "account-a"
    expect(Current.account_id).to eq("account-a")
  end

  it "starts an unrelated operation with no account" do
    expect(Current.account_id).to be_nil
  end
end
