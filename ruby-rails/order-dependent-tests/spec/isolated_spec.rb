require_relative "../current"

RSpec.describe "Account state with lifecycle isolation" do
  around do |example|
    Current.reset
    begin
      example.run
    ensure
      Current.reset
    end
  end

  it "sets an account for one operation" do
    Current.account_id = "account-a"
    expect(Current.account_id).to eq("account-a")
  end

  it "starts an unrelated operation with no account" do
    expect(Current.account_id).to be_nil
  end
end
