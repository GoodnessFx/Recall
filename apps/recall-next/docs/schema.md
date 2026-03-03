# Database Schema

Tables:
- profiles (id, user_id, x_user_id, created_at)
- saved_items (id, user_id, source, original_url, title, text_content, media_urls, raw_json, created_at, updated_at, tsv)
- item_embeddings (id, item_id, embedding, created_at)
- tags (id, user_id, name, color, icon)
- item_tags (item_id, tag_id)
- reminders (id, user_id, item_id, title, description, due_date, recurring, notified)
- contacts (id, user_id, name, birthday_date, contact_data)
- user_settings (user_id, preferences)

Indexes:
- HNSW index on item_embeddings.embedding
- GIN on saved_items.tsv

Function:
- hybrid_search(user_uuid, query_embedding, query_text, match_count)

