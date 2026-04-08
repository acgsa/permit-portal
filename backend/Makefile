.PHONY: generate-schemas generate-types migrate seed help

PYTHON ?= python
PIC_SCHEMA := pic-standards/src/jsonschema/nepa.schema.json

help:  ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

generate-schemas: $(PIC_SCHEMA)  ## Regenerate Pydantic models from PIC JSON Schema
	$(PYTHON) -m datamodel_code_generator \
		--input $(PIC_SCHEMA) \
		--output app/schemas/pic.py \
		--output-model-type pydantic_v2.BaseModel \
		--use-schema-description \
		--use-field-description \
		--target-python-version 3.9

generate-types: $(PIC_SCHEMA)  ## Regenerate TypeScript types from PIC JSON Schema
	npx json-schema-to-typescript $(PIC_SCHEMA) -o ../../src/types/pic.d.ts

migrate:  ## Run Alembic migrations to head
	$(PYTHON) -m alembic upgrade head

seed:  ## Run PIC sample data seed
	SEED_PIC_DATA=true $(PYTHON) -c "from app.main import _seed_pic_data; from app.core.db import SessionLocal; db=SessionLocal(); _seed_pic_data(db); db.close()"

migrate-data:  ## Run one-time data migration (workflow_runs + pre_screener_drafts → PIC)
	$(PYTHON) -m scripts.migrate_data
