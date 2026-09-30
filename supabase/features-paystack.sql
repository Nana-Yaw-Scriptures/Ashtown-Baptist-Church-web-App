-- =============================================================
-- Switch giving to Paystack: rename the provider columns on donations
-- from Stripe-specific names to neutral ones. Safe to run once.
-- =============================================================
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='donations' and column_name='stripe_session_id') then
    alter table public.donations rename column stripe_session_id to provider_reference;
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='donations' and column_name='stripe_payment_intent') then
    alter table public.donations rename column stripe_payment_intent to provider_transaction;
  end if;
end $$;
