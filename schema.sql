--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ball; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE ball (
    id integer NOT NULL
);


--
-- Name: ball_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE ball_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ball_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE ball_id_seq OWNED BY ball.id;


--
-- Name: posts; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE posts (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    body text NOT NULL,
    created_on timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE posts_id_seq OWNED BY posts.id;


--
-- Name: users; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(355) NOT NULL,
    created_on timestamp without time zone DEFAULT now() NOT NULL,
    last_login timestamp without time zone,
    admin boolean DEFAULT false,
    sin character(11)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;

--
-- Name: id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY ball ALTER COLUMN id SET DEFAULT nextval('ball_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY posts ALTER COLUMN id SET DEFAULT nextval('posts_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: ball_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('ball_id_seq', 1, false);


--
-- Name: ball_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY ball
    ADD CONSTRAINT ball_pkey PRIMARY KEY (id);


--
-- Name: posts_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: users_email_key; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_username_key; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: fk_user_id; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY posts
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: public; Type: ACL; Schema: -;
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

