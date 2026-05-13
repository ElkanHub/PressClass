-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table if not exists documents_embeddings (
  id uuid primary key default gen_random_uuid(),
  bot_namespace text not null,
  source_path text not null,
  content text not null,
  embedding vector(1536), -- OpenAI embeddings are 1536 dimensions
  metadata jsonb,
  created_at timestamptz default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table documents_embeddings enable row level security;

-- Create a function to search for documents
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_namespace text
) returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
) language plpgsql stable as $$
begin
  return query
  select
    documents_embeddings.id,
    documents_embeddings.content,
    documents_embeddings.metadata,
    1 - (documents_embeddings.embedding <=> query_embedding) as similarity
  from documents_embeddings
  where 1 - (documents_embeddings.embedding <=> query_embedding) > match_threshold
  and documents_embeddings.bot_namespace = filter_namespace
  order by documents_embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- INDEXING
-- Create an index for faster queries (optional but recommended for larger datasets)
-- IVFFlat index is efficient for vector similarity search
-- Note: 'lists' parameter should be adjusted based on table size (rows / 1000)
create index on documents_embeddings using ivfflat (embedding vector_cosine_ops)
with
  (lists = 100);
