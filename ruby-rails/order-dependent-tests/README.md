# Rails tests that pass alone and fail together

Companion to **Rails Tests That Pass Alone and Fail Together** (unpublished).

Ruby 4.0.6, ActiveSupport 8.1.4, RSpec 3.13.2. This uses a Rails component in a standalone process, not a complete Rails application.

```sh
mise install
mise exec -- ruby -S bundle install
mise exec -- ruby -S bundle exec rspec spec/leaking_spec.rb:4
mise exec -- ruby -S bundle exec rspec spec/leaking_spec.rb:9
mise exec -- ruby -S bundle exec rspec spec/leaking_spec.rb --order defined
mise exec -- ruby -S bundle exec rspec spec/leaking_spec.rb --order defined --bisect
mise exec -- ruby -S bundle exec rspec spec/isolated_spec.rb --order random --seed 123
```

The full leaking suite is **expected to fail**. The two individually selected specs start separate processes and pass. The fixed suite resets before and after each example, even on failure.

Rails resets CurrentAttributes around managed requests; these standalone specs do not enter that lifecycle. Resetting here does not isolate database transactions, global caches or external services. If a production job leaks state, repair its boundary too.

Sources: https://api.rubyonrails.org/classes/ActiveSupport/CurrentAttributes.html and https://rspec.info/features/3-13/rspec-core/command-line/bisect/

## If a child process uses the wrong Ruby

Check `mise exec -- ruby -v`. On the validation Mac, direct Bundler shebang resolution selected a different Ruby, and bisect needed the runtime directory in child PATH. Use this session-local fix before the commands above:

```sh
export PATH="$(mise where ruby)/bin:$PATH"
```

This changes only the current shell, not your global configuration.
