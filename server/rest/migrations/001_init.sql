create table if not exists tracked_emails (
  id serial primary key,
  tracking_id uuid unique not null,
  gmail_message_id text not null,
  user_id text not null,
  subject text,
  created_at timestamp default now()
);

create table if not exists email_opens (
  id serial primary key,
  tracking_id uuid not null references tracked_emails(tracking_id),
  ip_address text,
  user_agent text,
  opened_at timestamp default now()
);

create table if not exists email_clicks (
  id serial primary key,
  tracking_id uuid not null references tracked_emails(tracking_id),
  url text,
  ip_address text,
  user_agent text,
  clicked_at timestamp default now()
);