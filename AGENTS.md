# TurfTrack Frontend Rules

- Bangla is the default user-facing language.
- English is the secondary language.
- Never hardcode user-facing text inside components.
- Use translation keys instead.
- Never translate database values, enum values, IDs, API values, URLs, or code identifiers.
- Preserve existing business logic.
- Preserve existing Tailwind styling.
- Do not change API contracts during i18n migration.
- Use natural Bangladeshi Bangla, not literal word-for-word translation.
- Keep common TurfTrack terminology consistent:
  Turf, Booking, Player, Payment, Wallet, Payout, Venue, Manager, Owner.
- Dynamic values must use interpolation.