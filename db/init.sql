CREATE SEQUENCE IF NOT EXISTS notes_id_seq;

CREATE TABLE IF NOT EXISTS public.notes (
    id integer NOT NULL DEFAULT nextval('notes_id_seq'::regclass),
    title character varying(255) NOT NULL,
    content text,
    CONSTRAINT notes_pkey PRIMARY KEY (id)
);

ALTER SEQUENCE notes_id_seq OWNED BY public.notes.id;