Recruiters rarely search for exactly the words a candidate wrote. A job description asks for "line maintenance experience on narrow-body aircraft", while a CV says "B1 engineer, A320 family, overnight checks". A keyword search misses that match. A semantic search finds it.

This post walks through the approach we used on recruitment platforms like **SmartMatch** and **TalentVista**.

## 1. Turn unstructured CVs into structured data

CVs arrive as PDFs and Word files in every possible layout. The first step is extraction:

- Convert the document to text.
- Ask an LLM (we used Google Gemini) to return a **strict JSON schema**: roles, years of experience, skills, certifications, education.
- Validate the JSON before saving it — never trust model output blindly.

Structured fields power filters ("at least 5 years", "has certification X"), while the full text feeds the semantic layer.

## 2. Generate embeddings for meaning, not keywords

Each CV and each job description gets converted into a **vector embedding**. Texts with similar meaning end up close together in vector space, even if they share few words.

A few practical lessons:

- **Embed focused chunks**, not the whole CV in one go — a summary, the experience section and the skills section work better separately.
- **Store the model name and version** with every vector. If you change models, old and new vectors are not comparable.
- **Re-embed in background jobs** so uploads stay fast.

## 3. Index and search with Apache Solr

Solr supports dense vector fields alongside its classic text search. That lets one query combine:

1. **Hard filters** — location, availability, certifications.
2. **Vector similarity** — how close the candidate is in meaning to the job description.
3. **Keyword boosts** — exact terms the recruiter insists on.

Combining all three gives far better results than any one of them alone.

## 4. Explain the score

A number like "87% match" is not enough for a recruiter to trust. We used an LLM to write a short explanation for each top candidate: matching strengths, potential gaps, and questions worth asking in the interview. This is retrieval-augmented generation (RAG) — the model only reasons over the retrieved candidate data, not its general knowledge.

## What to watch out for

- **Bias:** keep the scoring criteria transparent and let humans make the final decision.
- **Cost:** embeddings are cheap, LLM explanations are not — generate them only for the shortlist.
- **Privacy:** CVs are personal data. Restrict who can see them and how long you keep them.

---

*Building something similar? [Get in touch](/#contact) — I'm happy to talk through your use case.*
