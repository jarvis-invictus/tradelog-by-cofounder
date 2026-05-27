-- Fix rules and rule_violations schema to match spec

-- Update rules table columns
alter table public.rules rename column rule_type to type;
alter table public.rules rename column name to label;
alter table public.rules rename column is_active to enabled;

-- Convert threshold to jsonb (will be text in intermediate state, cast to jsonb)
alter table public.rules alter column threshold type jsonb using to_jsonb(threshold);
alter table public.rules drop column if exists threshold_unit;

-- Update rule_violations column
alter table public.rule_violations rename column triggered_at to occurred_at;

-- Ensure foreign keys reference users table (if profiles was renamed to users)
-- Note: This assumes public.users exists. If profiles still exists, skip this.
-- The handle_new_user function should insert into users, not profiles

-- Update comments for clarity
comment on column public.rules.type is 'Rule type: max_trades_per_day, max_daily_loss_inr, min_risk_reward';
comment on column public.rules.label is 'Human-readable rule name';
comment on column public.rules.threshold is 'JSONB threshold config: {limit}, {amount}, or {ratio}';
comment on column public.rules.enabled is 'Whether the rule is active';
comment on column public.rule_violations.occurred_at is 'Timestamp when violation occurred';
