namespace :checkin do
  desc "TODO"
  task delete: :environment do
    Checkin.destroy_all
  end

end
